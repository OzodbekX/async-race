import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearWinner, setRacing } from '../race/raceSlice'
import { btn } from '../../ui'
import type { Car } from '../../types'

interface WinnerAnnouncementProps {
  cars: Car[]
}

export default function WinnerAnnouncement({ cars }: WinnerAnnouncementProps) {
  const dispatch = useAppDispatch()
  const winnerId = useAppSelector((s) => s.race.winnerId)
  const winnerTime = useAppSelector((s) => s.race.winnerTime)

  const winnerName = cars.find((c) => c.id === winnerId)?.name

  if (winnerId === null || !winnerName) return null

  return (
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
  )
}
