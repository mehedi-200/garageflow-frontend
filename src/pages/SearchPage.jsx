import { Search } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Input from '../components/ui/Input'

/* Full-screen app-style search page (mobile entry point for master search). */
export default function SearchPage() {
  return (
    <Page title="Search" back>
      <div className="flex flex-col gap-4">
        <Input type="search" placeholder="Search customers, vehicles, jobs…" autoFocus />
        <Card>
          <EmptyState
            icon={Search}
            title="Master search"
            message="Grouped results across customers, vehicles and jobs arrive in Feature 7."
          />
        </Card>
      </div>
    </Page>
  )
}
