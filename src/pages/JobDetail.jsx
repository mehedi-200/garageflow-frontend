import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Car,
  User,
  Wrench,
  CalendarDays,
  Plus,
  Trash2,
  ArrowRight,
  Ban,
  FileText,
} from 'lucide-react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import StatusChip from '../components/ui/StatusChip'
import EmptyState from '../components/ui/EmptyState'
import useAuth from '../hooks/useAuth'
import money from '../utils/money'
import serviceJobService, { NEXT_STATUS, JOB_STATUSES } from '../services/serviceJobService'

const NEXT_LABEL = {
  in_progress: 'Start Job',
  completed: 'Mark Completed',
  delivered: 'Mark Delivered',
}

export default function JobDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { user, isAdmin } = useAuth()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [actionError, setActionError] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['service-jobs', id],
    queryFn: () => serviceJobService.get(id),
  })
  const job = data?.data

  const canManage = isAdmin || job?.mechanic?.id === user?.id
  const nextStatus = NEXT_STATUS[job?.status]
  const statusLabel = (s) => JOB_STATUSES.find((x) => x.value === s)?.label ?? s

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['service-jobs'] })
  }

  const statusMutation = useMutation({
    mutationFn: (status) => serviceJobService.changeStatus(id, status),
    onSuccess: () => {
      invalidate()
      setConfirmCancel(false)
      setActionError(null)
    },
    onError: (error) => setActionError(error.response?.data?.message),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const addItemMutation = useMutation({
    mutationFn: (values) => serviceJobService.addItem(id, values),
    onSuccess: () => {
      invalidate()
      reset({ name: '', cost: '' })
      setActionError(null)
    },
    onError: (error) => setActionError(error.response?.data?.message),
  })

  const removeItemMutation = useMutation({
    mutationFn: (itemId) => serviceJobService.removeItem(id, itemId),
    onSuccess: invalidate,
    onError: (error) => setActionError(error.response?.data?.message),
  })

  if (isLoading) {
    return (
      <Page title="Service Job" back backTo="/jobs">
        <Spinner />
      </Page>
    )
  }

  return (
    <Page
      title={`Job #${job?.id}`}
      back
      backTo="/jobs"
      actions={
        <>
          {job?.invoice && (
            <Link to={`/invoices/${job.invoice.id}`}>
              <Button size="sm" variant="secondary">
                <FileText className="h-4 w-4" /> Invoice
              </Button>
            </Link>
          )}
          {canManage && nextStatus && (
            <Button size="sm" onClick={() => statusMutation.mutate(nextStatus)} disabled={statusMutation.isPending}>
              {NEXT_LABEL[nextStatus]} <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {isAdmin && job?.status !== 'delivered' && job?.status !== 'cancelled' && (
            <Button size="sm" variant="danger" onClick={() => setConfirmCancel(true)}>
              <Ban className="h-4 w-4" /> Cancel
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {actionError && (
          <p className="rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {actionError}
          </p>
        )}

        {/* Job summary */}
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Wrench className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{job?.service_type}</p>
              <p className="text-xs text-subtle">Created {job?.created_at?.slice(0, 10)}</p>
            </div>
            <StatusChip status={job?.status} />
          </div>

          {/* Status timeline */}
          <div className="mt-4 flex items-center gap-1.5 border-t border-edge pt-4">
            {['pending', 'in_progress', 'completed', 'delivered'].map((s, i) => {
              const order = ['pending', 'in_progress', 'completed', 'delivered']
              const reached = job?.status === 'cancelled' ? false : order.indexOf(job?.status) >= i
              return (
                <div key={s} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className={`h-1.5 w-full rounded-full ${reached ? 'bg-accent' : 'bg-elevated'}`}
                  />
                  <span className={`text-[10px] font-medium ${reached ? 'text-accent' : 'text-subtle'}`}>
                    {statusLabel(s)}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 grid gap-2.5 border-t border-edge pt-4 text-sm md:grid-cols-2 xl:grid-cols-4">
            <Link
              to={`/vehicles/${job?.vehicle?.id}`}
              className="flex items-center gap-2 text-accent hover:text-accent-hover"
            >
              <Car className="h-4 w-4 shrink-0" />
              {job?.vehicle?.registration_no} · {job?.vehicle?.brand} {job?.vehicle?.model}
            </Link>
            <Link
              to={`/customers/${job?.vehicle?.customer?.id}`}
              className="flex items-center gap-2 text-accent hover:text-accent-hover"
            >
              <User className="h-4 w-4 shrink-0" /> {job?.vehicle?.customer?.name}
            </Link>
            <p className="flex items-center gap-2 text-ink">
              <Wrench className="h-4 w-4 shrink-0 text-subtle" /> {job?.mechanic?.name}
            </p>
            <p className="flex items-center gap-2 text-ink">
              <CalendarDays className="h-4 w-4 shrink-0 text-subtle" />
              {job?.expected_delivery ?? 'No delivery date'}
            </p>
          </div>

          {job?.description && (
            <p className="mt-4 border-t border-edge pt-4 text-sm text-subtle">{job.description}</p>
          )}
        </Card>

        {/* Service items */}
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-subtle">SERVICE ITEMS (PARTS & WORK)</h2>
            <span className="text-sm font-bold text-ink">{money(job?.items_total)}</span>
          </div>

          {job?.items?.length ? (
            <div className="flex flex-col">
              {job.items.map((item) => (
                <div
                  key={item.id}
                  className="flex min-h-11 items-center gap-3 border-b border-edge py-2 text-sm last:border-0"
                >
                  <span className="flex-1 text-ink">{item.name}</span>
                  <span className="font-medium text-ink">{money(item.cost)}</span>
                  {canManage && job.status === 'in_progress' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove item"
                      onClick={() => removeItemMutation.mutate(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Wrench}
              title="No items yet"
              message={
                job?.status === 'pending'
                  ? 'Items can be added once the job is in progress.'
                  : 'No parts or work recorded for this job.'
              }
            />
          )}

          {canManage && job?.status === 'in_progress' && (
            <form
              onSubmit={handleSubmit((values) => addItemMutation.mutate(values))}
              className="mt-3 flex flex-col gap-2 border-t border-edge pt-3 md:flex-row md:items-start"
            >
              <div className="flex-1">
                <Input
                  id="item-name"
                  placeholder="Part or work name…"
                  error={errors.name?.message}
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              <div className="md:w-36">
                <Input
                  id="item-cost"
                  type="number"
                  step="0.01"
                  placeholder="Cost"
                  error={errors.cost?.message}
                  {...register('cost', { required: 'Cost is required' })}
                />
              </div>
              <Button type="submit" disabled={addItemMutation.isPending}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </form>
          )}
        </Card>
      </div>

      {/* Cancel confirm */}
      <Modal
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel Job"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmCancel(false)}>
              Keep Job
            </Button>
            <Button
              variant="danger"
              disabled={statusMutation.isPending}
              onClick={() => statusMutation.mutate('cancelled')}
            >
              {statusMutation.isPending ? 'Cancelling…' : 'Cancel Job'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-subtle">
          Are you sure you want to cancel job <span className="font-semibold text-ink">#{job?.id}</span>?
          This cannot be undone.
        </p>
      </Modal>
    </Page>
  )
}
