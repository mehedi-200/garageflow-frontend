import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Car, Wrench, Menu } from 'lucide-react'
import cn from '../../utils/cn'

const ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/vehicles', label: 'Vehicles', icon: Car },
  { to: '/jobs', label: 'Jobs', icon: Wrench },
  { to: '/more', label: 'More', icon: Menu },
]

/* Mobile/tablet-only native-app bottom navigation (CLAUDE.md UI rule 2). */
export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-edge bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
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
