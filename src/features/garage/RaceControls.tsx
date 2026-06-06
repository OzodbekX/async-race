import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearWinner, setRacing } from '../race/raceSlice'
import { useCreateCarMutation } from '../../api/racingApi'
import { RANDOM_CARS_PER_CLICK } from '../../constants'
import { randomCarName, randomColor } from '../../utils/random'
import { btn } from '../../ui'
import type { Car } from '../../types'

interface RaceControlsProps {
  cars: Car[]
  racing: boolean
  onRace: () => void
  onReset: () => void
}

export default function RaceControls({
  cars,
  racing,
  onRace,
  onReset,
}: RaceControlsProps) {
  const dispatch = useAppDispatch()
  const [createCar] = useCreateCarMutation()
  const [generating, setGenerating] = useState(false)
  const winnerId = useAppSelector((s) => s.race.winnerId)
  const winnerTime = useAppSelector((s) => s.race.winnerTime)

  const winnerName = cars.find((c) => c.id === winnerId)?.name

  const generate = async () => {
    setGenerating(true)
    try {
      await Promise.all(
        Array.from({ length: RANDOM_CARS_PER_CLICK }, () =>
          createCar({ name: randomCarName(), color: randomColor() }).unwrap(),
        ),
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btn('primary')}
          onClick={onRace}
          disabled={racing || cars.length === 0}
        >
          🏁 Race
        </button>
        <button
          type="button"
          className={btn('secondary')}
          onClick={onReset}
          disabled={cars.length === 0}
        >
          ♻ Reset
        </button>
        <button
          type="button"
          className={btn('success')}
          onClick={generate}
          disabled={racing || generating}
        >
          {generating ? 'Generating…' : `Generate ${RANDOM_CARS_PER_CLICK} cars`}
        </button>
      </div>

      {winnerId !== null && winnerName && (
        <div
          role="status"
          className="animate-pop-in fixed left-1/2 top-1/2 z-[200] rounded-xl border-2 border-accent bg-panel px-10 py-8 text-center shadow-2xl"
        >
          <h2 className="mb-2 text-2xl font-bold text-accent">🏆 {winnerName} wins!</h2>
          <p className="mb-4 text-sm text-muted">Finished in {winnerTime?.toFixed(2)}s</p>
          <button
            type="button"
            className={btn('ghost')}
            onClick={() => { dispatch(clearWinner()); dispatch(setRacing(false)) }}
          >
            Close
          </button>
        </div>
      )}
    </>
  )
}
