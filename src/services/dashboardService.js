import api from './api'

const dashboardService = {
  stats: () => api.get('/dashboard').then((r) => r.data),
}

export default dashboardService
