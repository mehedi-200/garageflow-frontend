import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Car, Wrench, Menu } from 'lucide-react'
import cn from '../../utils/cn'
import useAuth from '../../hooks/useAuth'

const ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true, permission: null },
  { to: '/customers', label: 'Customers', icon: Users, permission: 'customers' },
  { to: '/vehicles', label: 'Vehicles', icon: Car, permission: 'vehicles' },
  { to: '/jobs', label: 'Jobs', icon: Wrench, permission: 'service_jobs' },
  { to: '/more', label: 'More', icon: Menu, permission: null },
]

/* Mobile/tablet-only native-app bottom navigation (CLAUDE.md UI rule 2). */
export default function BottomNav() {
  const { can } = useAuth()
  const items = ITEMS.filter((item) => !item.permission || can(item.permission))

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-edge bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
              isActive ? 'text-accent' : 'text-subtle'
            )
          }
        >
          <Icon className="h-5.5 w-5.5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
