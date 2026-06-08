import CarIcon from '../../components/CarIcon'
import type { Car, CarPhase } from '../../types'

interface CarTrackProps {
  car: Car
  progressPercent: number
  phase: CarPhase
}

export default function CarTrack({ car, progressPercent, phase }: CarTrackProps) {
  return (
    <div className="relative h-10 flex-1 overflow-hidden">
      <span className="absolute inset-0 flex items-center justify-center text-lg font-black uppercase tracking-widest text-muted/20 select-none">
        {car.name}
      </span>
      <div
        className="absolute top-1/2 h-8 w-16"
        style={{
          left: `${progressPercent}%`,
          transform: `translate(-${progressPercent}%, -50%)`,
          filter: phase === 'broken' ? 'grayscale(1) brightness(0.6)' : undefined,
        }}
      >
        <CarIcon color={car.color} size={32} />
      </div>
    </div>
  )
}
