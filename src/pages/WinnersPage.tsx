import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setWinnersPage } from '../features/ui/uiSlice'
import { useGetWinnersQuery } from '../api/racingApi'
import Pagination from '../components/Pagination'
import ServerError from '../components/ServerError'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import { WINNERS_PAGE_LIMIT } from '../constants'
import WinnersTable from '../features/winners/WinnersTable'
import { useWinnersRows } from '../features/winners/useWinnersRows'

export default function WinnersPage() {
  const dispatch = useAppDispatch()
  const { winnersPage: page, winnersSort: sort, winnersOrder: order } = useAppSelector((s) => s.ui)
  const { data, currentData, isFetching, isError } = useGetWinnersQuery({ page, sort, order })
  const total = data?.total ?? 0
  const isPageLoading = isFetching && currentData === undefined
  const rows = useWinnersRows(currentData)

  return (
    <section>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(rgba(15,15,19,0.82), rgba(15,15,19,0.82)), url('/winners.webp')" }}
      />
      <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold uppercase tracking-wide">
        Winners <span className="text-accent">({total})</span>
      </h2>

      {isError && <ServerError />}
      {isPageLoading && <LoadingState message="Loading winners…" />}
      {!isPageLoading && !isError && total === 0 && (
        <EmptyState icon="🏆" title="No winners yet" description="Win a race in the Garage to populate this table." />
      )}

      {!isPageLoading && total > 0 && <WinnersTable rows={rows} page={page} />}

      <Pagination
        page={page}
        total={total}
        limit={WINNERS_PAGE_LIMIT}
        onChange={(p) => dispatch(setWinnersPage(p))}
      />
    </section>
  )
}
