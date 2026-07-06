import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Bell } from 'lucide-react'

/*
 * Mobile/tablet-only app-style top bar (CLAUDE.md UI rules 2 & 5):
 * page title + back + search & notifications, native-app pattern.
 */
export default function MobileTopBar({ title, back = false, backTo, actions }) {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-edge bg-surface px-3 md:hidden">
      {back && (
        <button
          type="button"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink"
        >
          <ArrowLeft className="h-5.5 w-5.5" />
        </button>
      )}
      <h1 className="min-w-0 flex-1 truncate text-lg font-bold text-ink">{title}</h1>
      {actions}
      <button
        type="button"
        aria-label="Search"
        onClick={() => navigate('/search')}
        className="flex h-11 w-11 items-center justify-center rounded-full text-subtle"
      >
        <Search className="h-5.5 w-5.5" />
      </button>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => navigate('/notifications')}
        className="flex h-11 w-11 items-center justify-center rounded-full text-subtle"
      >
        <Bell className="h-5.5 w-5.5" />
      </button>
    </div>
  )
}
