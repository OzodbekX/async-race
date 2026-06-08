import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setGaragePage } from '../features/ui/uiSlice'
import { useGetCarsQuery } from '../api/racingApi'
import { useRaceControls } from '../features/race/useRaceControls'
import { GARAGE_PAGE_LIMIT } from '../constants'

export function useGaragePage() {
  const dispatch = useAppDispatch()
  const page = useAppSelector((s) => s.ui.garagePage)
  const { data, currentData, isFetching, isError } = useGetCarsQuery({ page })
  const cars = currentData?.cars ?? []
  const total = data?.total ?? 0
  const isPageLoading = isFetching && currentData === undefined
  const raceControls = useRaceControls(cars)

  useEffect(() => {
    if (isFetching) return
    const lastPage = Math.max(1, Math.ceil(total / GARAGE_PAGE_LIMIT))
    if (page > lastPage) dispatch(setGaragePage(lastPage))
  }, [isFetching, total, page, dispatch])

  return { page, cars, total, isPageLoading, isError, dispatch, ...raceControls }
}
