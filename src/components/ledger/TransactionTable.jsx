import { useMemo, useState } from 'react'
import { Card } from '../ui/Card.jsx'
import { Badge } from '../ui/Badge.jsx'
import { Skeleton } from '../ui/Skeleton.jsx'
import { formatIDR } from '../../utils/financeFormulas.js'

const categoryTone = { Needs: 'accent', Lifestyle: 'warning', Investment: 'success' }

export function TransactionTable({ transactions = [], loading = false }) {
  const [sortDir, setSortDir] = useState('desc')

  const sorted = useMemo(() => {
    return [...transactions]
      .sort((a, b) =>
        sortDir === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
      )
      .slice(0, 30)
  }, [transactions, sortDir])

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-rule px-5 py-4">
        <h2 className="text-base font-semibold text-ink">Recent transactions</h2>
        <button
          onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
          className="kbd text-[10px] text-ink-3 transition-colors hover:text-accent"
        >
          {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-medium text-ink">No transactions yet</p>
          <p className="mt-1 text-sm text-ink-3">Record your first expense above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="kbd border-b border-rule text-left text-[10px] text-ink-3">
                <th className="px-5 py-2 font-medium">Date</th>
                <th className="px-5 py-2 font-medium">Category</th>
                <th className="px-5 py-2 font-medium">Description</th>
                <th className="px-5 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t, i) => (
                <tr
                  key={`${t.created_at}-${i}`}
                  className="border-b border-rule last:border-0 transition-colors hover:bg-paper-2/60"
                >
                  <td className="kbd whitespace-nowrap px-5 py-3 text-xs text-ink-3">{t.date}</td>
                  <td className="px-5 py-3">
                    <Badge tone={categoryTone[t.category] || 'neutral'}>{t.category}</Badge>
                  </td>
                  <td className="px-5 py-3 text-ink-2">
                    {t.description || <span className="text-ink-3">—</span>}
                  </td>
                  <td className="amount whitespace-nowrap px-5 py-3 text-right font-medium text-ink">
                    {formatIDR(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
