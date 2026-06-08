import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { startEditing, stopEditing } from '../ui/uiSlice'
import { resetCar } from '../race/raceSlice'
import { useDeleteCarMutation, useDeleteWinnerMutation } from '../../api/racingApi'
import { btn } from '../../ui'
import type { Car } from '../../types'
import RemoveConfirm from './RemoveConfirm'
import CarTrack from './CarTrack'

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
  const race = useAppSelector((s) => s.race.cars[car.id] ?? { phase: 'idle', progress: 0 })
  const isMoving = race.phase === 'driving' || race.phase === 'broken'

  const removeCar = async () => {
    await deleteCar(car.id).unwrap()
    await deleteWinner(car.id).unwrap().catch(() => {})
    if (editingId === car.id) dispatch(stopEditing())
    dispatch(resetCar(car.id))
  }

  return (
    <div className="relative flex min-h-16 items-center gap-3 overflow-hidden rounded-lg border border-edge bg-panel py-2.5 px-2 transition-colors hover:border-elevated">
      <div className="flex shrink-0 flex-col items-center gap-1">
        <div className="flex flex-col gap-2">
          <button type="button" className={btn('ghost', true)} onClick={() => dispatch(startEditing({ id: car.id, name: car.name, color: car.color }))} disabled={raceBusy}>Select</button>
          <button type="button" className={btn('ghost', true)} onClick={() => setConfirming(true)} disabled={raceBusy}>Remove</button>
          <button type="button" className={btn(isMoving || race.phase === 'finished' ? 'ghost' : 'success', true)} onClick={() => isMoving || race.phase === 'finished' ? onStop(car.id) : onStart(car.id)} disabled={raceBusy} title={isMoving || race.phase === 'finished' ? 'Stop engine' : 'Start engine'}>
            {isMoving || race.phase === 'finished' ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
      {confirming
        ? <RemoveConfirm name={car.name} onCancel={() => setConfirming(false)} onConfirm={() => { setConfirming(false); removeCar() }} />
        : <CarTrack car={car} progressPercent={race.progress * 100} phase={race.phase} />
      }
      <div className="flex w-7 shrink-0 items-center justify-center text-xl opacity-50">🏁</div>
    </div>
  )
}
