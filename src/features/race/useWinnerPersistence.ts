import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  racingApi,
  useCreateWinnerMutation,
  useUpdateWinnerMutation,
} from '../../api/racingApi'
import { setWinner } from './raceSlice'
import type { Car } from '../../types'

export function useWinnerPersistence(cars: Car[]) {
  const dispatch = useAppDispatch()
  const [createWinner] = useCreateWinnerMutation()
  const [updateWinner] = useUpdateWinnerMutation()
  const racing = useAppSelector((s) => s.race.racing)
  const winnerId = useAppSelector((s) => s.race.winnerId)
  const raceCars = useAppSelector((s) => s.race.cars)

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
}
