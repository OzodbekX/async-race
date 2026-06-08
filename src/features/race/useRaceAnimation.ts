import { useEffect } from 'react'
import { useStore } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import type { RootState } from '../../app/store'
import { advance } from './raceSlice'

export function useRaceAnimation() {
  const dispatch = useAppDispatch()
  const store = useStore<RootState>()
  const hasDriving = useAppSelector((s) =>
    Object.values(s.race.cars).some((c) => c.phase === 'driving'),
  )

  useEffect(() => {
    if (!hasDriving) return undefined
    let lastTimestamp: number | null = null
    let rafId = requestAnimationFrame(function tick(timestamp) {
      const elapsedMs = lastTimestamp === null ? 0 : timestamp - lastTimestamp
      lastTimestamp = timestamp
      const current = store.getState().race.cars
      Object.entries(current).forEach(([id, car]) => {
        if (car.phase === 'driving') dispatch(advance({ id: Number(id), elapsedMs }))
      })
      rafId = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(rafId)
  }, [hasDriving, dispatch, store])
}
