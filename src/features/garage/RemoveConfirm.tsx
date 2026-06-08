import { btn } from '../../ui'

interface RemoveConfirmProps {
  name: string
  onCancel: () => void
  onConfirm: () => void
}

export default function RemoveConfirm({ name, onCancel, onConfirm }: RemoveConfirmProps) {
  return (
    <div className="flex flex-1 items-center justify-center gap-4">
      <span className="text-sm text-muted">
        Remove <span className="font-semibold text-fg">&quot;{name}&quot;</span>?
      </span>
      <div className="flex gap-2">
        <button type="button" className={btn('ghost')} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={btn('primary')} onClick={onConfirm}>
          Remove
        </button>
      </div>
    </div>
  )
}
