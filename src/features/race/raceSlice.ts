import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RaceCarState } from '../../types'
import { MS_PER_SECOND } from '../../constants'

interface RaceState {
  cars: Record<number, RaceCarState>
  /** True while a "Race all" run is in progress on the current page. */
  racing: boolean
  /** Id of the car that won the current race, or null. */
  winnerId: number | null
  /** Time (s) of the winning car, for the announcement banner. */
  winnerTime: number | null
}

const initialState: RaceState = {
  cars: {},
  racing: false,
  winnerId: null,
  winnerTime: null,
}

const initialCarState = (): RaceCarState => ({
  phase: 'idle',
  progress: 0,
  duration: 0,
  time: 0,
})

const ensureCarState = (state: RaceState, id: number): RaceCarState => {
  state.cars[id] ??= initialCarState()
  return state.cars[id]
}

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    // Engine returned velocity+distance: car is cleared to drive.
    engineStarted(state, action: PayloadAction<{ id: number; duration: number }>) {
      const car = ensureCarState(state, action.payload.id)
      car.duration = action.payload.duration
      car.phase = 'driving'
      car.time = 0
      // Keep existing progress so a resumed car continues where it froze.
    },
    // Advance a car's animation by `elapsedMs` of elapsed real time.
    advance(state, action: PayloadAction<{ id: number; elapsedMs: number }>) {
      const car = ensureCarState(state, action.payload.id)
      if (car.phase !== 'driving' || car.duration <= 0) return
      car.progress = Math.min(1, car.progress + action.payload.elapsedMs / car.duration)
      if (car.progress >= 1) {
        car.phase = 'finished'
        car.time = car.duration / MS_PER_SECOND
      }
    },
    // Engine 500'd: stop the car where it is.
    engineBroke(state, action: PayloadAction<number>) {
      const car = ensureCarState(state, action.payload)
      car.phase = 'broken'
    },
    // Stop a single car and return it to the start line.
    resetCar(state, action: PayloadAction<number>) {
      state.cars[action.payload] = initialCarState()
    },
    setRacing(state, action: PayloadAction<boolean>) {
      state.racing = action.payload
    },
    setWinner(state, action: PayloadAction<{ id: number; time: number }>) {
      if (state.winnerId !== null) return
      state.winnerId = action.payload.id
      state.winnerTime = action.payload.time
    },
    clearWinner(state) {
      state.winnerId = null
      state.winnerTime = null
    },
    // Reset every car to the start line (Reset button / full teardown).
    resetRace() {
      return initialState
    },
  },
})

export const {
  engineStarted,
  advance,
  engineBroke,
  resetCar,
  setRacing,
  setWinner,
  clearWinner,
  resetRace,
} = raceSlice.actions

export default raceSlice.reducer
