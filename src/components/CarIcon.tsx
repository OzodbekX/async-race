interface CarIconProps {
  color: string
  size?: number
}

/** Simple side-view car silhouette, tinted with the car's color. */
export default function CarIcon({ color, size = 40 }: CarIconProps) {
  return (
    <svg
      width={size * 2}
      height={size}
      viewBox="0 0 100 50"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 38 Q5 30 14 29 L26 20 Q30 16 38 16 L62 16 Q70 16 76 22 L88 28 Q95 29 95 38 L95 41 Q95 43 92 43 L8 43 Q5 43 5 41 Z"
        fill={color}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="1.5"
      />
      <path d="M34 18 L58 18 L66 27 L34 27 Z" fill="rgba(255,255,255,0.35)" />
      <circle cx="28" cy="43" r="7" fill="#1a1a1a" />
      <circle cx="28" cy="43" r="3" fill="#888" />
      <circle cx="72" cy="43" r="7" fill="#1a1a1a" />
      <circle cx="72" cy="43" r="3" fill="#888" />
    </svg>
  )
}
