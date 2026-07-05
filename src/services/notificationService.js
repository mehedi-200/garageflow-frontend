import api from './api'

const notificationService = {
  list: (params) => api.get('/notifications', { params }).then((r) => r.data),
  unreadCount: () => api.get('/notifications/unread-count').then((r) => r.data),
  markAllRead: () => api.patch('/notifications/read-all').then((r) => r.data),
}

export default notificationService
