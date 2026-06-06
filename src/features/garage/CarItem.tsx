import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { startEditing, stopEditing } from '../ui/uiSlice'
import { resetCar } from '../race/raceSlice'
import { useDeleteCarMutation, useDeleteWinnerMutation } from '../../api/racingApi'
import CarIcon from '../../components/CarIcon'
import { btn } from '../../ui'
import type { Car } from '../../types'

interface CarItemProps {
  car: Car
  raceBusy: boolean
  onStart: (id: number) => void
  onStop: (id: number) => void
}

export default function CarItem({ car, raceBusy, onStart, onStop }: CarItemProps) {
  const dispatch = useAppDispatch()
  const [deleteCar] = useDeleteCarMutation()
  const [deleteWinner] = useDeleteWinnerMutation()
  const [confirming, setConfirming] = useState(false)
  const editingId = useAppSelector((s) => s.ui.editForm.id)
  const race = useAppSelector(
    (s) => s.race.cars[car.id] ?? { phase: 'idle', progress: 0 },
  )

  const isMoving = race.phase === 'driving' || race.phase === 'broken'
  const pct = race.progress * 100

  const handleRemove = async () => {
    await deleteCar(car.id).unwrap()
    await deleteWinner(car.id).unwrap().catch(() => {})
    if (editingId === car.id) dispatch(stopEditing())
    dispatch(resetCar(car.id))
  }

  return (
    <div className="relative flex min-h-16 items-center gap-3 overflow-hidden rounded-lg border border-edge bg-panel py-2.5 px-2 transition-colors hover:border-elevated">
        <div className="flex shrink-0 flex-col items-center gap-1">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={btn('ghost', true)}
              onClick={() =>
                dispatch(startEditing({ id: car.id, name: car.name, color: car.color }))
              }
              disabled={raceBusy}
            >
              Select
            </button>
            <button
              type="button"
              className={btn('ghost', true)}
              onClick={() => setConfirming(true)}
              disabled={raceBusy}
            >
              Remove
            </button>
            <button
              type="button"
              className={btn(isMoving || race.phase === 'finished' ? 'ghost' : 'success', true)}
              onClick={() => (isMoving || race.phase === 'finished' ? onStop(car.id) : onStart(car.id))}
              disabled={raceBusy}
              title={isMoving || race.phase === 'finished' ? 'Stop engine' : 'Start engine'}
            >
              {isMoving || race.phase === 'finished' ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>

        {confirming ? (
          <div className="flex flex-1 items-center justify-center gap-4">
            <span className="text-sm text-muted">
              Remove <span className="font-semibold text-fg">"{car.name}"</span>?
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className={btn('ghost')}
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={btn('primary')}
                onClick={() => { setConfirming(false); handleRemove() }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="relative h-10 flex-1 overflow-hidden">
            <span className="absolute inset-0 flex items-center justify-center text-lg font-black uppercase tracking-widest text-muted/20 select-none">
              {car.name}
            </span>
            <div
              className="absolute top-1/2 h-8 w-16"
              style={{
                left: `${pct}%`,
                transform: `translate(-${pct}%, -50%)`,
                filter: race.phase === 'broken' ? 'grayscale(1) brightness(0.6)' : undefined,
              }}
            >
              <CarIcon color={car.color} size={32} />
            </div>
          </div>
        )}

        <div className="flex w-7 shrink-0 items-center justify-center text-xl opacity-50">
          🏁
        </div>
      </div>
  )
}
