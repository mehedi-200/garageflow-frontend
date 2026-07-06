import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Wrench } from 'lucide-react'
import Page from '../components/layout/Page'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Modal from '../components/ui/Modal'
import DataList from '../components/ui/DataList'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import StatusChip from '../components/ui/StatusChip'
import useDebounce from '../hooks/useDebounce'
import serviceJobService, { SERVICE_TYPES, JOB_STATUSES } from '../services/serviceJobService'
import vehicleService from '../services/vehicleService'
import userService from '../services/userService'

export default function Jobs() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [mechanicId, setMechanicId] = useState('')
  const [creating, setCreating] = useState(false)
  const [serverError, setServerError] = useState(null)
  const q = useDebounce(search)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['service-jobs', page, perPage, q, status, mechanicId],
    queryFn: () =>
      serviceJobService.list({
        page,
        per_page: perPage,
        q: q || undefined,
        status: status || undefined,
        mechanic_id: mechanicId || undefined,
      }),
    placeholderData: (prev) => prev,
  })

  const jobs = data?.data?.data ?? []
  const meta = data?.data?.meta

  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles', 'options'],
    queryFn: () => vehicleService.list({ per_page: 100 }),
    enabled: creating,
  })
  const vehicleOptions = (vehiclesData?.data?.data ?? []).map((v) => ({
    value: v.id,
    label: `${v.registration_no} — ${v.customer?.name}`,
  }))

  const { data: usersData } = useQuery({
    queryKey: ['users', 'options'],
    queryFn: () => userService.list({ per_page: 100 }),
  })
  const mechanicOptions = (usersData?.data?.data ?? [])
    .filter((u) => !u.is_admin)
    .map((u) => ({ value: u.id, label: u.name }))

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function openCreate() {
    setServerError(null)
    reset({ vehicle_id: '', mechanic_id: '', service_type: '', description: '', expected_delivery: '' })
    setCreating(true)
  }

  const createMutation = useMutation({
    mutationFn: (values) =>
      serviceJobService.create({
        ...values,
        expected_delivery: values.expected_delivery || null,
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['service-jobs'] })
      setCreating(false)
      navigate(`/jobs/${response.data.id}`)
    },
    onError: (error) => {
      const data = error.response?.data
      setServerError(
        data?.errors ? Object.values(data.errors).flat().join(' ') : data?.message
      )
    },
  })

  const columns = [
    { key: 'id', header: 'Job', render: (row) => <span className="font-semibold">#{row.id}</span> },
    { key: 'vehicle', header: 'Vehicle', render: (row) => row.vehicle?.registration_no },
    { key: 'customer', header: 'Customer', render: (row) => row.vehicle?.customer?.name ?? '—' },
    { key: 'service_type', header: 'Type' },
    { key: 'mechanic', header: 'Mechanic', render: (row) => row.mechanic?.name },
    { key: 'status', header: 'Status', render: (row) => <StatusChip status={row.status} /> },
    { key: 'expected_delivery', header: 'Delivery', render: (row) => row.expected_delivery ?? '—' },
  ]

  return (
    <Page
      title="Service Jobs"
      bare
      actions={
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Job
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        <DataList
          toolbar={
            <>
              <Button size="sm" className="hidden md:inline-flex" onClick={openCreate}>
                <Plus className="h-4 w-4" /> New Job
              </Button>
              <div className="flex w-full flex-col gap-2 md:ml-auto md:w-auto md:flex-row md:items-center">
                <div className="md:w-44">
                  <Select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value)
                      setPage(1)
                    }}
                    placeholder="All statuses"
                    options={JOB_STATUSES}
                  />
                </div>
                <div className="md:w-48">
                  <Select
                    value={mechanicId}
                    onChange={(e) => {
                      setMechanicId(e.target.value)
                      setPage(1)
                    }}
                    placeholder="All mechanics"
                    options={mechanicOptions}
                  />
                </div>
                <div className="md:w-64">
                  <SearchInput
                    value={search}
                    onChange={(value) => {
                      setSearch(value)
                      setPage(1)
                    }}
                    placeholder="Search reg no or customer…"
                  />
                </div>
              </div>
            </>
          }
          columns={columns}
          rows={jobs}
          loading={isLoading}
          onRowClick={(row) => navigate(`/jobs/${row.id}`)}
          empty={{
            icon: Wrench,
            title: q || status || mechanicId ? 'No jobs match your filters' : 'No service jobs yet',
            message:
              q || status || mechanicId
                ? 'Try different filters.'
                : 'Create your first service job to get started.',
            action: !q && !status && !mechanicId && (
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" /> New Job
              </Button>
            ),
          }}
          renderCard={(row) => (
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Wrench className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">
                  #{row.id} · {row.vehicle?.registration_no}
                </p>
                <p className="truncate text-sm text-subtle">
                  {row.service_type} · {row.mechanic?.name}
                </p>
              </div>
              <StatusChip status={row.status} />
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

      {/* Create job */}
      <Modal open={creating} onClose={() => setCreating(false)} title="New Service Job">
        <form
          onSubmit={handleSubmit((values) => createMutation.mutate(values))}
          className="flex flex-col gap-4"
        >
          {serverError && (
            <p className="rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
              {serverError}
            </p>
          )}
          <Select
            id="j-vehicle"
            label="Vehicle"
            placeholder="Select vehicle…"
            options={vehicleOptions}
            error={errors.vehicle_id?.message}
            {...register('vehicle_id', { required: 'Vehicle is required' })}
          />
          <Select
            id="j-mechanic"
            label="Mechanic"
            placeholder="Assign mechanic…"
            options={mechanicOptions}
            error={errors.mechanic_id?.message}
            {...register('mechanic_id', { required: 'Mechanic is required' })}
          />
          <Select
            id="j-type"
            label="Service type"
            placeholder="Select type…"
            options={SERVICE_TYPES.map((t) => ({ value: t, label: t }))}
            error={errors.service_type?.message}
            {...register('service_type', { required: 'Service type is required' })}
          />
          <Input
            id="j-delivery"
            type="date"
            label="Expected delivery (optional)"
            {...register('expected_delivery')}
          />
          <Textarea
            id="j-desc"
            label="Description (optional)"
            rows={3}
            placeholder="What needs to be done?"
            {...register('description')}
          />
          <div className="mt-1 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create Job'}
            </Button>
          </div>
        </form>
      </Modal>
    </Page>
  )
}
