export interface Car {
  id: number
  name: string
  color: string
}

export interface Winner {
  id: number
  wins: number
  time: number
}

/** A winner row joined with its car data, as shown in the Winners table. */
export interface WinnerWithCar extends Winner {
  name: string
  color: string
}

export type EngineStatus = 'started' | 'stopped' | 'drive'

export interface EngineResponse {
  velocity: number
  distance: number
}

export type WinnersSortField = 'id' | 'wins' | 'time'
export type SortOrder = 'ASC' | 'DESC'

/**
 * Per-car race state. Kept in Redux so an in-progress race survives navigation
 * (freeze & resume): the animation loop advances `progress` only while the
 * Garage view is mounted, so leaving the view freezes cars in place and
 * returning resumes them from the stored progress.
 */
export type CarPhase = 'idle' | 'driving' | 'finished' | 'broken'

export interface RaceCarState {
  phase: CarPhase
  /** Animation progress along the track, 0..1. */
  progress: number
  /** Engine duration in ms (distance / velocity). 0 until the engine starts. */
  duration: number
  /** Finish time in seconds, set when the car reaches the end. */
  time: number
}
