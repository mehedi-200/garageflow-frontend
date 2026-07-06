import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Shield } from 'lucide-react'
import Page from '../components/layout/Page'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import DataList from '../components/ui/DataList'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import useDebounce from '../hooks/useDebounce'
import cn from '../utils/cn'
import roleService from '../services/roleService'

export default function Roles() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | role
  const [deleting, setDeleting] = useState(null)
  const [serverError, setServerError] = useState(null)
  const q = useDebounce(search)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['roles', page, perPage, q],
    queryFn: () => roleService.list({ page, per_page: perPage, q: q || undefined }),
    placeholderData: (prev) => prev,
  })

  const roles = data?.data?.data ?? []
  const meta = data?.data?.meta

  const { data: permissionsData } = useQuery({
    queryKey: ['permissions'],
    queryFn: roleService.permissions,
  })
  const allPermissions = permissionsData?.data ?? []

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const selected = watch('permissions') ?? []

  function openForm(target) {
    setServerError(null)
    setEditing(target)
    reset(
      target === 'new'
        ? { name: '', permissions: [] }
        : { name: target.name, permissions: (target.permissions ?? []).map((p) => String(p.id)) }
    )
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['roles'] })
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  const saveMutation = useMutation({
    mutationFn: (values) =>
      editing === 'new' ? roleService.create(values) : roleService.update(editing.id, values),
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
    mutationFn: (id) => roleService.remove(id),
    onSuccess: () => {
      invalidate()
      setDeleting(null)
    },
    onError: (error) => {
      setDeleting(null)
      setServerError(error.response?.data?.message)
    },
  })

  const columns = [
    { key: 'name', header: 'Role' },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (row) => (
        <span className="flex flex-wrap gap-1.5">
          {(row.permissions ?? []).map((p) => (
            <span
              key={p.id}
              className="rounded-full border border-edge bg-elevated px-2 py-0.5 text-xs text-ink"
            >
              {p.label}
            </span>
          ))}
        </span>
      ),
    },
    { key: 'users_count', header: 'Users' },
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
      title="Roles"
      bare
      actions={
        <Button size="sm" onClick={() => openForm('new')}>
          <Plus className="h-4 w-4" /> Add Role
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        {serverError && editing === null && (
          <p className="rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {serverError}
          </p>
        )}

        <DataList
          toolbar={
            <>
              <Button size="sm" className="hidden md:inline-flex" onClick={() => openForm('new')}>
                <Plus className="h-4 w-4" /> Add Role
              </Button>
              <div className="w-full md:ml-auto md:w-72">
                <SearchInput
                  value={search}
                  onChange={(value) => {
                    setSearch(value)
                    setPage(1)
                  }}
                  placeholder="Search roles…"
                />
              </div>
            </>
          }
          columns={columns}
          rows={roles}
          loading={isLoading}
          empty={{
            icon: Shield,
            title: 'No roles yet',
            message: 'Create roles with feature permissions, then assign them to users.',
            action: (
              <Button onClick={() => openForm('new')}>
                <Plus className="h-4 w-4" /> Add Role
              </Button>
            ),
          }}
          renderCard={(row) => (
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Shield className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{row.name}</p>
                <p className="truncate text-sm text-subtle">
                  {(row.permissions ?? []).length} permissions · {row.users_count} users
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

      {/* Create / edit role with permission checkboxes */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Add Role' : 'Edit Role'}
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
            id="r-name"
            label="Role name"
            placeholder="e.g. Front Desk"
            error={errors.name?.message}
            {...register('name', { required: 'Role name is required' })}
          />

          <div>
            <p className="mb-1.5 text-sm font-medium text-subtle">Feature permissions</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {allPermissions.map((p) => (
                <label
                  key={p.id}
                  className={cn(
                    'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition-colors',
                    selected.includes(String(p.id))
                      ? 'border-accent bg-accent/10 text-ink'
                      : 'border-edge bg-surface text-subtle hover:border-accent/50'
                  )}
                >
                  <input
                    type="checkbox"
                    value={p.id}
                    className="accent-[var(--accent)]"
                    {...register('permissions', { required: 'Select at least one permission' })}
                  />
                  {p.label}
                </label>
              ))}
            </div>
            {errors.permissions && (
              <p className="mt-1.5 text-xs text-danger">{errors.permissions.message}</p>
            )}
          </div>

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
        title="Delete Role"
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
          Are you sure you want to delete the{' '}
          <span className="font-semibold text-ink">{deleting?.name}</span> role? Roles assigned to
          users cannot be deleted.
        </p>
      </Modal>
    </Page>
  )
}
