/* Desktop-only thin footer (CLAUDE.md UI rule 3). */
export default function Footer() {
  return (
    <footer className="hidden h-9 shrink-0 items-center justify-between border-t border-edge bg-surface px-4 text-xs text-subtle md:flex">
      <span>GarageFlow © {new Date().getFullYear()}</span>
      <span>
        Built by{' '}
        <a
          href="https://github.com/mehedi-200"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:text-accent-hover"
        >
          Mehedi
        </a>
      </span>
    </footer>
  )
}
