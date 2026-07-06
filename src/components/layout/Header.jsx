import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Menu, Search, Bell, User, LogOut, Palette, Check, Wrench } from 'lucide-react'
import useTheme from '../../hooks/useTheme'
import useAuth from '../../hooks/useAuth'
import useDebounce from '../../hooks/useDebounce'
import cn from '../../utils/cn'
import SearchResults from '../search/SearchResults'
import NotificationPanel from '../notifications/NotificationPanel'
import notificationService from '../../services/notificationService'

function useClickOutside(close) {
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) close()
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [close])

  return ref
}

/*
 * Desktop-only thin header (CLAUDE.md UI rules 3 & 5):
 * brand + sidebar hamburger · master search · notifications · profile.
 */
export default function Header({ onToggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [term, setTerm] = useState('')
  const q = useDebounce(term)
  const { theme, setTheme, themes } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const menuRef = useClickOutside(() => setMenuOpen(false))
  const searchRef = useClickOutside(() => setSearchOpen(false))
  const bellRef = useClickOutside(() => setBellOpen(false))

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: notificationService.unreadCount,
    refetchInterval: 30000,
  })
  const unread = unreadData?.data?.count ?? 0

  return (
    <header className="hidden h-14 shrink-0 items-center gap-4 border-b border-edge bg-surface px-4 md:flex">
      <div className="flex items-center gap-2 pr-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-on-accent">
          <Wrench className="h-4.5 w-4.5" />
        </span>
        <span className="text-base font-bold text-ink">GarageFlow</span>
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="ml-1 rounded-lg p-2 text-subtle transition-colors hover:bg-elevated hover:text-ink"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Master search with grouped results dropdown */}
      <div className="relative mx-auto w-full max-w-md" ref={searchRef}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          value={term}
          placeholder="Search customers, vehicles, jobs…"
          onChange={(e) => {
            setTerm(e.target.value)
            setSearchOpen(true)
          }}
          onFocus={() => term && setSearchOpen(true)}
          className="w-full rounded-xl border border-edge bg-canvas py-2 pl-9 pr-3 text-sm text-ink placeholder:text-subtle outline-none transition-colors focus:border-accent"
        />
        {searchOpen && term && (
          <div className="absolute inset-x-0 top-11 z-40 overflow-hidden rounded-2xl border border-edge bg-surface shadow-xl">
            <SearchResults
              q={q}
              onNavigate={() => {
                setSearchOpen(false)
                setTerm('')
              }}
            />
          </div>
        )}
      </div>

      {/* Notifications bell + panel */}
      <div className="relative" ref={bellRef}>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setBellOpen((o) => !o)}
          className="relative rounded-full p-2 text-subtle transition-colors hover:bg-elevated hover:text-ink"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-on-accent">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
        {bellOpen && (
          <div className="absolute right-0 top-11 z-40 w-96 overflow-hidden rounded-2xl border border-edge bg-surface shadow-xl">
            <NotificationPanel onNavigate={() => setBellOpen(false)} />
          </div>
        )}
      </div>

      {/* Profile menu with theme switcher */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Profile menu"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-elevated text-ink transition-colors hover:bg-accent hover:text-on-accent"
        >
          <User className="h-5 w-5" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 z-40 w-56 rounded-2xl border border-edge bg-surface p-2 shadow-xl">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                navigate('/profile')
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-elevated"
            >
              <User className="h-4 w-4 text-subtle" /> Profile
            </button>

            <div className="my-1 border-t border-edge" />
            <p className="flex items-center gap-2 px-3 pb-1 pt-2 text-xs font-semibold text-subtle">
              <Palette className="h-3.5 w-3.5" /> THEME
            </p>
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-elevated',
                  theme === t.id ? 'text-accent' : 'text-ink'
                )}
              >
                {t.label}
                {theme === t.id && <Check className="h-4 w-4" />}
              </button>
            ))}

            <div className="my-1 border-t border-edge" />
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-danger transition-colors hover:bg-elevated"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
