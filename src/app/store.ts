import { configureStore } from '@reduxjs/toolkit'
import { racingApi } from '../api/racingApi'
import uiReducer from '../features/ui/uiSlice'
import raceReducer from '../features/race/raceSlice'

export const store = configureStore({
  reducer: {
    [racingApi.reducerPath]: racingApi.reducer,
    ui: uiReducer,
    race: raceReducer,
  },
  middleware: (getDefault) => getDefault().concat(racingApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
