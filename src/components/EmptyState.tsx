import { centeredViewCls } from '../ui'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className={centeredViewCls}>
      <span className="text-4xl opacity-40">{icon}</span>
      <span className="text-base font-semibold">{title}</span>
      <span>{description}</span>
    </div>
  )
}
