import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck } from 'lucide-react'
import Spinner from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'
import cn from '../../utils/cn'
import notificationService from '../../services/notificationService'

/*
 * Notification list — reused by the header dropdown (desktop)
 * and the notifications page (mobile).
 */
export default function NotificationPanel({ onNavigate }) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => notificationService.list({ per_page: 15 }),
  })

  const markAllMutation = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const notifications = data?.data?.data ?? []

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-edge px-4 py-2.5">
        <p className="text-sm font-semibold text-ink">Notifications</p>
        <Button
          variant="accentGhost"
          size="sm"
          onClick={() => markAllMutation.mutate()}
          disabled={markAllMutation.isPending}
        >
          <CheckCheck className="h-4 w-4" /> Mark all read
        </Button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" message="You're all caught up." />
      ) : (
        <div className="max-h-96 divide-y divide-edge overflow-y-auto">
          {notifications.map((n) => (
            <Link
              key={n.id}
              to={n.link ?? '#'}
              onClick={onNavigate}
              className={cn(
                'flex min-h-12 items-start gap-3 px-4 py-3 transition-colors hover:bg-elevated',
                !n.read && 'bg-accent/5'
              )}
            >
              <span
                className={cn(
                  'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                  n.read ? 'bg-edge' : 'bg-accent'
                )}
              />
              <div className="min-w-0 flex-1">
                <p className={cn('text-sm', n.read ? 'text-subtle' : 'font-medium text-ink')}>
                  {n.message}
                </p>
                <p className="mt-0.5 text-xs text-subtle">{n.created_at}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
