import { centeredViewCls } from '../ui'

interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <div className={centeredViewCls}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge border-t-accent" />
      <span>{message}</span>
    </div>
  )
}
