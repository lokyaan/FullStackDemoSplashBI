import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { logout as doLogout } from '../api/auth'
import api from '../api/client'    

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || '')
  const [email, setEmail] = useState(localStorage.getItem('email') || '')
  const [fullName, setFullName] = useState(localStorage.getItem('fullName') || '')
  const [roles, setRoles] = useState(JSON.parse(localStorage.getItem('roles') || '[]'))

  // reflect localStorage changes from login helper
  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem('accessToken') || '')
      setEmail(localStorage.getItem('email') || '')
      setFullName(localStorage.getItem('fullName') || '')
      setRoles(JSON.parse(localStorage.getItem('roles') || '[]'))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isAdmin = roles.includes('ADMIN')
  const isAuthed = !!token

  function logout() {
    doLogout()
    setToken(''); setEmail(''); setFullName(''); setRoles([])
  }

  const value = useMemo(() => ({ token, email, fullName, roles, isAdmin, isAuthed, logout }), [token, email, fullName, roles, isAdmin, isAuthed])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
