import { Wrench } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'

export default function Jobs() {
  return (
    <Page title="Service Jobs" subtitle="Track jobs from intake to delivery">
      <Card>
        <EmptyState
          icon={Wrench}
          title="No service jobs yet"
          message="The jobs board with the status workflow arrives in Feature 4."
        />
      </Card>
    </Page>
  )
}
