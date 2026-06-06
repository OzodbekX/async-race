import { MAX_CAR_NAME_LENGTH } from '../constants'

export const isValidName = (name: string): boolean =>
  name.trim().length > 0 && name.trim().length <= MAX_CAR_NAME_LENGTH

export const isValidHex = (value: string): boolean =>
  /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
