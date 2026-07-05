import { useNavigate } from 'react-router-dom'
import { User, FileText, UsersRound, LogOut, Palette, Check, ChevronRight } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import useTheme from '../hooks/useTheme'
import useAuth from '../hooks/useAuth'
import cn from '../utils/cn'

/* Mobile "More" tab — profile, invoices, theme switcher, logout. */
export default function More() {
  const navigate = useNavigate()
  const { theme, setTheme, themes } = useTheme()
  const { logout, isAdmin } = useAuth()

  const links = [
    { label: 'Profile', icon: User, onClick: () => navigate('/profile') },
    { label: 'Invoices', icon: FileText, onClick: () => navigate('/invoices') },
    ...(isAdmin
      ? [{ label: 'Mechanics', icon: UsersRound, onClick: () => navigate('/mechanics') }]
      : []),
  ]

  return (
    <Page title="More">
      <div className="flex flex-col gap-4">
        <Card className="p-0">
          {links.map(({ label, icon: Icon, onClick }, i) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className={cn(
                'flex min-h-14 w-full items-center gap-3 px-4 text-sm font-medium text-ink transition-colors active:bg-elevated',
                i > 0 && 'border-t border-edge'
              )}
            >
              <Icon className="h-5 w-5 text-subtle" />
              {label}
              <ChevronRight className="ml-auto h-4 w-4 text-subtle" />
            </button>
          ))}
        </Card>

        <Card>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-subtle">
            <Palette className="h-4 w-4" /> THEME
          </p>
          <div className="flex flex-col gap-1">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={cn(
                  'flex min-h-12 items-center justify-between rounded-xl px-3 text-sm font-medium transition-colors active:bg-elevated',
                  theme === t.id ? 'text-accent' : 'text-ink'
                )}
              >
                {t.label}
                {theme === t.id && <Check className="h-5 w-5" />}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-0">
          <button
            type="button"
            onClick={logout}
            className="flex min-h-14 w-full items-center gap-3 px-4 text-sm font-medium text-danger transition-colors active:bg-elevated"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </Card>
      </div>
    </Page>
  )
}
