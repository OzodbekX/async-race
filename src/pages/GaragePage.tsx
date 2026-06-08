import { setGaragePage } from '../features/ui/uiSlice'
import CarForms from '../features/garage/CarForms'
import RaceControls from '../features/garage/RaceControls'
import CarItem from '../features/garage/CarItem'
import Pagination from '../components/Pagination'
import ServerError from '../components/ServerError'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import { GARAGE_PAGE_LIMIT } from '../constants'
import { pageBgStyle } from '../ui'
import { useGaragePage } from './useGaragePage'

export default function GaragePage() {
  const { page, cars, total, isPageLoading, isError, racing, startCar, stopCar, startRace, resetAll, dispatch } = useGaragePage()
  const pagination = <Pagination page={page} total={total} limit={GARAGE_PAGE_LIMIT} onChange={(p) => dispatch(setGaragePage(p))} disabled={racing} />

  return (
    <section>
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={pageBgStyle('/garage.webp')} />
      <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold uppercase tracking-wide">
        Garage <span className="text-accent">({total})</span>
      </h2>
      <div className="mb-3 flex flex-wrap items-center gap-1">
        <CarForms disabled={racing} />
        <RaceControls cars={cars} racing={racing} onRace={startRace} onReset={resetAll} />
        <div className="ml-auto hidden shrink-0 min-[1000px]:block">{pagination}</div>
      </div>
      {isError && <ServerError />}
      {isPageLoading && <LoadingState message="Loading cars…" />}
      {!isPageLoading && !isError && cars.length === 0 && (
        <EmptyState icon="🚗" title="No cars in the garage" description="Create one above or generate a batch." />
      )}
      {!isPageLoading && (
        <div className="flex flex-col gap-2">
          {cars.map((car) => <CarItem key={car.id} car={car} raceBusy={racing} onStart={startCar} onStop={stopCar} />)}
        </div>
      )}
      <div className="mt-3 min-[1000px]:hidden">{pagination}</div>
    </section>
  )
}
