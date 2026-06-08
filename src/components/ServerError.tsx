import { centeredViewCls } from '../ui'

export default function ServerError() {
  return (
    <div className={centeredViewCls}>
      <span className="text-4xl opacity-40">🔌</span>
      <span className="text-base font-semibold">Cannot reach the race server</span>
      <span>
        Start the async-race-api on{' '}
        <code className="font-mono text-fg">http://127.0.0.1:3000</code> and refresh.
      </span>
    </div>
  )
}
