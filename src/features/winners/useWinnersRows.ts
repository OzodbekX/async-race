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
    let isCancelled = false
    const winners = data?.winners ?? []
    Promise.all(
      winners.map(async (winner) => {
        try {
          const car = await fetchCar(winner.id)
          return { ...winner, name: car.name, color: car.color }
        } catch {
          return { ...winner, name: `#${winner.id}`, color: DEFAULT_CAR_COLOR }
        }
      }),
    ).then((enriched) => {
      if (!isCancelled) setRows(enriched)
    })
    return () => {
      isCancelled = true
    }
  }, [data])

  return rows
}
