import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  FileText,
  UsersRound,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import cn from '../../utils/cn'
import useAuth from '../../hooks/useAuth'

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/vehicles', label: 'Vehicles', icon: Car },
  { to: '/jobs', label: 'Service Jobs', icon: Wrench },
  { to: '/invoices', label: 'Invoices', icon: FileText },
]

const ADMIN_ITEMS = [{ to: '/mechanics', label: 'Mechanics', icon: UsersRound }]

/* Desktop-only thin collapsible sidebar (CLAUDE.md UI rule 3). */
export default function Sidebar({ collapsed, onToggle }) {
  const { isAdmin } = useAuth()
  const items = isAdmin ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r border-edge bg-surface transition-all md:flex',
        collapsed ? 'w-16' : 'w-52'
      )}
    >
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-subtle hover:bg-elevated hover:text-ink'
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="m-2 flex items-center justify-center gap-2 rounded-xl p-2.5 text-subtle transition-colors hover:bg-elevated hover:text-ink"
      >
        {collapsed ? (
          <PanelLeftOpen className="h-5 w-5" />
        ) : (
          <>
            <PanelLeftClose className="h-5 w-5" />
            <span className="text-sm">Collapse</span>
          </>
        )}
      </button>
    </aside>
  )
}
