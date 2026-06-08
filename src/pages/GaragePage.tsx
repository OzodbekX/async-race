import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setGaragePage } from '../features/ui/uiSlice'
import { useGetCarsQuery } from '../api/racingApi'
import { useRaceControls } from '../features/race/useRaceControls'
import CarForms from '../features/garage/CarForms'
import RaceControls from '../features/garage/RaceControls'
import CarItem from '../features/garage/CarItem'
import Pagination from '../components/Pagination'
import ServerError from '../components/ServerError'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import { GARAGE_PAGE_LIMIT } from '../constants'

export default function GaragePage() {
  const dispatch = useAppDispatch()
  const page = useAppSelector((s) => s.ui.garagePage)
  const { data, currentData, isFetching, isError } = useGetCarsQuery({ page })
  // `currentData` is the result for the page being viewed; it's undefined while
  // a new page is loading but stays populated during post-mutation refetches.
  const cars = currentData?.cars ?? []
  const total = data?.total ?? 0
  const isPageLoading = isFetching && currentData === undefined

  const { startCar, stopCar, startRace, resetAll, racing } = useRaceControls(cars)

  // If the current page no longer exists (e.g. the last car on it was removed),
  // jump to the last page that still has cars. Guard on `isFetching` so we don't
  // act on the empty `[]` shown while the next page's request is in flight —
  // otherwise the page would cascade down to 1.
  useEffect(() => {
    if (isFetching) return
    const lastPage = Math.max(1, Math.ceil(total / GARAGE_PAGE_LIMIT))
    if (page > lastPage) dispatch(setGaragePage(lastPage))
  }, [isFetching, total, page, dispatch])

  return (
    <section>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(rgba(15,15,19,0.82), rgba(15,15,19,0.82)), url('/garage.webp')" }}
      />
      <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold uppercase tracking-wide">
        Garage <span className="text-accent">({total})</span>
      </h2>

      <div className="mb-3 flex flex-wrap items-center gap-1">
        <CarForms disabled={racing} />
        <RaceControls cars={cars} racing={racing} onRace={startRace} onReset={resetAll} />
        <div className="ml-auto hidden shrink-0 min-[1000px]:block">
          <Pagination
            page={page}
            total={total}
            limit={GARAGE_PAGE_LIMIT}
            onChange={(p) => dispatch(setGaragePage(p))}
            disabled={racing}
          />
        </div>
      </div>

      {isError && <ServerError />}
      {isPageLoading && <LoadingState message="Loading cars…" />}
      {!isPageLoading && !isError && cars.length === 0 && (
        <EmptyState icon="🚗" title="No cars in the garage" description="Create one above or generate a batch." />
      )}

      {!isPageLoading && (
        <div className="flex flex-col gap-2">
          {cars.map((car) => (
            <CarItem
              key={car.id}
              car={car}
              raceBusy={racing}
              onStart={startCar}
              onStop={stopCar}
            />
          ))}
        </div>
      )}

      <div className="mt-3 min-[1000px]:hidden">
        <Pagination
          page={page}
          total={total}
          limit={GARAGE_PAGE_LIMIT}
          onChange={(p) => dispatch(setGaragePage(p))}
          disabled={racing}
        />
      </div>
    </section>
  )
}
