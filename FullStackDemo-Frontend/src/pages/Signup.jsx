import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup, login } from '../api/auth'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('CUSTOMER') // ✅ define role
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      // Consider sending `requestedRole` and letting server decide
      await signup({ fullName, email, password, role })
      await login({ email, password }) // auto-login
      navigate('/customer', { replace: true }) // or route by returned roles on login page
    } catch (e) {
      setErr(e?.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-dvh grid place-items-center p-4">
      {/* Full-bleed page background (emerald ➜ cyan ➜ indigo) */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #6366f1 100%)' }}
      />

      <div className="w-full max-w-md rounded-3xl bg-white/25 backdrop-blur-xl border border-white/40 shadow-xl p-6">
        <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
        <p className="opacity-80 mt-1">Join and start requesting products in minutes.</p>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-800">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Role</span>
            <select
              className="rounded-xl border px-3 py-2 bg-white/90 focus:ring-2 focus:ring-black/40"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin (requires manager approval)</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Full name</span>
            <input
              className="rounded-xl border px-3 py-2 outline-none bg-white/90 focus:ring-2 focus:ring-black/40"
              placeholder="Jane Doe"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <input
              className="rounded-xl border px-3 py-2 outline-none bg-white/90 focus:ring-2 focus:ring-black/40"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Password</span>
            <div className="relative">
              <input
                className="w-full rounded-xl border px-3 py-2 pr-12 outline-none bg-white/90 focus:ring-2 focus:ring-black/40"
                placeholder="••••••••"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto rounded-lg px-2 text-sm opacity-70 hover:opacity-100"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            <span className="text-xs opacity-70">Use at least 6 characters.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex items-center justify-center rounded-2xl bg-black/80 text-white px-4 py-2 font-semibold shadow transition hover:bg-black disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm opacity-80">
          Already have an account? <Link to="/login" className="underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  )
}
