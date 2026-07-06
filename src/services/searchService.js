import api from './api'

const searchService = {
  search: (q) => api.get('/search', { params: { q } }).then((r) => r.data),
}

export default searchService
