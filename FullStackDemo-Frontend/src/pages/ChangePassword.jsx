import { useState } from 'react'
import api from '../api/client'
import { useToast } from '../components/Toast'

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const { push } = useToast()
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      push('New passwords do not match', 'error')
      return
    }
    try {
      setLoading(true)
      await api.put('/api/auth/change-password', form)
      push('Password changed successfully', 'success')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      push(err.response?.data?.message || 'Failed to change password', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl bg-white/40 backdrop-blur-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Change Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Current Password"
          required
          className="rounded-xl border px-3 py-2"
        />
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          required
          className="rounded-xl border px-3 py-2"
        />
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
          required
          className="rounded-xl border px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
