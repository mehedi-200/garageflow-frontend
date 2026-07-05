import { useForm } from 'react-hook-form'
import { Wrench } from 'lucide-react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  function onSubmit() {
    // TODO Part 1C: call authService.login() against /api/login (Sanctum).
    login('demo-token')
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-on-accent">
            <Wrench className="h-7 w-7" />
          </span>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-ink">GarageFlow</h1>
            <p className="mt-1 text-sm text-subtle">Sign in to your workspace</p>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="you@garage.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />
            <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 w-full">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
