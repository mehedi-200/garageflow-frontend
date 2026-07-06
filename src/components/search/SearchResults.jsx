import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, Car, Wrench, SearchX } from 'lucide-react'
import Spinner from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import StatusChip from '../ui/StatusChip'
import searchService from '../../services/searchService'

/*
 * Grouped master-search results — reused by the header dropdown (desktop)
 * and the full-screen search page (mobile).
 */
export default function SearchResults({ q, onNavigate }) {
  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => searchService.search(q),
    enabled: q.length >= 2,
  })

  if (q.length < 2) {
    return <p className="px-4 py-6 text-center text-sm text-subtle">Type at least 2 characters…</p>
  }

  if (isLoading) return <Spinner />

  const { customers = [], vehicles = [], jobs = [] } = data?.data ?? {}
  const nothing = !customers.length && !vehicles.length && !jobs.length

  if (nothing) {
    return <EmptyState icon={SearchX} title="No results" message={`Nothing matched “${q}”.`} />
  }

  const Row = ({ to, icon: Icon, primary, secondary, chip }) => (
    <Link
      to={to}
      onClick={onNavigate}
      className="flex min-h-12 items-center gap-3 px-4 py-2 transition-colors hover:bg-elevated"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{primary}</p>
        <p className="truncate text-xs text-subtle">{secondary}</p>
      </div>
      {chip}
    </Link>
  )

  const Group = ({ label, children }) => (
    <div className="py-1.5">
      <p className="px-4 pb-1 text-[11px] font-bold tracking-wide text-subtle">{label}</p>
      {children}
    </div>
  )

  return (
    <div className="divide-y divide-edge">
      {customers.length > 0 && (
        <Group label="CUSTOMERS">
          {customers.map((c) => (
            <Row
              key={`c${c.id}`}
              to={`/customers/${c.id}`}
              icon={Users}
              primary={c.name}
              secondary={c.phone}
            />
          ))}
        </Group>
      )}
      {vehicles.length > 0 && (
        <Group label="VEHICLES">
          {vehicles.map((v) => (
            <Row
              key={`v${v.id}`}
              to={`/vehicles/${v.id}`}
              icon={Car}
              primary={v.registration_no}
              secondary={`${v.brand} ${v.model} · ${v.customer?.name ?? ''}`}
            />
          ))}
        </Group>
      )}
      {jobs.length > 0 && (
        <Group label="SERVICE JOBS">
          {jobs.map((j) => (
            <Row
              key={`j${j.id}`}
              to={`/jobs/${j.id}`}
              icon={Wrench}
              primary={`#${j.id} · ${j.service_type}`}
              secondary={j.vehicle?.registration_no}
              chip={<StatusChip status={j.status} />}
            />
          ))}
        </Group>
      )}
    </div>
  )
}
