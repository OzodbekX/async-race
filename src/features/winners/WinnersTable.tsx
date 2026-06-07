import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setWinnersSort } from '../ui/uiSlice'
import CarIcon from '../../components/CarIcon'
import { WINNERS_PAGE_LIMIT } from '../../constants'
import type { WinnerWithCar, WinnersSortField } from '../../types'

const SORTABLE: { field: WinnersSortField; label: string }[] = [
  { field: 'wins', label: 'Wins' },
  { field: 'time', label: 'Best time (s)' },
]

const thCls =
  'border-b border-edge bg-panel px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted select-none'
const tdCls = 'border-b border-edge px-4 py-3 text-left'

interface WinnersTableProps {
  rows: WinnerWithCar[]
  page: number
}

export default function WinnersTable({ rows, page }: WinnersTableProps) {
  const dispatch = useAppDispatch()
  const sort = useAppSelector((s) => s.ui.winnersSort)
  const order = useAppSelector((s) => s.ui.winnersOrder)

  const sortIndicator = (field: WinnersSortField) => {
    if (sort !== field) return ''
    return order === 'ASC' ? ' ▲' : ' ▼'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className={thCls}>№</th>
            <th className={thCls}>Car</th>
            <th className={thCls}>Name</th>
            {SORTABLE.map(({ field, label }) => (
              <th
                key={field}
                className={`${thCls} cursor-pointer hover:text-fg`}
                onClick={() => dispatch(setWinnersSort(field))}
              >
                {label}
                {sortIndicator(field)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} className="transition-colors hover:bg-panel">
              <td className={`${tdCls} tabular-nums text-faint`}>
                {(page - 1) * WINNERS_PAGE_LIMIT + i + 1}
              </td>
              <td className={tdCls}>
                <CarIcon color={row.color} size={24} />
              </td>
              <td className={tdCls}>{row.name}</td>
              <td className={tdCls}>{row.wins}</td>
              <td className={tdCls}>{row.time.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
