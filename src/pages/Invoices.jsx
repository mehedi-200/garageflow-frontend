import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import Page from '../components/layout/Page'
import Select from '../components/ui/Select'
import DataList from '../components/ui/DataList'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import StatusChip from '../components/ui/StatusChip'
import useDebounce from '../hooks/useDebounce'
import money from '../utils/money'
import invoiceService from '../services/invoiceService'

const PAYMENT_OPTIONS = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'paid', label: 'Paid' },
]

export default function Invoices() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const q = useDebounce(search)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['invoices', page, perPage, q, paymentStatus],
    queryFn: () =>
      invoiceService.list({
        page,
        per_page: perPage,
        q: q || undefined,
        payment_status: paymentStatus || undefined,
      }),
    placeholderData: (prev) => prev,
  })

  const invoices = data?.data?.data ?? []
  const meta = data?.data?.meta

  const columns = [
    {
      key: 'invoice_no',
      header: 'Invoice',
      render: (row) => <span className="font-semibold">{row.invoice_no}</span>,
    },
    { key: 'customer', header: 'Customer', render: (row) => row.job?.vehicle?.customer?.name ?? '—' },
    { key: 'vehicle', header: 'Vehicle', render: (row) => row.job?.vehicle?.registration_no ?? '—' },
    { key: 'total', header: 'Total', render: (row) => <span className="font-medium">{money(row.total)}</span> },
    { key: 'payment_status', header: 'Payment', render: (row) => <StatusChip status={row.payment_status} /> },
    { key: 'created_at', header: 'Date', render: (row) => row.created_at?.slice(0, 10) },
  ]

  return (
    <Page title="Invoices" bare>
      <div className="flex flex-col gap-3">
        <DataList
          toolbar={
            <div className="flex w-full flex-col gap-2 md:ml-auto md:w-auto md:flex-row md:items-center">
              <div className="md:w-40">
                <Select
                  value={paymentStatus}
                  onChange={(e) => {
                    setPaymentStatus(e.target.value)
                    setPage(1)
                  }}
                  placeholder="All payments"
                  options={PAYMENT_OPTIONS}
                />
              </div>
              <div className="md:w-72">
                <SearchInput
                  value={search}
                  onChange={(value) => {
                    setSearch(value)
                    setPage(1)
                  }}
                  placeholder="Search invoice no, customer, reg…"
                />
              </div>
            </div>
          }
          columns={columns}
          rows={invoices}
          loading={isLoading}
          onRowClick={(row) => navigate(`/invoices/${row.id}`)}
          empty={{
            icon: FileText,
            title: q || paymentStatus ? 'No invoices match your filters' : 'No invoices yet',
            message:
              q || paymentStatus
                ? 'Try different filters.'
                : 'Invoices are created automatically when a job is completed.',
          }}
          renderCard={(row) => (
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{row.invoice_no}</p>
                <p className="truncate text-sm text-subtle">
                  {row.job?.vehicle?.customer?.name} · {money(row.total)}
                </p>
              </div>
              <StatusChip status={row.payment_status} />
            </div>
          )}
        />

        <Pagination
          page={meta?.current_page ?? page}
          lastPage={meta?.last_page ?? 1}
          total={meta?.total ?? 0}
          perPage={perPage}
          loading={isFetching}
          onPageChange={setPage}
          onPerPageChange={(n) => {
            setPerPage(n)
            setPage(1)
          }}
          onRefresh={refetch}
        />
      </div>
    </Page>
  )
}
