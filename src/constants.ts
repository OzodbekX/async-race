export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export const GARAGE_PAGE_LIMIT = 7
export const WINNERS_PAGE_LIMIT = 10

export const MAX_CAR_NAME_LENGTH = 30
export const RANDOM_CARS_PER_CLICK = 100

export const DEFAULT_CAR_COLOR = '#3b82f6'

/** Two-part name pools used for random car generation. */
export const CAR_BRANDS = [
  'Tesla',
  'Ford',
  'BMW',
  'Audi',
  'Toyota',
  'Mercedes',
  'Porsche',
  'Nissan',
  'Honda',
  'Chevrolet',
] as const

export const CAR_MODELS = [
  'Model S',
  'Mustang',
  'X5',
  'A4',
  'Corolla',
  'C-Class',
  '911',
  'GT-R',
  'Civic',
  'Camaro',
] as const
