import MobileTopBar from './MobileTopBar'
import PageHeader from '../ui/PageHeader'

/*
 * Standard page wrapper: app-style top bar on mobile,
 * PageHeader on desktop, consistent padding.
 */
export default function Page({ title, subtitle, back = false, actions, children }) {
  return (
    <>
      <MobileTopBar title={title} back={back} actions={actions} />
      <div className="p-4">
        <div className="hidden md:block">
          <PageHeader title={title} subtitle={subtitle} actions={actions} />
        </div>
        {children}
      </div>
    </>
  )
}
