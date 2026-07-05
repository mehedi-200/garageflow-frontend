import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 rounded-full bg-elevated p-4">
        <Icon className="h-7 w-7 text-subtle" />
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm text-subtle">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
