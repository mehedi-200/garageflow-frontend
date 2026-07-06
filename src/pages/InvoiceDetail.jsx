import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Printer, BadgeCheck, Pencil, Wrench } from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import StatusChip from '../components/ui/StatusChip'
import money from '../utils/money'
import invoiceService from '../services/invoiceService'

export default function InvoiceDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [editingLabor, setEditingLabor] = useState(false)
  const [laborValue, setLaborValue] = useState('')
  const [actionError, setActionError] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoiceService.get(id),
  })
  const invoice = data?.data
  const job = invoice?.job

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['invoices'] })
  }

  const laborMutation = useMutation({
    mutationFn: (value) => invoiceService.updateLabor(id, value),
    onSuccess: () => {
      invalidate()
      setEditingLabor(false)
      setActionError(null)
    },
    onError: (error) => setActionError(error.response?.data?.message),
  })

  const payMutation = useMutation({
    mutationFn: () => invoiceService.pay(id),
    onSuccess: () => setActionError(null) ?? invalidate(),
    onError: (error) => setActionError(error.response?.data?.message),
  })

  if (isLoading) {
    return (
      <Page title="Invoice" back backTo="/invoices">
        <Spinner />
      </Page>
    )
  }

  return (
    <Page
      title={invoice?.invoice_no ?? 'Invoice'}
      back
      backTo="/invoices"
      actions={
        <>
          {invoice?.payment_status === 'unpaid' && (
            <Button size="sm" onClick={() => payMutation.mutate()} disabled={payMutation.isPending}>
              <BadgeCheck className="h-4 w-4" /> Mark Paid
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </Button>
        </>
      }
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 print-invoice">
        {actionError && (
          <p className="rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger print:hidden">
            {actionError}
          </p>
        )}

        <Card>
          {/* Invoice header */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-edge pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-on-accent">
                <Wrench className="h-5.5 w-5.5" />
              </span>
              <div>
                <p className="text-lg font-bold text-ink">GarageFlow</p>
                <p className="text-xs text-subtle">Vehicle Service Management</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-ink">{invoice?.invoice_no}</p>
              <p className="text-xs text-subtle">Issued {invoice?.created_at?.slice(0, 10)}</p>
              <div className="mt-1.5">
                <StatusChip status={invoice?.payment_status} />
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid gap-4 border-b border-edge py-4 text-sm md:grid-cols-3">
            <div>
              <p className="mb-1 text-xs font-semibold text-subtle">BILL TO</p>
              <p className="font-semibold text-ink">{job?.vehicle?.customer?.name}</p>
              <p className="text-subtle">{job?.vehicle?.customer?.phone}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-subtle">VEHICLE</p>
              <p className="font-semibold text-ink">{job?.vehicle?.registration_no}</p>
              <p className="text-subtle">
                {job?.vehicle?.brand} {job?.vehicle?.model} · {job?.vehicle?.year}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-subtle">SERVICE</p>
              <p className="font-semibold text-ink">
                <Link to={`/jobs/${job?.id}`} className="text-accent hover:text-accent-hover print:text-ink">
                  Job #{job?.id} · {job?.service_type}
                </Link>
              </p>
              <p className="text-subtle">Mechanic: {job?.mechanic?.name}</p>
            </div>
          </div>

          {/* Line items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge text-left">
                <th className="py-2.5 font-semibold text-subtle">Description</th>
                <th className="py-2.5 text-right font-semibold text-subtle">Amount</th>
              </tr>
            </thead>
            <tbody>
              {job?.items?.map((item) => (
                <tr key={item.id} className="border-b border-edge">
                  <td className="py-2.5 text-ink">{item.name}</td>
                  <td className="py-2.5 text-right text-ink">{money(item.cost)}</td>
                </tr>
              ))}
              <tr className="border-b border-edge">
                <td className="py-2.5 text-ink">
                  <span className="flex items-center gap-2">
                    Labor
                    {invoice?.payment_status === 'unpaid' && !editingLabor && (
                      <button
                        type="button"
                        aria-label="Edit labor cost"
                        onClick={() => {
                          setLaborValue(String(invoice?.labor_cost ?? 0))
                          setEditingLabor(true)
                        }}
                        className="text-subtle hover:text-accent print:hidden"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </span>
                  {editingLabor && (
                    <span className="mt-2 flex max-w-xs items-center gap-2 print:hidden">
                      <Input
                        type="number"
                        step="0.01"
                        value={laborValue}
                        onChange={(e) => setLaborValue(e.target.value)}
                      />
                      <Button
                        size="sm"
                        disabled={laborMutation.isPending}
                        onClick={() => laborMutation.mutate(Number(laborValue) || 0)}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingLabor(false)}>
                        Cancel
                      </Button>
                    </span>
                  )}
                </td>
                <td className="py-2.5 text-right align-top text-ink">{money(invoice?.labor_cost)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="py-2 text-subtle">Parts subtotal</td>
                <td className="py-2 text-right text-ink">{money(invoice?.parts_cost)}</td>
              </tr>
              <tr className="border-t border-edge">
                <td className="py-3 text-base font-bold text-ink">Total</td>
                <td className="py-3 text-right text-base font-bold text-ink">{money(invoice?.total)}</td>
              </tr>
            </tfoot>
          </table>

          {invoice?.payment_status === 'paid' && (
            <p className="mt-2 text-xs text-success">
              Paid on {invoice?.paid_at?.slice(0, 10)}
            </p>
          )}
        </Card>
      </div>
    </Page>
  )
}
