import api from './api'

const serviceJobService = {
  list: (params) => api.get('/service-jobs', { params }).then((r) => r.data),
  get: (id) => api.get(`/service-jobs/${id}`).then((r) => r.data),
  create: (payload) => api.post('/service-jobs', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/service-jobs/${id}`, payload).then((r) => r.data),
  changeStatus: (id, status) =>
    api.patch(`/service-jobs/${id}/status`, { status }).then((r) => r.data),
  addItem: (id, payload) => api.post(`/service-jobs/${id}/items`, payload).then((r) => r.data),
  removeItem: (id, itemId) =>
    api.delete(`/service-jobs/${id}/items/${itemId}`).then((r) => r.data),
}

export const SERVICE_TYPES = [
  'Engine',
  'Brakes',
  'Oil Change',
  'Electrical',
  'AC',
  'Bodywork',
  'General Service',
  'Other',
]

export const JOB_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const NEXT_STATUS = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: 'delivered',
}

export default serviceJobService
