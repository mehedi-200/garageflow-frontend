import { Search } from 'lucide-react'

/* Shared list-page search input (CLAUDE.md rule 6 — reuse, no copy-paste). */
export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-11 md:min-h-0 rounded-xl border border-edge bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-subtle outline-none transition-colors focus:border-accent"
      />
    </div>
  )
}
