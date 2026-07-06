import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export default function useAuth() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null')

  async function login(credentials) {
    const response = await authService.login(credentials)
    localStorage.setItem(TOKEN_KEY, response.data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
    navigate('/')
  }

  async function logout() {
    try {
      await authService.logout()
    } catch {
      // Token may already be invalid — clear the session regardless.
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    navigate('/login')
  }

  function refreshUser(updated) {
    localStorage.setItem(USER_KEY, JSON.stringify(updated))
  }

  /** Super admins (is_admin) bypass every permission check. */
  function can(permission) {
    if (user?.is_admin) return true
    return user?.permissions?.includes(permission) ?? false
  }

  return {
    user,
    // A session is only valid with BOTH a token and a stored user —
    // stale pre-auth sessions (token without user) force a re-login.
    isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)) && user !== null,
    isSuperAdmin: Boolean(user?.is_admin),
    can,
    login,
    logout,
    refreshUser,
  }
}
