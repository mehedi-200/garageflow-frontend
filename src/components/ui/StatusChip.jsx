import cn from '../../utils/cn'

const styles = {
  pending: 'text-warning border-warning/40 bg-warning/10',
  in_progress: 'text-info border-info/40 bg-info/10',
  completed: 'text-success border-success/40 bg-success/10',
  delivered: 'text-accent border-accent/40 bg-accent/10',
  cancelled: 'text-danger border-danger/40 bg-danger/10',
  paid: 'text-success border-success/40 bg-success/10',
  unpaid: 'text-warning border-warning/40 bg-warning/10',
}

const labels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  paid: 'Paid',
  unpaid: 'Unpaid',
}

export default function StatusChip({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        styles[status] ?? 'text-subtle border-edge bg-elevated',
        className
      )}
    >
      {labels[status] ?? status}
    </span>
  )
}
