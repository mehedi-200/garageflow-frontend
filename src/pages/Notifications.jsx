import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import NotificationPanel from '../components/notifications/NotificationPanel'

export default function Notifications() {
  return (
    <Page title="Notifications" back>
      <div className="mx-auto max-w-2xl">
        <Card className="p-0">
          <NotificationPanel />
        </Card>
      </div>
    </Page>
  )
}
