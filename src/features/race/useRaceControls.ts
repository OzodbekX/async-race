import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import type { Car } from '../../types'
import { clearWinner, resetRace, setRacing } from './raceSlice'
import { useCarEngine } from './useCarEngine'
import { useRaceAnimation } from './useRaceAnimation'
import { useWinnerPersistence } from './useWinnerPersistence'

export function useRaceControls(cars: Car[]) {
  const dispatch = useAppDispatch()
  const racing = useAppSelector((s) => s.race.racing)

  const { startCar, stopCar } = useCarEngine()
  useWinnerPersistence(cars)
  useRaceAnimation()

  const startRace = useCallback(async () => {
    // Return every car to the start line first, so clicking Race again
    // (without Reset) always runs a fresh race instead of leaving cars
    // parked at the finish from the previous run.
    dispatch(resetRace())
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
