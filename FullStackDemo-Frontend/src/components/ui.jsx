export function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function CardBody({ className = "", children }) {
  return <div className={`p-5 ${className}`}>{children}</div>
}

export function CardHeader({ title, subtitle }) {
  return (
    <div className="px-5 pt-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

export function Button({ variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
  const styles = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-black dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus:ring-white",
    outline: "border border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800",
    ghost: "hover:bg-gray-100 dark:hover:bg-neutral-800",
    danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-600",
  }
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />
}

export function Badge({ color = "gray", children }) {
  const map = {
    gray: "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200",
    green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[color]}`}>{children}</span>
}

export function Table({ head, rows }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
        <thead className="bg-gray-50 dark:bg-neutral-900">
          <tr>{head.map((h, i) => (
            <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">{h}</th>
          ))}</tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
          {rows}
        </tbody>
      </table>
    </div>
  )
}
