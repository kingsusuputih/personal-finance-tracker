import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card } from '../ui/Card.jsx'
import { Skeleton } from '../ui/Skeleton.jsx'
import { formatIDR } from '../../utils/financeFormulas.js'

const COLORS = {
  Needs: 'var(--color-accent)',
  Lifestyle: 'var(--color-warning)',
  Investment: 'var(--color-success)',
}

export function SpendingChart({ data = [], loading = false }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (loading) {
    return (
      <Card className="p-5">
        <Skeleton className="mb-4 h-5 w-44" />
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <Skeleton className="h-48 w-48 shrink-0 rounded-full" />
          <div className="w-full space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-ink">Spending by category</h3>
      {total === 0 ? (
        <p className="mt-4 text-sm text-ink-3">No expenses recorded this month yet.</p>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="90%"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((d) => (
                    <Cell key={d.name} fill={COLORS[d.name]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatIDR(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="w-full space-y-2">
            {data.map((d) => (
              <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2 text-ink-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: COLORS[d.name] }}
                  />
                  {d.name}
                </span>
                <span className="amount font-medium text-ink">{formatIDR(d.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
