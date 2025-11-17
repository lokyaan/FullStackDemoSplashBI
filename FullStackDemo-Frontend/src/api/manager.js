import api from './client'

export function listPendingAdmins() {
  return api.get('/api/manager/pending-admins').then(r => r.data)
}

export function approveAdmin(id) {
  return api.put(`/api/manager/approve/${id}`).then(r => r.data)
}

export function rejectAdmin(id) {
  return api.delete(`/api/manager/reject/${id}`).then(r => r.data)
}
