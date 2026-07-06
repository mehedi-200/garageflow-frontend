import api from './api'

const authService = {
  login: (credentials) => api.post('/login', credentials).then((r) => r.data),
  logout: () => api.post('/logout').then((r) => r.data),
  getProfile: () => api.get('/profile').then((r) => r.data),
  updateProfile: (payload) => api.put('/profile', payload).then((r) => r.data),
}

export default authService
