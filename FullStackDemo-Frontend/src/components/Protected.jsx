import { Navigate, useLocation } from 'react-router-dom'

export default function Protected({ children }) {
  const token = localStorage.getItem('accessToken')
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
