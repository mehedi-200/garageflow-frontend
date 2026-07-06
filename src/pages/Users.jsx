import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, UsersRound, ShieldCheck } from 'lucide-react'
import Page from '../components/layout/Page'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import DataList from '../components/ui/DataList'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import useDebounce from '../hooks/useDebounce'
import userService from '../services/userService'
import roleService from '../services/roleService'

export default function Users() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | user
  const [deleting, setDeleting] = useState(null)
  const [serverError, setServerError] = useState(null)
  const q = useDebounce(search)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['users', page, perPage, q],
    queryFn: () => userService.list({ page, per_page: perPage, q: q || undefined }),
    placeholderData: (prev) => prev,
  })

  const users = data?.data?.data ?? []
  const meta = data?.data?.meta

  const { data: rolesData } = useQuery({
    queryKey: ['roles', 'options'],
    queryFn: () => roleService.list({ per_page: 100 }),
  })
  const roleOptions = (rolesData?.data?.data ?? []).map((r) => ({
    value: r.id,
    label: r.name,
  }))

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function openForm(target) {
    setServerError(null)
    setEditing(target)
    reset(
      target === 'new'
        ? { name: '', email: '', password: '', role_id: '' }
        : { name: target.name, email: target.email, password: '', role_id: target.role?.id ?? '' }
    )
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    queryClient.invalidateQueries({ queryKey: ['roles'] })
  }

  const saveMutation = useMutation({
    mutationFn: (values) =>
      editing === 'new' ? userService.create(values) : userService.update(editing.id, values),
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
    mutationFn: (id) => userService.remove(id),
    onSuccess: () => {
      invalidate()
      setDeleting(null)
    },
    onError: (error) => {
      setDeleting(null)
      setServerError(error.response?.data?.message)
    },
  })

  const roleBadge = (row) =>
    row.is_admin ? (
      <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
        <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
      </span>
    ) : (
      <span className="text-ink">{row.role?.name ?? '—'}</span>
    )

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: roleBadge },
    { key: 'created_at', header: 'Added' },
    {
      key: 'actions',
      header: '',
      render: (row) =>
        row.is_admin ? null : (
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
      title="Users"
      bare
      actions={
        <Button size="sm" onClick={() => openForm('new')}>
          <Plus className="h-4 w-4" /> Add User
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
                <Plus className="h-4 w-4" /> Add User
              </Button>
              <div className="w-full md:ml-auto md:w-72">
                <SearchInput
                  value={search}
                  onChange={(value) => {
                    setSearch(value)
                    setPage(1)
                  }}
                  placeholder="Search by name or email…"
                />
              </div>
            </>
          }
          columns={columns}
          rows={users}
          loading={isLoading}
          empty={{
            icon: UsersRound,
            title: 'No users yet',
            message: 'Add users and assign them a role to control what they can access.',
          }}
          renderCard={(row) => (
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 font-bold text-accent">
                <UsersRound className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{row.name}</p>
                <p className="truncate text-sm text-subtle">
                  {row.is_admin ? 'Super Admin' : row.role?.name ?? '—'} · {row.email}
                </p>
              </div>
              {!row.is_admin && (
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

      {/* Create / edit — role is assigned right at creation */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Add User' : 'Edit User'}
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
            id="u-name"
            label="Name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            id="u-email"
            type="email"
            label="Email"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Select
            id="u-role"
            label="Role"
            placeholder="Assign a role…"
            options={roleOptions}
            error={errors.role_id?.message}
            {...register('role_id', { required: 'Role is required' })}
          />
          <Input
            id="u-password"
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
        title="Delete User"
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
