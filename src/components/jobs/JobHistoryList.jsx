import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Wrench, ChevronRight } from 'lucide-react'
import Spinner from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import StatusChip from '../ui/StatusChip'
import serviceJobService from '../../services/serviceJobService'

/*
 * Reusable service-history list (customer & vehicle detail pages).
 * Pass either { customerId } or { vehicleId }.
 */
export default function JobHistoryList({ customerId, vehicleId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['service-jobs', 'history', { customerId, vehicleId }],
    queryFn: () =>
      serviceJobService.list({
        customer_id: customerId || undefined,
        vehicle_id: vehicleId || undefined,
        per_page: 20,
      }),
  })

  if (isLoading) return <Spinner />

  const jobs = data?.data?.data ?? []

  if (!jobs.length) {
    return (
      <EmptyState
        icon={Wrench}
        title="No service jobs yet"
        message="Jobs will appear here once work is logged."
      />
    )
  }

  return (
    <div className="flex flex-col">
      {jobs.map((job) => (
        <Link
          key={job.id}
          to={`/jobs/${job.id}`}
          className="flex min-h-12 items-center gap-3 border-b border-edge py-2.5 last:border-0"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Wrench className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              #{job.id} · {job.service_type}
            </p>
            <p className="truncate text-xs text-subtle">
              {job.vehicle?.registration_no} · {job.mechanic?.name} · {job.created_at?.slice(0, 10)}
            </p>
          </div>
          <StatusChip status={job.status} />
          <ChevronRight className="h-4 w-4 text-subtle" />
        </Link>
      ))}
    </div>
  )
}
