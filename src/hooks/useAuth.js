import { useNavigate } from 'react-router-dom'

const TOKEN_KEY = 'token'

/*
 * Auth stub for the app shell — replaced with real Sanctum
 * auth (authService + /api/login) in Part 1C.
 */
export default function useAuth() {
  const navigate = useNavigate()

  function login(token) {
    localStorage.setItem(TOKEN_KEY, token)
    navigate('/')
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    navigate('/login')
  }

  return {
    isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
    login,
    logout,
  }
}
