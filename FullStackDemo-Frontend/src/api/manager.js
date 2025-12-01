import api from './client'

export function listPendingAdmins() {
  return api.get('/manager/pending-admins').then(r => r.data)
}

export function approveAdmin(id) {
  return api.put(`/manager/approve/${id}`).then(r => r.data)
}

export function rejectAdmin(id) {
  return api.delete(`/manager/reject/${id}`).then(r => r.data)
}
