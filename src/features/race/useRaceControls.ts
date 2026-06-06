import { useCallback, useEffect } from 'react'
import { useStore } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import type { RootState } from '../../app/store'
import type { Car } from '../../types'
import {
  racingApi,
  useCreateWinnerMutation,
  useDriveMutation,
  useToggleEngineMutation,
  useUpdateWinnerMutation,
} from '../../api/racingApi'
import {
  advance,
  clearWinner,
  engineBroke,
  engineStarted,
  resetCar,
  resetRace,
  setRacing,
  setWinner,
} from './raceSlice'

/**
 * Drives the race for the cars currently on the page: engine start/stop,
 * the rAF animation loop, winner detection, and persistence of winners.
 *
 * The animation loop lives in a `useEffect`, so its cleanup cancels the
 * pending frame when the Garage view unmounts. Car progress stays in the
 * store, giving freeze-on-leave / resume-on-return for free.
 */
export function useRaceControls(cars: Car[]) {
  const dispatch = useAppDispatch()
  const store = useStore<RootState>()
  const [toggleEngine] = useToggleEngineMutation()
  const [drive] = useDriveMutation()
  const [createWinner] = useCreateWinnerMutation()
  const [updateWinner] = useUpdateWinnerMutation()

  const hasDriving = useAppSelector((s) =>
    Object.values(s.race.cars).some((c) => c.phase === 'driving'),
  )
  const racing = useAppSelector((s) => s.race.racing)
  const winnerId = useAppSelector((s) => s.race.winnerId)
  const raceCars = useAppSelector((s) => s.race.cars)

  // Single rAF loop advancing every driving car by real elapsed time.
  useEffect(() => {
    if (!hasDriving) return undefined
    let last: number | null = null
    let frame = requestAnimationFrame(function tick(t) {
      const dt = last === null ? 0 : t - last
      last = t
      const current = store.getState().race.cars
      Object.entries(current).forEach(([id, car]) => {
        if (car.phase === 'driving') dispatch(advance({ id: Number(id), dtMs: dt }))
      })
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [hasDriving, dispatch, store])

  const saveWinner = useCallback(
    async (id: number, time: number) => {
      try {
        const existing = await dispatch(
          racingApi.endpoints.getWinner.initiate(id),
        ).unwrap()
        await updateWinner({
          id,
          wins: existing.wins + 1,
          time: Math.min(existing.time, time),
        }).unwrap()
      } catch {
        await createWinner({ id, wins: 1, time }).unwrap()
      }
    },
    [dispatch, createWinner, updateWinner],
  )

  // Announce + persist the first car to finish during a "Race all" run.
  useEffect(() => {
    if (!racing || winnerId !== null) return
    const finished = cars
      .map((c) => ({ id: c.id, state: raceCars[c.id] }))
      .filter((c) => c.state?.phase === 'finished')
    if (finished.length === 0) return
    const best = finished.reduce((a, b) => (b.state.time < a.state.time ? b : a))
    dispatch(setWinner({ id: best.id, time: best.state.time }))
    saveWinner(best.id, best.state.time).catch(() => {})
  }, [racing, winnerId, raceCars, cars, dispatch, saveWinner])

  const startCar = useCallback(
    async (id: number) => {
      try {
        const { velocity, distance } = await toggleEngine({
          id,
          status: 'started',
        }).unwrap()
        dispatch(engineStarted({ id, duration: distance / velocity }))
        try {
          await drive(id).unwrap()
        } catch {
          dispatch(engineBroke(id))
        }
      } catch {
        dispatch(engineBroke(id))
      }
    },
    [toggleEngine, drive, dispatch],
  )

  const stopCar = useCallback(
    async (id: number) => {
      await toggleEngine({ id, status: 'stopped' })
        .unwrap()
        .catch(() => {})
      dispatch(resetCar(id))
    },
    [toggleEngine, dispatch],
  )

  const startRace = useCallback(async () => {
    dispatch(clearWinner())
    dispatch(setRacing(true))
    try {
      await Promise.allSettled(cars.map((c) => startCar(c.id)))
    } catch {
      dispatch(setRacing(false))
    }
  }, [cars, dispatch, startCar])

  const resetAll = useCallback(async () => {
    dispatch(setRacing(false))
    dispatch(clearWinner())
    await Promise.all(cars.map((c) => stopCar(c.id)))
    dispatch(resetRace())
  }, [cars, dispatch, stopCar])

  return { startCar, stopCar, startRace, resetAll, racing }
}
