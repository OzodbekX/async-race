import { useCallback } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { useDriveMutation, useToggleEngineMutation } from '../../api/racingApi'
import { engineBroke, engineStarted, resetCar } from './raceSlice'

export function useCarEngine() {
  const dispatch = useAppDispatch()
  const [toggleEngine] = useToggleEngineMutation()
  const [drive] = useDriveMutation()

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

  return { startCar, stopCar }
}
