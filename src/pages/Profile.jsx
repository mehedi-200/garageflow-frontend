import { User } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'

export default function Profile() {
  return (
    <Page title="Profile" back>
      <Card>
        <EmptyState
          icon={User}
          title="Profile"
          message="Profile view & edit arrives in Part 1D."
        />
      </Card>
    </Page>
  )
}
