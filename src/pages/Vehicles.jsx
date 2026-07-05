import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Car } from 'lucide-react'
import Page from '../components/layout/Page'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Modal from '../components/ui/Modal'
import DataList from '../components/ui/DataList'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import useDebounce from '../hooks/useDebounce'
import useAuth from '../hooks/useAuth'
import vehicleService from '../services/vehicleService'
import customerService from '../services/customerService'

export default function Vehicles() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [serverError, setServerError] = useState(null)
  const q = useDebounce(search)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['vehicles', page, perPage, q, customerId],
    queryFn: () =>
      vehicleService.list({
        page,
        per_page: perPage,
        q: q || undefined,
        customer_id: customerId || undefined,
      }),
    placeholderData: (prev) => prev,
  })

  // Owner options for the filter and the form selector.
  const { data: customersData } = useQuery({
    queryKey: ['customers', 'options'],
    queryFn: () => customerService.list({ per_page: 100 }),
  })
  const customerOptions = (customersData?.data?.data ?? []).map((c) => ({
    value: c.id,
    label: `${c.name} — ${c.phone}`,
  }))

  const vehicles = data?.data?.data ?? []
  const meta = data?.data?.meta

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function openForm(target) {
    setServerError(null)
    setEditing(target)
    reset(
      target === 'new'
        ? { customer_id: '', registration_no: '', brand: '', model: '', year: '', notes: '' }
        : {
            customer_id: target.customer_id,
            registration_no: target.registration_no,
            brand: target.brand,
            model: target.model,
            year: target.year,
            notes: target.notes ?? '',
          }
    )
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    queryClient.invalidateQueries({ queryKey: ['customers'] })
  }

  const saveMutation = useMutation({
    mutationFn: (values) =>
      editing === 'new'
        ? vehicleService.create(values)
        : vehicleService.update(editing.id, values),
    onSuccess: () => {
      invalidate()
      setEditing(null)
    },
    onError: (error) => {
      const data = error.response?.data
      setServerError(
        data?.errors ? Object.values(data.errors).flat().join(' ') : data?.message
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => vehicleService.remove(id),
    onSuccess: () => {
      invalidate()
      setDeleting(null)
    },
  })

  const columns = [
    {
      key: 'registration_no',
      header: 'Registration',
      render: (row) => <span className="font-semibold">{row.registration_no}</span>,
    },
    { key: 'vehicle', header: 'Vehicle', render: (row) => `${row.brand} ${row.model}` },
    { key: 'year', header: 'Year' },
    { key: 'owner', header: 'Owner', render: (row) => row.customer?.name ?? '—' },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: '',
            render: (row) => (
              <span className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" aria-label="Edit" onClick={(e) => { e.stopPropagation(); openForm(row) }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Delete" onClick={(e) => { e.stopPropagation(); setDeleting(row) }}>
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </span>
            ),
          },
        ]
      : []),
  ]

  return (
    <Page
      title="Vehicles"
      subtitle="Vehicle registry"
      actions={
        isAdmin && (
          <Button size="sm" onClick={() => openForm('new')}>
            <Plus className="h-4 w-4" /> Add Vehicle
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Search registration, brand, model…"
          />
          <div className="md:w-64">
            <Select
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value)
                setPage(1)
              }}
              placeholder="All customers"
              options={customerOptions}
            />
          </div>
        </div>

        <DataList
          columns={columns}
          rows={vehicles}
          loading={isLoading}
          onRowClick={(row) => navigate(`/vehicles/${row.id}`)}
          empty={{
            icon: Car,
            title: q || customerId ? 'No vehicles match your filters' : 'No vehicles yet',
            message: q || customerId ? 'Try different search or filter.' : 'Add your first vehicle to get started.',
            action: isAdmin && !q && !customerId && (
              <Button onClick={() => openForm('new')}>
                <Plus className="h-4 w-4" /> Add Vehicle
              </Button>
            ),
          }}
          renderCard={(row) => (
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Car className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{row.registration_no}</p>
                <p className="truncate text-sm text-subtle">
                  {row.brand} {row.model} · {row.year} · {row.customer?.name}
                </p>
              </div>
              {isAdmin && (
                <>
                  <Button variant="ghost" size="icon" aria-label="Edit" onClick={(e) => { e.stopPropagation(); openForm(row) }}>
                    <Pencil className="h-4.5 w-4.5" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete" onClick={(e) => { e.stopPropagation(); setDeleting(row) }}>
                    <Trash2 className="h-4.5 w-4.5 text-danger" />
                  </Button>
                </>
              )}
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

      {/* Create / edit */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Add Vehicle' : 'Edit Vehicle'}
      >
        <form
          onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
          className="flex flex-col gap-4"
        >
          {serverError && (
            <p className="rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
              {serverError}
            </p>
          )}
          <Select
            id="v-customer"
            label="Owner"
            placeholder="Select customer…"
            options={customerOptions}
            error={errors.customer_id?.message}
            {...register('customer_id', { required: 'Owner is required' })}
          />
          <Input
            id="v-reg"
            label="Registration number"
            placeholder="DHA-12-3456"
            error={errors.registration_no?.message}
            {...register('registration_no', { required: 'Registration number is required' })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="v-brand"
              label="Brand"
              error={errors.brand?.message}
              {...register('brand', { required: 'Brand is required' })}
            />
            <Input
              id="v-model"
              label="Model"
              error={errors.model?.message}
              {...register('model', { required: 'Model is required' })}
            />
          </div>
          <Input
            id="v-year"
            type="number"
            label="Year"
            error={errors.year?.message}
            {...register('year', { required: 'Year is required' })}
          />
          <Textarea id="v-notes" label="Notes (optional)" rows={2} {...register('notes')} />
          <div className="mt-1 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete Vehicle"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleting.id)}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-subtle">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-ink">{deleting?.registration_no}</span>? Its service
          history will be kept.
        </p>
      </Modal>
    </Page>
  )
}
