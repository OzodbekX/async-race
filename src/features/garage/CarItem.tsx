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
  const editingId = useAppSelector((s) => s.ui.editForm.id)
  const race = useAppSelector(
    (s) => s.race.cars[car.id] ?? { phase: 'idle', progress: 0 },
  )

  const isMoving = race.phase === 'driving' || race.phase === 'broken'
  const atStart = race.phase === 'idle' || race.progress === 0
  const pct = race.progress * 100

  // Deleting a car also removes it from the winners table (no 404 if it never
  // won) and clears any leftover edit/race state pointing at it.
  const handleRemove = async () => {
    await deleteCar(car.id).unwrap()
    await deleteWinner(car.id)
      .unwrap()
      .catch(() => {})
    if (editingId === car.id) dispatch(stopEditing())
    dispatch(resetCar(car.id))
  }

  return (
    <div className="relative flex min-h-16 items-center gap-3 overflow-hidden rounded-lg border border-edge bg-panel px-3.5 py-2.5 transition-colors hover:border-elevated">
      <div className="flex shrink-0 flex-col gap-1">
        <span className="w-[90px] truncate text-center text-xs text-muted">{car.name}</span>
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
          onClick={handleRemove}
          disabled={raceBusy}
        >
          Remove
        </button>
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        <button
          type="button"
          className={btn('success', true)}
          onClick={() => onStart(car.id)}
          disabled={isMoving || race.phase === 'finished'}
          title="Start engine"
        >
          A
        </button>
        <button
          type="button"
          className={btn('secondary', true)}
          onClick={() => onStop(car.id)}
          disabled={atStart}
          title="Stop engine — return to start"
        >
          B
        </button>
      </div>

      <div className="relative h-10 flex-1 overflow-hidden">
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

      <div className="flex w-7 shrink-0 items-center justify-center text-xl opacity-50">
        🏁
      </div>
    </div>
  )
}
