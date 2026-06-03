import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setWinnersPage, setWinnersSort } from '../features/ui/uiSlice'
import { fetchCar, useGetWinnersQuery } from '../api/racingApi'
import Pagination from '../components/Pagination'
import CarIcon from '../components/CarIcon'
import { WINNERS_PAGE_LIMIT } from '../constants'
import type { WinnerWithCar, WinnersSortField } from '../types'

const SORTABLE: { field: WinnersSortField; label: string }[] = [
  { field: 'wins', label: 'Wins' },
  { field: 'time', label: 'Best time (s)' },
]

const thCls =
  'border-b border-edge bg-panel px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted select-none'
const tdCls = 'border-b border-edge px-4 py-3 text-left'

export default function WinnersPage() {
  const dispatch = useAppDispatch()
  const {
    winnersPage: page,
    winnersSort: sort,
    winnersOrder: order,
  } = useAppSelector((s) => s.ui)
  const { data, isLoading, isError } = useGetWinnersQuery({ page, sort, order })
  const total = data?.total ?? 0

  const [rows, setRows] = useState<WinnerWithCar[]>([])

  // Winners only carry id/wins/time; pull each car for its name and color.
  useEffect(() => {
    let cancelled = false
    const winners = data?.winners ?? []
    Promise.all(
      winners.map(async (w) => {
        try {
          const car = await fetchCar(w.id)
          return { ...w, name: car.name, color: car.color }
        } catch {
          return { ...w, name: `#${w.id}`, color: '#888888' }
        }
      }),
    ).then((enriched) => {
      if (!cancelled) setRows(enriched)
    })
    return () => {
      cancelled = true
    }
  }, [data])

  const sortIndicator = (field: WinnersSortField) => {
    if (sort !== field) return ''
    return order === 'ASC' ? ' ▲' : ' ▼'
  }

  return (
    <section>
      <h2 className="mb-5 flex items-center gap-2 text-2xl font-extrabold uppercase tracking-wide">
        Winners <span className="text-accent">({total})</span>
      </h2>

      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-faint">
          <span className="text-4xl opacity-40">🔌</span>
          <span className="text-base font-semibold">Cannot reach the race server</span>
          <span>
            Start the async-race-api on{' '}
            <code className="font-mono text-fg">http://127.0.0.1:3000</code>.
          </span>
        </div>
      )}
      {isLoading && <div className="py-16 text-center text-faint">Loading winners…</div>}
      {!isLoading && !isError && total === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-faint">
          <span className="text-4xl opacity-40">🏆</span>
          <span className="text-base font-semibold">No winners yet</span>
          <span>Win a race in the Garage to populate this table.</span>
        </div>
      )}

      {total > 0 && (
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
      )}

      <Pagination
        page={page}
        total={total}
        limit={WINNERS_PAGE_LIMIT}
        onChange={(p) => dispatch(setWinnersPage(p))}
      />
    </section>
  )
}
