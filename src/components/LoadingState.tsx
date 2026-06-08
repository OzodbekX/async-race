interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-faint">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge border-t-accent" />
      <span>{message}</span>
    </div>
  )
}
