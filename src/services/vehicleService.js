import api from './api'

const vehicleService = {
  list: (params) => api.get('/vehicles', { params }).then((r) => r.data),
  get: (id) => api.get(`/vehicles/${id}`).then((r) => r.data),
  create: (payload) => api.post('/vehicles', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/vehicles/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/vehicles/${id}`).then((r) => r.data),
}

export default vehicleService
