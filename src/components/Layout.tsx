import { NavLink, Outlet } from 'react-router-dom'
import { cx } from '../ui'

const linkCls = ({ isActive }: { isActive: boolean }) =>
  cx(
    'rounded px-3 py-1.5 text-sm font-semibold transition-colors',
    isActive ? 'bg-elevated text-accent' : 'text-muted hover:bg-elevated hover:text-fg',
  )

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="sticky top-0 z-50 flex h-10 items-center gap-3 border-b border-edge bg-panel px-4 shadow-md">
        <span className="mr-auto text-lg font-extrabold uppercase tracking-wider text-accent">
          🏁 Async Race
        </span>
        <NavLink to="/garage" className={linkCls}>
          Garage
        </NavLink>
        <NavLink to="/winners" className={linkCls}>
          Winners
        </NavLink>
      </nav>
      <main className="mx-auto w-full max-w-[1200px] flex-1 p-3">
        <Outlet />
      </main>
    </div>
  )
}
