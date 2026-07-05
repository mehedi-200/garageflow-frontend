import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import cn from '../../utils/cn'

/*
 * THE shared pagination component — CLAUDE.md UI rule 7.
 * Desktop: approved design — rounded bar with circular accent refresh
 * button, "Showing [N] entries", "Show [size]" input, ‹Previous /
 * numbered pages (active = solid accent square) / Next›.
 * Mobile: compact app-style variant, same data and behavior.
 */

function pageWindow(current, last) {
  if (last <= 5) return Array.from({ length: last }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, '…', last]
  if (current >= last - 2) return [1, '…', last - 3, last - 2, last - 1, last]
  return [1, '…', current - 1, current, current + 1, '…', last]
}

export default function Pagination({
  page = 1,
  lastPage = 1,
  total = 0,
  perPage = 10,
  onPageChange,
  onPerPageChange,
  onRefresh,
  loading = false,
}) {
  const pages = pageWindow(page, lastPage)
  const prevDisabled = page <= 1
  const nextDisabled = page >= lastPage

  const refreshBtn = (
    <button
      type="button"
      onClick={onRefresh}
      aria-label="Refresh"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-colors hover:bg-accent-hover"
    >
      <RefreshCw className={cn('h-4.5 w-4.5', loading && 'animate-spin')} />
    </button>
  )

  const perPageInput = (
    <label className="flex items-center gap-2 text-sm text-ink">
      Show
      <input
        type="number"
        min="1"
        max="100"
        value={perPage}
        onChange={(e) => onPerPageChange?.(Number(e.target.value) || 10)}
        className="w-16 rounded-xl border border-edge bg-surface px-2 py-1.5 text-center text-sm text-ink outline-none focus:border-accent"
      />
    </label>
  )

  return (
    <>
      {/* ---------- Desktop: approved bar design ---------- */}
      <div className="hidden items-center gap-4 rounded-2xl border border-edge bg-surface px-4 py-3 md:flex">
        {refreshBtn}
        <span className="flex items-center gap-2 text-sm text-ink">
          Showing
          <span className="rounded-lg bg-elevated px-2.5 py-1 font-semibold">
            {total}
          </span>
          entries
        </span>

        <div className="ml-auto flex items-center gap-5">
          {perPageInput}

          <button
            type="button"
            disabled={prevDisabled}
            onClick={() => onPageChange?.(page - 1)}
            className="flex items-center gap-0.5 text-sm font-semibold text-accent transition-colors hover:text-accent-hover disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {pages.map((p, i) =>
              p === '…' ? (
                <span key={`e${i}`} className="px-1 text-sm text-subtle">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange?.(p)}
                  aria-current={p === page ? 'page' : undefined}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                    p === page
                      ? 'bg-accent text-on-accent'
                      : 'text-ink hover:bg-elevated'
                  )}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            disabled={nextDisabled}
            onClick={() => onPageChange?.(page + 1)}
            className="flex items-center gap-0.5 text-sm font-semibold text-accent transition-colors hover:text-accent-hover disabled:pointer-events-none disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ---------- Mobile / tablet: app-style variant ---------- */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-edge bg-surface px-3 py-2.5 md:hidden">
        {refreshBtn}
        <div className="flex min-w-0 flex-col items-center">
          <span className="text-sm font-semibold text-ink">
            Page {page} of {lastPage}
          </span>
          <span className="text-xs text-subtle">{total} entries</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={prevDisabled}
            onClick={() => onPageChange?.(page - 1)}
            aria-label="Previous page"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-elevated text-ink transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            disabled={nextDisabled}
            onClick={() => onPageChange?.(page + 1)}
            aria-label="Next page"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-on-accent transition-colors disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  )
}
