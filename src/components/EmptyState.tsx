interface EmptyStateProps {
  icon: string
  title: string
  description: string
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-faint">
      <span className="text-4xl opacity-40">{icon}</span>
      <span className="text-base font-semibold">{title}</span>
      <span>{description}</span>
    </div>
  )
}
