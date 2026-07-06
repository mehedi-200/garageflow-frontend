import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Users, Phone } from 'lucide-react'
import Page from '../components/layout/Page'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Modal from '../components/ui/Modal'
import DataList from '../components/ui/DataList'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import useDebounce from '../hooks/useDebounce'
import customerService from '../services/customerService'

export default function Customers() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | customer
  const [deleting, setDeleting] = useState(null)
  const [serverError, setServerError] = useState(null)
  const q = useDebounce(search)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['customers', page, perPage, q],
    queryFn: () => customerService.list({ page, per_page: perPage, q: q || undefined }),
    placeholderData: (prev) => prev,
  })

  const customers = data?.data?.data ?? []
  const meta = data?.data?.meta

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function openForm(target) {
    setServerError(null)
    setEditing(target)
    reset(
      target === 'new'
        ? { name: '', phone: '', email: '', address: '' }
        : { name: target.name, phone: target.phone, email: target.email ?? '', address: target.address ?? '' }
    )
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['customers'] })
  }

  const saveMutation = useMutation({
    mutationFn: (values) =>
      editing === 'new'
        ? customerService.create(values)
        : customerService.update(editing.id, values),
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
    mutationFn: (id) => customerService.remove(id),
    onSuccess: () => {
      invalidate()
      setDeleting(null)
    },
  })

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email', render: (row) => row.email ?? '—' },
    { key: 'address', header: 'Address', render: (row) => row.address ?? '—' },
    ...[
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
        ],
  ]

  return (
    <Page
      title="Customers"
      bare
      actions={
        <Button size="sm" onClick={() => openForm('new')}>
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        <DataList
          toolbar={
            <>
              <Button size="sm" className="hidden md:inline-flex" onClick={() => openForm('new')}>
                <Plus className="h-4 w-4" /> Add Customer
              </Button>
              <div className="w-full md:ml-auto md:w-72">
                <SearchInput
                  value={search}
                  onChange={(value) => {
                    setSearch(value)
                    setPage(1)
                  }}
                  placeholder="Search by name or phone…"
                />
              </div>
            </>
          }
          columns={columns}
          rows={customers}
          loading={isLoading}
          onRowClick={(row) => navigate(`/customers/${row.id}`)}
          empty={{
            icon: Users,
            title: q ? 'No customers match your search' : 'No customers yet',
            message: q ? 'Try a different name or phone number.' : 'Add your first customer to get started.',
            action: !q && (
              <Button onClick={() => openForm('new')}>
                <Plus className="h-4 w-4" /> Add Customer
              </Button>
            ),
          }}
          renderCard={(row) => (
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-base font-bold text-accent">
                {row.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{row.name}</p>
                <p className="flex items-center gap-1.5 text-sm text-subtle">
                  <Phone className="h-3.5 w-3.5" /> {row.phone}
                </p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Edit" onClick={(e) => { e.stopPropagation(); openForm(row) }}>
                <Pencil className="h-4.5 w-4.5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Delete" onClick={(e) => { e.stopPropagation(); setDeleting(row) }}>
                <Trash2 className="h-4.5 w-4.5 text-danger" />
              </Button>
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
        title={editing === 'new' ? 'Add Customer' : 'Edit Customer'}
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
          <Input
            id="c-name"
            label="Name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            id="c-phone"
            label="Phone"
            error={errors.phone?.message}
            {...register('phone', { required: 'Phone is required' })}
          />
          <Input id="c-email" type="email" label="Email (optional)" {...register('email')} />
          <Textarea id="c-address" label="Address (optional)" rows={2} {...register('address')} />
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
        title="Delete Customer"
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
          Are you sure you want to delete <span className="font-semibold text-ink">{deleting?.name}</span>?
          Their service history will be kept.
        </p>
      </Modal>
    </Page>
  )
}
