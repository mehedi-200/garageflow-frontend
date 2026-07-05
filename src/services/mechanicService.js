import api from './api'

const mechanicService = {
  list: (params) => api.get('/mechanics', { params }).then((r) => r.data),
  create: (payload) => api.post('/mechanics', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/mechanics/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/mechanics/${id}`).then((r) => r.data),
}

export default mechanicService
