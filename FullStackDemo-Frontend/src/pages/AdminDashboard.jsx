import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { logout } from '../api/auth'
import { Card, CardBody, Button, Badge, Table } from '../components/ui'
import { useToast } from '../components/Toast'
import TopBar from '../components/TopBar'

export default function AdminDashboard() {
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState('PENDING')
  const [summary, setSummary] = useState({ ACCEPTED: 0, PENDING: 0, REJECTED: 0 })
  const [err, setErr] = useState('')
  const [ages, setAges] = useState({})
  const navigate = useNavigate()
  const { push } = useToast()

  // Load all counts for this admin
  useEffect(() => {
    async function loadAllCounts() {
      try {
        const [pending, accepted, rejected] = await Promise.all([
          api.get(`/api/admin/requests?status=PENDING`),
          api.get(`/api/admin/requests?status=ACCEPTED`),
          api.get(`/api/admin/requests?status=REJECTED`)
        ])
        setSummary({
          PENDING: pending.data.length,
          ACCEPTED: accepted.data.length,
          REJECTED: rejected.data.length
        })
      } catch (e) {
        console.error('Failed to load counts:', e)
      }
    }
    loadAllCounts()
  }, [])

  // Load requests for current filter + fetch ages
  useEffect(() => {
    async function loadRequests() {
      try {
        const { data } = await api.get(`/api/admin/requests?status=${status}`)
        setRequests(data)

        // build age map keyed by request ID to avoid collisions
        const agePairs = await Promise.all(
          data.map(async (req) => {
            if (!req.customerName) return [req.id, -1]
            try {
              const res = await api.get('/api/proxy/agify', { params: { name: req.customerName } })
              const ageVal = res?.data?.age
              return [req.id, ageVal != null ? ageVal : -1]
            } catch {
              return [req.id, -1]
            }
          })
        )
        const newAges = Object.fromEntries(agePairs)
        setAges(newAges)
      } catch (e) {
        setErr(e.response?.data?.message || 'Failed to load requests')
      }
    }
    loadRequests()
  }, [status])

  async function decide(id, decision) {
    try {
      const { data } = await api.put(`/api/admin/requests/${id}/decision`, { decision, note: '' })
      setRequests((prev) => prev.map((r) => (r.id === id ? data : r)))
      push(
        decision === 'ACCEPTED' ? 'Request approved' : 'Request rejected',
        decision === 'ACCEPTED' ? 'success' : 'error'
      )

      // refresh counts after decision
      const [pending, accepted, rejected] = await Promise.all([
        api.get(`/api/admin/requests?status=PENDING`),
        api.get(`/api/admin/requests?status=ACCEPTED`),
        api.get(`/api/admin/requests?status=REJECTED`)
      ])
      setSummary({
        PENDING: pending.data.length,
        ACCEPTED: accepted.data.length,
        REJECTED: rejected.data.length
      })
    } catch (e) {
      push(e.response?.data?.message || 'Action failed', 'error')
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const head = ['ID', 'Customer', 'Product', 'Status', 'RequestedAt', 'DecidedAt', 'Age', 'Actions']

  const rows = requests.map((r) => (
    <tr key={r.id} className="odd:bg-white/40 even:bg-white/20 dark:odd:bg-white/5 dark:even:bg-white/0">
      {/* ID */}
      <td className="px-4 py-3 text-sm">{r.id}</td>

      {/* Customer */}
      <td className="px-4 py-3 text-sm">
        <div className="flex flex-col">
          <span className="font-medium text-gray-800 dark:text-gray-200">{r.customerName || '—'}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">{r.customerEmail || ''}</span>
        </div>
      </td>

      {/* Product */}
      <td className="px-4 py-3 text-sm">{r.productName}</td>

      {/* Status */}
      <td className="px-4 py-3 text-sm">
        {r.status === 'ACCEPTED' ? (
          <Badge color="green">ACCEPTED</Badge>
        ) : r.status === 'REJECTED' ? (
          <Badge color="red">REJECTED</Badge>
        ) : (
          <Badge color="yellow">PENDING</Badge>
        )}
      </td>

      {/* RequestedAt */}
      <td className="px-4 py-3 text-sm">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>

      {/* DecidedAt */}
      <td className="px-4 py-3 text-sm">{r.decidedAt ? new Date(r.decidedAt).toLocaleString() : '-'}</td>

      {/* Age (from Agify proxy) */}
      <td className="px-4 py-3 text-sm">{ages[r.id] ?? -1}</td>

      {/* Actions */}
      <td className="px-4 py-3 text-sm">
        {r.status === 'PENDING' ? (
          <div className="flex flex-wrap gap-2">
            <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700" onClick={() => decide(r.id, 'ACCEPTED')}>
              Accept
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-red-300 hover:bg-red-50"
              onClick={() => decide(r.id, 'REJECTED')}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-xs text-slate-600 dark:text-slate-300">—</span>
        )}
      </td>
    </tr>
  ))

  return (
    <div className="relative min-h-dvh p-4 sm:p-6">
      {/* Background Gradient */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #6366f1 100%)',
        }}
      />

      {/* Shared TopBar for title + buttons */}
      <TopBar role="Admin" />

      {/* Overview + filter */}
      <Card className="backdrop-blur-xl border-white/40 bg-white/25 shadow-xl">
        <CardBody>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Overview</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-green-500/20 text-green-900 dark:text-green-300 px-4 py-1 border border-green-400/40">
              Accepted: <strong>{summary.ACCEPTED}</strong>
            </span>
            <span className="rounded-full bg-yellow-500/20 text-yellow-900 dark:text-yellow-300 px-4 py-1 border border-yellow-400/40">
              Pending: <strong>{summary.PENDING}</strong>
            </span>
            <span className="rounded-full bg-red-500/20 text-red-900 dark:text-red-300 px-4 py-1 border border-red-400/40">
              Rejected: <strong>{summary.REJECTED}</strong>
            </span>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="ml-auto rounded-xl border border-white/60 bg-white/70 px-3 py-1.5 text-sm shadow-sm focus:outline-none"
            >
              <option>PENDING</option>
              <option>ACCEPTED</option>
              <option>REJECTED</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Error message */}
      {err && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-800">{err}</div>
      )}

      {/* Requests table */}
      <section className="mt-6">
        {requests.length === 0 ? (
          <p className="text-white/90 text-center py-6">No {status.toLowerCase()} requests</p>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-white/40 bg-white/25 backdrop-blur-xl shadow-xl">
            <Table head={head} rows={rows} />
          </div>
        )}
      </section>
    </div>
  )
}
