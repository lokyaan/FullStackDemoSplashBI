import { useNavigate } from 'react-router-dom'
import { Button } from './ui'
import { logout } from '../api/auth'

export default function TopBar() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem('fullName')

  return (
    <div className="flex justify-between items-center p-4 bg-white/20 backdrop-blur-lg rounded-xl shadow-md mb-6">
      <h2 className="font-semibold text-gray-800">
        Welcome, {fullName}
      </h2>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => navigate('/change-password')}
          className="rounded-xl border border-slate-400 bg-white/60 hover:bg-white/80"
        >
          Change Password
        </Button>
        <Button
          variant="outline"
          onClick={() => { logout(); navigate('/login') }}
          className="rounded-xl border border-slate-400 bg-white/60 hover:bg-white/80"
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
