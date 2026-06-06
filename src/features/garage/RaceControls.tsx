import { useState } from 'react'
import { useCreateCarMutation } from '../../api/racingApi'
import { RANDOM_CARS_PER_CLICK } from '../../constants'
import { randomCarName, randomColor } from '../../utils/random'
import { btn } from '../../ui'
import WinnerAnnouncement from './WinnerAnnouncement'
import type { Car } from '../../types'

interface RaceControlsProps {
  cars: Car[]
  racing: boolean
  onRace: () => void
  onReset: () => void
}

export default function RaceControls({ cars, racing, onRace, onReset }: RaceControlsProps) {
  const [createCar] = useCreateCarMutation()
  const [generating, setGenerating] = useState(false)

  const generate = async () => {
    setGenerating(true)
    try {
      await Promise.allSettled(
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

      <WinnerAnnouncement cars={cars} />
    </>
  )
}
