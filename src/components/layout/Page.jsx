import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import MobileTopBar from './MobileTopBar'
import PageHeader from '../ui/PageHeader'

/*
 * Standard page wrapper: app-style top bar on mobile, compact header on
 * desktop. Detail ("view") pages pass `back` (+ `backTo`) — they render a
 * back button + inline title on ALL breakpoints (CLAUDE.md rule 8).
 */
export default function Page({ title, subtitle, back = false, backTo, bare = false, actions, children }) {
  const navigate = useNavigate()

  return (
    <>
      <MobileTopBar title={title} back={back} backTo={backTo} actions={actions} />
      <div className="p-3">
        {back ? (
          <div className="mb-3 hidden items-center gap-2.5 md:flex">
            <button
              type="button"
              onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
              aria-label="Back"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated text-ink transition-colors hover:bg-accent hover:text-on-accent"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <h1 className="text-lg font-semibold text-ink">{title}</h1>
            {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
          </div>
        ) : bare ? null : (
          <div className="hidden md:block">
            <PageHeader title={title} subtitle={subtitle} actions={actions} />
          </div>
        )}
        {children}
      </div>
    </>
  )
}
