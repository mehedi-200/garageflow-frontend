import api from './api'

const invoiceService = {
  list: (params) => api.get('/invoices', { params }).then((r) => r.data),
  get: (id) => api.get(`/invoices/${id}`).then((r) => r.data),
  updateLabor: (id, labor_cost) =>
    api.put(`/invoices/${id}`, { labor_cost }).then((r) => r.data),
  pay: (id) => api.patch(`/invoices/${id}/pay`).then((r) => r.data),
}

export default invoiceService
