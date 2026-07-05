import Card from './Card'
import EmptyState from './EmptyState'
import Spinner from './Spinner'

/*
 * One data-list component, two renders (CLAUDE.md rules 1–2):
 * desktop = table, mobile/tablet = app-style cards.
 * `toolbar` (search/filters) attaches directly to the top of the table —
 * never floating above with a gap (CLAUDE.md rule 8).
 *
 * columns: [{ key, header, render?(row) }]
 * renderCard(row): mobile card content for one row
 */
export default function DataList({
  columns,
  rows = [],
  renderCard,
  keyField = 'id',
  loading = false,
  empty,
  onRowClick,
  toolbar,
}) {
  const emptyState = (
    <EmptyState
      icon={empty?.icon}
      title={empty?.title ?? 'Nothing here yet'}
      message={empty?.message}
      action={empty?.action}
    />
  )

  return (
    <>
      {/* Desktop: toolbar + table in one attached container */}
      <div className="hidden overflow-hidden rounded-2xl border border-edge bg-surface md:block">
        {toolbar && (
          <div className="flex flex-wrap items-center gap-2 border-b border-edge px-3 py-2.5">
            {toolbar}
          </div>
        )}
        {loading ? (
          <Spinner />
        ) : !rows.length ? (
          emptyState
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-edge">
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 font-semibold text-subtle">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row[keyField]}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={
                      onRowClick
                        ? 'cursor-pointer border-b border-edge last:border-0 transition-colors hover:bg-elevated'
                        : 'border-b border-edge last:border-0'
                    }
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-ink">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile / tablet: toolbar + cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {toolbar && <div className="flex flex-col gap-2">{toolbar}</div>}
        {loading ? (
          <Spinner />
        ) : !rows.length ? (
          <Card>{emptyState}</Card>
        ) : (
          rows.map((row) => (
            <Card
              key={row[keyField]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'active:bg-elevated cursor-pointer' : undefined}
            >
              {renderCard(row)}
            </Card>
          ))
        )}
      </div>
    </>
  )
}
