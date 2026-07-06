import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, Car, Wrench, CheckCircle2, Banknote, ChevronRight } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import StatusChip from '../components/ui/StatusChip'
import JobHistoryList from '../components/jobs/JobHistoryList'
import money from '../utils/money'
import dashboardService from '../services/dashboardService'
import { JOB_STATUSES } from '../services/serviceJobService'

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.stats,
  })
  const stats = data?.data

  const cards = [
    { label: 'Total Customers', value: stats?.total_customers, icon: Users, to: '/customers' },
    { label: 'Total Vehicles', value: stats?.total_vehicles, icon: Car, to: '/vehicles' },
    { label: 'In Service', value: stats?.vehicles_in_service, icon: Wrench, to: '/jobs' },
    { label: 'Completed (month)', value: stats?.completed_this_month, icon: CheckCircle2, to: '/jobs' },
    { label: 'Revenue (month)', value: stats ? money(stats.revenue_this_month) : null, icon: Banknote, to: '/invoices' },
  ]

  if (isLoading) {
    return (
      <Page title="Dashboard" bare>
        <Spinner />
      </Page>
    )
  }

  return (
    <Page title="Dashboard" bare>
      <div className="flex flex-col gap-3">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {cards.map(({ label, value, icon: Icon, to }) => (
            <Link key={label} to={to}>
              <Card className="transition-colors hover:border-accent">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs text-subtle">{label}</p>
                    <p className="truncate text-lg font-bold text-ink">{value ?? '—'}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {/* Recent jobs */}
          <Card className="lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-subtle">RECENT JOBS</h2>
              <Link to="/jobs" className="flex items-center gap-0.5 text-xs font-semibold text-accent hover:text-accent-hover">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <JobHistoryList jobs={stats?.recent_jobs ?? []} />
          </Card>

          {/* Jobs by status */}
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-subtle">JOBS BY STATUS</h2>
            <div className="flex flex-col gap-2.5">
              {JOB_STATUSES.map(({ value }) => (
                <div key={value} className="flex items-center justify-between">
                  <StatusChip status={value} />
                  <span className="text-sm font-bold text-ink">
                    {stats?.jobs_by_status?.[value] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  )
}
