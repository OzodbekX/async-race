import { CAR_BRANDS, CAR_MODELS, MAX_RGB_CHANNEL } from '../constants'

const pickRandom = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)]

export function randomCarName(): string {
  return `${pickRandom(CAR_BRANDS)} ${pickRandom(CAR_MODELS)}`
}

export function randomColor(): string {
  const channel = () =>
    Math.floor(Math.random() * MAX_RGB_CHANNEL)
      .toString(16)
      .padStart(2, '0')
  return `#${channel()}${channel()}${channel()}`
}
