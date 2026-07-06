/* Compact by design (CLAUDE.md rule 8) — no tall empty header bands. */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-baseline gap-x-2.5">
        <h1 className="text-lg font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-xs text-subtle">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
