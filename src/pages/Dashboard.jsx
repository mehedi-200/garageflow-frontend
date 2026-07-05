import { Users, Car, Wrench, CheckCircle2, Banknote } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'

// Placeholder stats — wired to GET /api/dashboard in Part 6B.
const STATS = [
  { label: 'Total Customers', value: '—', icon: Users },
  { label: 'Total Vehicles', value: '—', icon: Car },
  { label: 'In Service', value: '—', icon: Wrench },
  { label: 'Completed (month)', value: '—', icon: CheckCircle2 },
  { label: 'Revenue (month)', value: '—', icon: Banknote },
]

export default function Dashboard() {
  return (
    <Page title="Dashboard" subtitle="Overview of your garage">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
        {STATS.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-subtle">{label}</p>
                <p className="text-lg font-bold text-ink">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  )
}
