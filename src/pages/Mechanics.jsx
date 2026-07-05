import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Search, UsersRound } from 'lucide-react'
import Page from '../components/layout/Page'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import DataList from '../components/ui/DataList'
import Pagination from '../components/ui/Pagination'
import mechanicService from '../services/mechanicService'

export default function Mechanics() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | mechanic object
  const [deleting, setDeleting] = useState(null)
  const [serverError, setServerError] = useState(null)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['mechanics', page, perPage, search],
    queryFn: () => mechanicService.list({ page, per_page: perPage, q: search || undefined }),
    placeholderData: (prev) => prev,
  })

  const mechanics = data?.data?.data ?? []
  const meta = data?.data?.meta

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function openForm(target) {
    setServerError(null)
    setEditing(target)
    reset(
      target === 'new'
        ? { name: '', email: '', password: '' }
        : { name: target.name, email: target.email, password: '' }
    )
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['mechanics'] })
  }

  const saveMutation = useMutation({
    mutationFn: (values) =>
      editing === 'new'
        ? mechanicService.create(values)
        : mechanicService.update(editing.id, values),
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
    mutationFn: (id) => mechanicService.remove(id),
    onSuccess: () => {
      invalidate()
      setDeleting(null)
    },
  })

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'created_at', header: 'Added' },
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

  return (
    <Page
      title="Mechanics"
      subtitle="Manage your team's accounts"
      actions={
        <Button size="sm" onClick={() => openForm('new')}>
          <Plus className="h-4 w-4" /> Add Mechanic
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={search}
            placeholder="Search by name or email…"
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-xl border border-edge bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-subtle outline-none focus:border-accent"
          />
        </div>

        <DataList
          columns={columns}
          rows={mechanics}
          loading={isLoading}
          empty={{
            title: 'No mechanics yet',
            message: 'Add your first mechanic so you can assign service jobs.',
            action: (
              <Button onClick={() => openForm('new')}>
                <Plus className="h-4 w-4" /> Add Mechanic
              </Button>
            ),
          }}
          renderCard={(row) => (
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 font-bold text-accent">
                <UsersRound className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{row.name}</p>
                <p className="truncate text-sm text-subtle">{row.email}</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openForm(row)}>
                <Pencil className="h-4.5 w-4.5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleting(row)}>
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
        title={editing === 'new' ? 'Add Mechanic' : 'Edit Mechanic'}
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
            id="m-name"
            label="Name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            id="m-email"
            type="email"
            label="Email"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Input
            id="m-password"
            type="password"
            label={editing === 'new' ? 'Password' : 'New password (leave blank to keep)'}
            error={errors.password?.message}
            {...register('password', {
              required: editing === 'new' ? 'Password is required' : false,
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
          />
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
        title="Delete Mechanic"
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
          This cannot be undone.
        </p>
      </Modal>
    </Page>
  )
}
