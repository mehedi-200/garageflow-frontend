import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import StatusChip from '../components/ui/StatusChip'
import authService from '../services/authService'
import useAuth from '../hooks/useAuth'

export default function Profile() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()
  const [feedback, setFeedback] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
  })
  const profile = data?.data

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ values: profile ? { name: profile.name, email: profile.email } : undefined })

  const mutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (response) => {
      refreshUser(response.data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      reset((values) => ({ ...values, current_password: '', password: '', password_confirmation: '' }))
      setFeedback({ type: 'success', message: response.message })
    },
    onError: (error) => {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message ?? 'Update failed. Please try again.',
      })
    },
  })

  function onSubmit(values) {
    setFeedback(null)
    mutation.mutate(values)
  }

  if (isLoading) {
    return (
      <Page title="Profile" back>
        <Spinner />
      </Page>
    )
  }

  return (
    <Page title="Profile" back>
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <Card className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xl font-bold text-accent">
            {profile?.name?.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-ink">{profile?.name}</p>
            <p className="truncate text-sm text-subtle">{profile?.email}</p>
          </div>
          <StatusChip
            status={profile?.role === 'admin' ? 'delivered' : 'in_progress'}
            className="ml-auto capitalize"
          />
        </Card>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {feedback && (
              <p
                className={
                  feedback.type === 'success'
                    ? 'rounded-xl border border-success/40 bg-success/10 px-3.5 py-2.5 text-sm text-success'
                    : 'rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger'
                }
              >
                {feedback.message}
              </p>
            )}

            <Input
              id="name"
              label="Name"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              id="email"
              type="email"
              label="Email"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />

            <p className="mt-2 border-t border-edge pt-4 text-sm font-semibold text-subtle">
              Change password (optional)
            </p>
            <Input
              id="current_password"
              type="password"
              label="Current password"
              error={errors.current_password?.message}
              {...register('current_password')}
            />
            <Input
              id="password"
              type="password"
              label="New password"
              error={errors.password?.message}
              {...register('password', {
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
            />
            <Input
              id="password_confirmation"
              type="password"
              label="Confirm new password"
              {...register('password_confirmation')}
            />

            <Button type="submit" disabled={isSubmitting || mutation.isPending} className="mt-1">
              {mutation.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </Card>
      </div>
    </Page>
  )
}
