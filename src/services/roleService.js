import api from './api'

const roleService = {
  list: (params) => api.get('/roles', { params }).then((r) => r.data),
  permissions: () => api.get('/permissions').then((r) => r.data),
  create: (payload) => api.post('/roles', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/roles/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/roles/${id}`).then((r) => r.data),
}

export default roleService
