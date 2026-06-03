/** Tiny class-name helpers so repeated Tailwind variants stay DRY. */

export const cx = (...classes: (string | false | null | undefined)[]): string =>
  classes.filter(Boolean).join(' ')

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost'

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-1 rounded font-semibold whitespace-nowrap ' +
  'cursor-pointer select-none transition-colors active:scale-[0.97] ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:not-disabled:bg-accent-hover',
  secondary: 'bg-elevated text-fg border border-edge hover:not-disabled:bg-disabled',
  success: 'bg-success text-ink hover:not-disabled:brightness-110',
  ghost:
    'bg-transparent text-muted border border-edge hover:not-disabled:bg-elevated hover:not-disabled:text-fg',
}

export const btn = (variant: ButtonVariant, icon = false): string =>
  cx(
    BUTTON_BASE,
    BUTTON_VARIANTS[variant],
    icon ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm',
  )

export const inputCls =
  'bg-elevated text-fg border border-edge rounded px-3 py-2 text-sm outline-none ' +
  'transition-colors placeholder:text-faint disabled:opacity-40 ' +
  'focus:border-accent focus:ring-2 focus:ring-accent/20'

export const colorInputCls =
  'h-9 w-12 shrink-0 cursor-pointer rounded border border-edge bg-elevated p-0.5 disabled:opacity-40'
