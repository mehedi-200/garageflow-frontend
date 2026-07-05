import { Car } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'

export default function Vehicles() {
  return (
    <Page title="Vehicles" subtitle="Vehicle registry">
      <Card>
        <EmptyState
          icon={Car}
          title="No vehicles yet"
          message="Vehicle management arrives in Feature 3."
        />
      </Card>
    </Page>
  )
}
