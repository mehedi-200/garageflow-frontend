import { FileText } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'

export default function Invoices() {
  return (
    <Page title="Invoices" subtitle="Billing & payments">
      <Card>
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          message="Invoicing arrives in Feature 5."
        />
      </Card>
    </Page>
  )
}
