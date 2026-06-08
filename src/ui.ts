/** Tiny class-name helpers so repeated Tailwind variants stay DRY. */

export const cx = (...classes: (string | false | null | undefined)[]): string =>
  classes.filter(Boolean).join(' ')

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost'

// Indicator color only — all other button styles live in index.css `button {}`.
const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: '[--btn-indicator:#22c55e]', // green  — create / race
  secondary: '[--btn-indicator:#f59e0b]', // amber  — reset / update
  success: '[--btn-indicator:#4ade80]', // lime   — engine start
  ghost: '[--btn-indicator:#ef4444]', // red    — stop / cancel / remove
}

export const btn = (variant: ButtonVariant, icon = false): string =>
  cx(BUTTON_VARIANTS[variant], icon ? 'w-11 h-11 !p-0 !text-[0.5rem]' : '')

export const inputCls =
  'bg-elevated text-fg border border-edge rounded-full px-4 py-2 text-sm outline-none ' +
  'transition-colors placeholder:text-faint disabled:opacity-40 ' +
  'focus:border-accent focus:ring-2 focus:ring-accent/20'

export const colorInputCls =
  'h-9 w-12 shrink-0 cursor-pointer rounded-full border border-edge bg-elevated p-0.5 disabled:opacity-40'
