import { CAR_BRANDS, CAR_MODELS } from '../constants'

const pick = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)]

export function randomCarName(): string {
  return `${pick(CAR_BRANDS)} ${pick(CAR_MODELS)}`
}

export function randomColor(): string {
  const channel = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
  return `#${channel()}${channel()}${channel()}`
}
