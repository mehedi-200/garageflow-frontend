import { forwardRef } from 'react'
import cn from '../../utils/cn'

const Textarea = forwardRef(function Textarea(
  { label, error, className, id, rows = 4, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-subtle">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={cn(
          'w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-ink',
          'placeholder:text-subtle outline-none transition-colors focus:border-accent',
          error ? 'border-danger' : 'border-edge',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  )
})

export default Textarea
