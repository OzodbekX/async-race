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
}
