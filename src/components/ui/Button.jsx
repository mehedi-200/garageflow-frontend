import cn from '../../utils/cn'

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'bg-elevated text-ink border border-edge hover:border-accent',
  danger: 'bg-danger text-on-accent hover:opacity-90',
  ghost: 'text-subtle hover:text-ink hover:bg-elevated',
  accentGhost: 'text-accent hover:text-accent-hover',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-5 py-3 text-base rounded-xl',
  icon: 'p-2.5 rounded-full',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors',
        'min-h-11 md:min-h-0', // 44px touch target on mobile
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
