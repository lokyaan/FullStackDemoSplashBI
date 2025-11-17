import api from './client'

export const signup = (payload) =>
  api.post('/api/auth/signup', payload)

export const login = async (payload) => {
  const { data } = await api.post('/api/auth/login', payload)
  // store token for future requests
  localStorage.setItem('accessToken', data.accessToken)
  localStorage.setItem('fullName', data.fullName ?? '')
  localStorage.setItem('email', data.email ?? '')
  localStorage.setItem('roles', JSON.stringify(data.roles ?? []))
  return data
}

export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('fullName')
  localStorage.removeItem('email')
  localStorage.removeItem('roles')
}

export const getProfile = async () => {
  const { data } = await api.get('/api/me') // if you added /api/me returning profile
  return data
}
