import { btn } from '../ui'

interface PaginationProps {
  page: number
  total: number
  limit: number
  onChange: (page: number) => void
  /** Locks navigation (e.g. while a race is running). */
  disabled?: boolean
}

export default function Pagination({
  page,
  total,
  limit,
  onChange,
  disabled = false,
}: PaginationProps) {
  const lastPage = Math.max(1, Math.ceil(total / limit))
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      <button
        type="button"
        className={btn('secondary')}
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        ← Prev
      </button>
      <span className="mx-2 text-sm text-muted">
        Page {page} / {lastPage}
      </span>
      <button
        type="button"
        className={btn('secondary')}
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= lastPage}
      >
        Next →
      </button>
    </div>
  )
}
