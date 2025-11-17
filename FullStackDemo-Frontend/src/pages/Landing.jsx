import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { LogIn, UserPlus, ShoppingCart, ShieldCheck, ArrowRight, GitBranch } from 'lucide-react'

export default function Landing() {
  const token = localStorage.getItem('accessToken')

  return (
    // Full-page purple background with no border
    <div className="relative min-h-dvh text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Full-bleed purple gradient */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg,#9333ea 0%,#ec4899 50%,#f472b6 100%)',
        }}
      />

      {/* Top nav */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/30 bg-white/20 dark:bg-black/20 border-b border-white/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-white/80 dark:bg-black/60 grid place-items-center shadow">
              <GitBranch className="size-5" />
            </div>
            <span className="font-semibold tracking-tight text-lg">Splash Business Intelligence</span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:opacity-90">Features</a>
            <a href="#how" className="hover:opacity-90">How it works</a>
            <a href="#roles" className="hover:opacity-90">Roles</a>
          </nav>

          <div className="flex items-center gap-2">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm transition hover:bg-white/90 dark:bg-black/30 dark:hover:bg-black/50"
                >
                  <LogIn className="size-4" /> Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-black/80 text-white px-3 py-2 text-sm font-semibold shadow-sm transition hover:bg-black dark:bg-white/90 dark:text-black"
                >
                  <UserPlus className="size-4" /> Signup
                </Link>
              </>
            ) : (
              <Link
                to="/customer"
                className="inline-flex items-center gap-2 rounded-xl bg-black/80 text-white px-3 py-2 text-sm font-semibold shadow-sm transition hover:bg-black dark:bg-white/90 dark:text-black"
              >
                Dashboard <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="pt-16 sm:pt-24">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Request ➜ Review ➜ Approve — all in one place.
              </h1>
              <p className="mt-4 text-base sm:text-lg/7 max-w-prose">
                Welcome! This app lets <span className="font-semibold">customers</span> request products and
                <span className="font-semibold"> admins</span> approve or reject them with a clean workflow.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {!token ? (
                  <>
                    <Link to="/signup" className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-5 py-3 font-semibold shadow transition hover:bg-white">
                      Get started <ArrowRight className="size-4" />
                    </Link>
                    <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/30 px-5 py-3 font-semibold backdrop-blur transition hover:bg-white/50">
                      I have an account
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/customer" className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-5 py-3 font-semibold shadow transition hover:bg-white">
                      Customer space
                    </Link>
                    <Link to="/admin" className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/30 px-5 py-3 font-semibold backdrop-blur transition hover:bg-white/50">
                      Admin console
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white/25 backdrop-blur-xl border border-white/40 shadow-xl p-6" id="features">
                <div className="grid grid-cols-2 gap-4">
                  <FeatureCard
                    icon={<ShoppingCart className="size-6" />}
                    title="Product Requests"
                    desc="Create and track requests with statuses and notes."
                  />
                  <FeatureCard
                    icon={<ShieldCheck className="size-6" />}
                    title="Approvals"
                    desc="Admins approve/reject with context and audit trail."
                  />
                  <FeatureCard
                    icon={<LogIn className="size-6" />}
                    title="Auth"
                    desc="JWT-secured routes for customer and admin roles."
                  />
                  <FeatureCard
                    icon={<UserPlus className="size-6" />}
                    title="Onboarding"
                    desc="Simple signup & instant access to your space."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="py-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Choose your role</h2>
          <p className="mt-2 opacity-90">Jump right into the view that fits what you want to do.</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <RoleCard
              title="Customer"
              bullets={[
                'Create new product requests',
                'Attach details & notes',
                'Track approval status in real-time',
              ]}
              cta={<Link to="/customer" className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 font-semibold shadow hover:bg-white">Open customer</Link>}
            />
            <RoleCard
              title="Admin"
              bullets={[
                'Review incoming requests',
                'Approve or reject with reasons',
                'Maintain a clean audit trail',
              ]}
              cta={<Link to="/admin" className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/30 px-4 py-2 font-semibold backdrop-blur hover:bg-white/50">Open admin</Link>}
            />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="pb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How it works</h2>
          <ol className="mt-4 grid sm:grid-cols-3 gap-4 list-decimal list-inside">
            <li className="rounded-2xl bg-white/25 p-4 backdrop-blur border border-white/40 shadow">
              Sign up or log in. Your role decides your home screen.
            </li>
            <li className="rounded-2xl bg-white/25 p-4 backdrop-blur border border-white/40 shadow">
              Customers raise requests; admins get instant notifications.
            </li>
            <li className="rounded-2xl bg-white/25 p-4 backdrop-blur border border-white/40 shadow">
              Admins approve/reject; customers track status live.
            </li>
          </ol>
        </section>
      </main>

      <footer className="border-t border-white/30 bg-white/10 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-sm opacity-90">
          Built with Vite, React & Tailwind. Dark-mode friendly ✦
        </div>
      </footer>
    </div>
  )
}

/* Subcomponents */
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/30 p-4 shadow backdrop-blur hover:bg-white/50 transition">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white/80 dark:bg-black/40 p-2 shadow">{icon}</div>
        <div>
          <p className="font-semibold leading-tight">{title}</p>
          <p className="text-sm opacity-90 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  )
}
FeatureCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
}

function RoleCard({ title, bullets, cta }) {
  return (
    <div className="rounded-3xl border border-white/40 bg-white/25 p-6 shadow backdrop-blur">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm marker:text-black/60">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 size-1.5 rounded-full bg-black/70 dark:bg-white/80" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4">{cta}</div>
    </div>
  )
}
RoleCard.propTypes = {
  title: PropTypes.string.isRequired,
  bullets: PropTypes.arrayOf(PropTypes.string).isRequired,
  cta: PropTypes.node.isRequired,
}
