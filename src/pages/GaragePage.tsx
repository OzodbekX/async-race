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
  const { data, isLoading, isError } = useGetCarsQuery({ page })
  const cars = data?.cars ?? []
  const total = data?.total ?? 0

  const { startCar, stopCar, startRace, resetAll, racing } = useRaceControls(cars)

  // If the last car on a page is removed, step back to the previous page.
  useEffect(() => {
    if (!isLoading && cars.length === 0 && page > 1) {
      dispatch(setGaragePage(page - 1))
    }
  }, [isLoading, cars.length, page, dispatch])

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
      {isLoading && <LoadingState message="Loading cars…" />}
      {!isLoading && !isError && cars.length === 0 && (
        <EmptyState icon="🚗" title="No cars in the garage" description="Create one above or generate a batch." />
      )}

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
