import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { login } from '../api/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  async function onSubmit(e) {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
        const data = await login({ email, password })
        const roles = data.roles || []

    // store
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('email', data.email)
        localStorage.setItem('fullName', data.fullName)
        localStorage.setItem('roles', JSON.stringify(roles))

    // route
        if (roles.includes('MANAGER')) {
            navigate('/manager', { replace: true })        // 👈 route managers here
            } else if (roles.includes('ADMIN')) {
            navigate('/admin', { replace: true })
            } else {
            navigate('/customer', { replace: true })
        }
    } catch (e) {
        const msg = e?.response?.data?.message || 'Login failed'
        if (/awaiting manager approval/i.test(msg)) {
        setErr('Your admin account is awaiting manager approval. Please try again later.')
        } else if (/invalid credentials/i.test(msg)) {
        setErr('Invalid email or password.')
        } else {
        setErr(msg)
        }
    } finally {
        setLoading(false)
    }
    }


  return (
    <div className="relative min-h-dvh grid place-items-center p-4">
      {/* Full-bleed page background (indigo ➜ fuchsia ➜ amber) */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 50%, #fbbf24 100%)',
        }}
      />

      <div className="w-full max-w-md rounded-3xl bg-white/25 backdrop-blur-xl border border-white/40 shadow-xl p-6">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="opacity-80 mt-1">Sign in to continue to your dashboard.</p>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-800">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <input
              className="rounded-xl border px-3 py-2 outline-none bg-white/90 focus:ring-2 focus:ring-black/40"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute inset-y-0 right-2 my-auto rounded-lg px-2 text-sm opacity-70 hover:opacity-100"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex items-center justify-center rounded-2xl bg-black/80 text-white px-4 py-2 font-semibold shadow transition hover:bg-black disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm opacity-80">
          Don’t have an account?{' '}
          <Link to="/signup" className="underline font-medium">
            Create one
          </Link>
        </p>

        {from !== '/' && (
          <p className="mt-2 text-xs opacity-70">
            You were redirected from <code>{from}</code>
          </p>
        )}
      </div>
    </div>
  )

  
}
