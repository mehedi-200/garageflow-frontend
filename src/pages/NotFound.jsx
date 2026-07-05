import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <Page title="Not Found">
      <Card>
        <EmptyState
          icon={Compass}
          title="Page not found"
          message="The page you are looking for doesn't exist."
          action={<Button onClick={() => navigate('/')}>Go to Dashboard</Button>}
        />
      </Card>
    </Page>
  )
}
