import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Car, User, Phone, Wrench, CalendarDays, StickyNote } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import vehicleService from '../services/vehicleService'

export default function VehicleDetail() {
  const { id } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => vehicleService.get(id),
  })
  const vehicle = data?.data

  if (isLoading) {
    return (
      <Page title="Vehicle" back backTo="/vehicles">
        <Spinner />
      </Page>
    )
  }

  return (
    <Page title={vehicle?.registration_no ?? 'Vehicle'} back backTo="/vehicles">
      <div className="flex flex-col gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Car className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-ink">
                {vehicle?.brand} {vehicle?.model}
              </p>
              <p className="text-sm text-subtle">{vehicle?.registration_no}</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-edge bg-elevated px-3 py-1 text-sm text-ink">
              <CalendarDays className="h-4 w-4 text-subtle" /> {vehicle?.year}
            </span>
          </div>

          <div className="mt-4 grid gap-2.5 border-t border-edge pt-4 text-sm md:grid-cols-3">
            <Link
              to={`/customers/${vehicle?.customer?.id}`}
              className="flex items-center gap-2 text-accent hover:text-accent-hover"
            >
              <User className="h-4 w-4 shrink-0" /> {vehicle?.customer?.name}
            </Link>
            <p className="flex items-center gap-2 text-ink">
              <Phone className="h-4 w-4 shrink-0 text-subtle" /> {vehicle?.customer?.phone}
            </p>
            {vehicle?.notes && (
              <p className="flex items-center gap-2 text-ink">
                <StickyNote className="h-4 w-4 shrink-0 text-subtle" /> {vehicle.notes}
              </p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 text-sm font-semibold text-subtle">SERVICE HISTORY</h2>
          <EmptyState
            icon={Wrench}
            title="No service jobs yet"
            message="This vehicle's service jobs will appear here once service jobs land (Feature 4)."
          />
        </Card>
      </div>
    </Page>
  )
}
