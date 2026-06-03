import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setGaragePage } from '../features/ui/uiSlice'
import { useGetCarsQuery } from '../api/racingApi'
import { useRaceControls } from '../features/race/useRaceControls'
import CarForms from '../features/garage/CarForms'
import RaceControls from '../features/garage/RaceControls'
import CarItem from '../features/garage/CarItem'
import Pagination from '../components/Pagination'
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
      <h2 className="mb-5 flex items-center gap-2 text-2xl font-extrabold uppercase tracking-wide">
        Garage <span className="text-accent">({total})</span>
      </h2>

      <CarForms disabled={racing} />
      <RaceControls cars={cars} racing={racing} onRace={startRace} onReset={resetAll} />

      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-faint">
          <span className="text-4xl opacity-40">🔌</span>
          <span className="text-base font-semibold">Cannot reach the race server</span>
          <span>
            Start the async-race-api on{' '}
            <code className="font-mono text-fg">http://127.0.0.1:3000</code> and refresh.
          </span>
        </div>
      )}
      {isLoading && <div className="py-16 text-center text-faint">Loading cars…</div>}
      {!isLoading && !isError && cars.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-faint">
          <span className="text-4xl opacity-40">🚗</span>
          <span className="text-base font-semibold">No cars in the garage</span>
          <span>Create one above or generate a batch.</span>
        </div>
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

      <Pagination
        page={page}
        total={total}
        limit={GARAGE_PAGE_LIMIT}
        onChange={(p) => dispatch(setGaragePage(p))}
        disabled={racing}
      />
    </section>
  )
}
