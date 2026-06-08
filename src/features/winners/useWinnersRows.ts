import { useEffect, useState } from 'react'
import { fetchCar } from '../../api/racingApi'
import { DEFAULT_CAR_COLOR } from '../../constants'
import type { WinnerWithCar } from '../../types'

interface WinnersData {
  winners: { id: number; wins: number; time: number }[]
}

export function useWinnersRows(data: WinnersData | undefined): WinnerWithCar[] {
  const [rows, setRows] = useState<WinnerWithCar[]>([])

  useEffect(() => {
    let cancelled = false
    const winners = data?.winners ?? []
    Promise.all(
      winners.map(async (w) => {
        try {
          const car = await fetchCar(w.id)
          return { ...w, name: car.name, color: car.color }
        } catch {
          return { ...w, name: `#${w.id}`, color: DEFAULT_CAR_COLOR }
        }
      }),
    ).then((enriched) => {
      if (!cancelled) setRows(enriched)
    })
    return () => {
      cancelled = true
    }
  }, [data])

  return rows
}
