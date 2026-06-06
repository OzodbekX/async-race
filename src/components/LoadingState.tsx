interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="py-16 text-center text-faint">{message}</div>
  )
}
