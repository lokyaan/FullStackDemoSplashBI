import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { logout } from '../api/auth'
import { Card, CardBody, Button, Badge, Table } from '../components/ui'
import { useToast } from '../components/Toast'
import TopBar from '../components/TopBar'
export default function CustomerDashboard() {
  const [products, setProducts] = useState([])
  const [requests, setRequests] = useState([])
  const [err, setErr] = useState('')
  const navigate = useNavigate()
  const { push } = useToast()

  const fullName = localStorage.getItem('fullName')

  useEffect(() => {
    (async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/me/requests')
        ])
        setProducts(pRes.data)
        setRequests(rRes.data)
      } catch (e) {
        setErr(e.response?.data?.message || 'Failed to load data')
      }
    })()
  }, [])

  async function request(productId) {
    try {
      const { data } = await api.post('/api/me/requests', { productId })
      setRequests(prev => [data, ...prev])
      push('Request created', 'success')
    } catch (e) {
      push(e.response?.data?.message || 'Request failed', 'error')
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const head = ['ID', 'Product', 'Status', 'DecidedAt']
  const rows = requests.map(r => (
    <tr key={r.id} className="odd:bg-white/40 even:bg-white/20 dark:odd:bg-white/5 dark:even:bg-white/0">
      <td className="px-4 py-3 text-sm">{r.id}</td>
      <td className="px-4 py-3 text-sm">{r.productName}</td>
      <td className="px-4 py-3 text-sm">
        {r.status === 'ACCEPTED' ? <Badge color="green">ACCEPTED</Badge> :
         r.status === 'REJECTED' ? <Badge color="red">REJECTED</Badge> :
         <Badge color="yellow">PENDING</Badge>}
      </td>
      <td className="px-4 py-3 text-sm">{r.decidedAt || '-'}</td>
    </tr>
  ))

  return (
    <div className="relative min-h-dvh p-4 sm:p-6">
      {/* Background Gradient */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 50%, #fbbf24 100%)',
        }}
      />

      {/* Header Bar */}
      <Card className="backdrop-blur-xl border-white/40 bg-white/25 shadow-xl">
        <CardBody className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center justify-between">
          <div>
            {/* Title + Username on same line */}
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Customer Dashboard
              </h2>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                — {fullName || 'User'}
              </span>
            </div>

            {/* Subtext */}
            <p className="text-sm text-slate-700/80 dark:text-slate-300/80">
              Browse products and track your requests
            </p>

            {/* Stats */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/70 dark:bg-white/10 px-3 py-1 border border-white/40">
                Products: <strong>{products.length}</strong>
              </span>
              <span className="rounded-full bg-white/70 dark:bg-white/10 px-3 py-1 border border-white/40">
                Requests: <strong>{requests.length}</strong>
              </span>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="rounded-xl border-white/60 bg-white/60 hover:bg-white/80"
          >
            Logout
          </Button>
        </CardBody>
      </Card>

      {err && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-800">
          {err}
        </div>
      )}

      {/* Products */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Products</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <Card key={p.id} className="border-white/40 bg-white/30 backdrop-blur-xl shadow-lg hover:bg-white/50 transition">
              <CardBody>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 line-clamp-3">{p.description}</p>
                <Button
                  className="mt-4 rounded-xl bg-black/80 text-white hover:bg-black"
                  onClick={() => request(p.id)}
                >
                  Request
                </Button>
              </CardBody>
            </Card>
          ))}

          {!products.length && (
            <Card className="border-white/40 bg-white/30 backdrop-blur-xl">
              <CardBody>
                <p className="text-sm text-slate-700 dark:text-slate-300">No products available.</p>
              </CardBody>
            </Card>
          )}
        </div>
      </section>

      {/* Requests */}
      <section className="mt-8">
        <div className="mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">My Requests</h3>
          <p className="text-xs text-slate-700/80 dark:text-slate-300/80">
            Track status of your product requests in real time.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/40 bg-white/25 backdrop-blur-xl shadow-xl">
          <Table head={head} rows={rows} />
        </div>
      </section>
    </div>
  )
}
