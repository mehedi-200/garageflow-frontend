import cn from '../../utils/cn'

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-2xl border border-edge bg-surface p-4 md:p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}
