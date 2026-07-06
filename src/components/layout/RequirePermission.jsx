import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

/* Route guard — super admins pass everything (CLAUDE.md / RBAC). */
export default function RequirePermission({ permission }) {
  const { can } = useAuth()

  if (!can(permission)) return <Navigate to="/" replace />
  return <Outlet />
}
