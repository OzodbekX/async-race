import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  Car,
  EngineResponse,
  EngineStatus,
  SortOrder,
  Winner,
  WinnersSortField,
} from '../types'
import { API_BASE_URL, GARAGE_PAGE_LIMIT, WINNERS_PAGE_LIMIT } from '../constants'

interface PaginatedCars {
  cars: Car[]
  total: number
}

interface PaginatedWinners {
  winners: Winner[]
  total: number
}

export const racingApi = createApi({
  reducerPath: 'racingApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Car', 'Winner'],
  endpoints: (build) => ({
    getCars: build.query<PaginatedCars, { page: number }>({
      query: ({ page }) => `/garage?_page=${page}&_limit=${GARAGE_PAGE_LIMIT}`,
      transformResponse: (cars: Car[], meta) => ({
        cars,
        total: Number(meta?.response?.headers.get('X-Total-Count') ?? cars.length),
      }),
      providesTags: ['Car'],
    }),

    createCar: build.mutation<Car, Pick<Car, 'name' | 'color'>>({
      query: (body) => ({ url: '/garage', method: 'POST', body }),
      invalidatesTags: ['Car'],
    }),

    updateCar: build.mutation<Car, Car>({
      query: ({ id, ...body }) => ({ url: `/garage/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Car'],
    }),

    deleteCar: build.mutation<void, number>({
      query: (id) => ({ url: `/garage/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Car', 'Winner'],
    }),

    getWinners: build.query<
      PaginatedWinners,
      { page: number; sort: WinnersSortField; order: SortOrder }
    >({
      query: ({ page, sort, order }) =>
        `/winners?_page=${page}&_limit=${WINNERS_PAGE_LIMIT}&_sort=${sort}&_order=${order}`,
      transformResponse: (winners: Winner[], meta) => ({
        winners,
        total: Number(meta?.response?.headers.get('X-Total-Count') ?? winners.length),
      }),
      providesTags: ['Winner'],
    }),

    getWinner: build.query<Winner, number>({
      query: (id) => `/winners/${id}`,
    }),

    createWinner: build.mutation<Winner, Winner>({
      query: (body) => ({ url: '/winners', method: 'POST', body }),
      invalidatesTags: ['Winner'],
    }),

    updateWinner: build.mutation<Winner, Winner>({
      query: ({ id, ...body }) => ({
        url: `/winners/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Winner'],
    }),

    deleteWinner: build.mutation<void, number>({
      query: (id) => ({ url: `/winners/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Winner'],
    }),

    // Engine control. `started`/`stopped` return velocity+distance; `drive`
    // returns 200 on success or 500 when the engine breaks mid-race.
    toggleEngine: build.mutation<
      EngineResponse,
      { id: number; status: Extract<EngineStatus, 'started' | 'stopped'> }
    >({
      query: ({ id, status }) => ({
        url: `/engine?id=${id}&status=${status}`,
        method: 'PATCH',
      }),
    }),

    drive: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/engine?id=${id}&status=drive`, method: 'PATCH' }),
    }),
  }),
})

/** Fetch a single car by id (used to enrich winners with name/color). */
export async function fetchCar(id: number): Promise<Car> {
  const res = await fetch(`${API_BASE_URL}/garage/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch car ${id}`)
  return res.json() as Promise<Car>
}

export const {
  useGetCarsQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
  useGetWinnersQuery,
  useCreateWinnerMutation,
  useUpdateWinnerMutation,
  useDeleteWinnerMutation,
  useToggleEngineMutation,
  useDriveMutation,
} = racingApi
