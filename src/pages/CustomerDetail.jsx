import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Phone, Mail, MapPin, Car, Wrench, ChevronRight } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import customerService from '../services/customerService'

export default function CustomerDetail() {
  const { id } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerService.get(id),
  })
  const customer = data?.data

  if (isLoading) {
    return (
      <Page title="Customer" back>
        <Spinner />
      </Page>
    )
  }

  return (
    <Page title={customer?.name ?? 'Customer'} back>
      <div className="flex flex-col gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xl font-bold text-accent">
              {customer?.name?.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-ink">{customer?.name}</p>
              <p className="text-xs text-subtle">Customer since {customer?.created_at?.slice(0, 10)}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2.5 border-t border-edge pt-4 text-sm md:grid-cols-3">
            <p className="flex items-center gap-2 text-ink">
              <Phone className="h-4 w-4 shrink-0 text-subtle" /> {customer?.phone}
            </p>
            <p className="flex items-center gap-2 text-ink">
              <Mail className="h-4 w-4 shrink-0 text-subtle" /> {customer?.email ?? '—'}
            </p>
            <p className="flex items-center gap-2 text-ink">
              <MapPin className="h-4 w-4 shrink-0 text-subtle" /> {customer?.address ?? '—'}
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 text-sm font-semibold text-subtle">VEHICLES</h2>
          {customer?.vehicles?.length ? (
            <div className="flex flex-col">
              {customer.vehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  to={`/vehicles/${vehicle.id}`}
                  className="flex min-h-12 items-center gap-3 border-b border-edge py-2.5 last:border-0"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Car className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {vehicle.registration_no}
                    </p>
                    <p className="truncate text-xs text-subtle">
                      {vehicle.brand} {vehicle.model} · {vehicle.year}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-subtle" />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Car}
              title="No vehicles yet"
              message="This customer has no registered vehicles."
            />
          )}
        </Card>

        <Card>
          <h2 className="mb-2 text-sm font-semibold text-subtle">SERVICE HISTORY</h2>
          <EmptyState
            icon={Wrench}
            title="No service jobs yet"
            message="Service history will appear here once service jobs land (Feature 4)."
          />
        </Card>
      </div>
    </Page>
  )
}
