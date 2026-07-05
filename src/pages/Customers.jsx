import { Users, Plus } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'

export default function Customers() {
  // Real list + search + TanStack Query arrive in Part 2B.
  return (
    <Page
      title="Customers"
      subtitle="Manage your garage's customers"
      actions={
        <Button size="sm">
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <Card>
          <EmptyState
            icon={Users}
            title="No customers yet"
            message="Customer management arrives in Feature 2 — list, search, add, edit and detail pages."
          />
        </Card>
        <Pagination page={1} lastPage={1} total={0} perPage={10} />
      </div>
    </Page>
  )
}
