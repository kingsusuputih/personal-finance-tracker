import { useMemo, useState } from 'react'
import { Card } from '../ui/Card.jsx'
import { Badge } from '../ui/Badge.jsx'
import { Skeleton } from '../ui/Skeleton.jsx'
import { useT } from '../../i18n/LanguageProvider.jsx'
import { formatIDR } from '../../utils/financeFormulas.js'

const categoryTone = { Needs: 'accent', Lifestyle: 'warning', Investment: 'success' }

export function TransactionTable({ transactions = [], loading = false }) {
  const [sortDir, setSortDir] = useState('desc')
  const t = useT()

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
        <h2 className="text-base font-semibold text-ink">{t('table.title')}</h2>
        <button
          onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
          className="kbd text-[10px] text-ink-3 transition-colors hover:text-accent"
        >
          {sortDir === 'desc' ? t('table.newest') : t('table.oldest')}
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
          <p className="text-sm font-medium text-ink">{t('table.empty.title')}</p>
          <p className="mt-1 text-sm text-ink-3">{t('table.empty.body')}</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-rule sm:hidden">
            {sorted.map((row, i) => (
              <li
                key={`${row.created_at}-${i}`}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={categoryTone[row.category] || 'neutral'}>{row.category}</Badge>
                    <span className="kbd text-[10px] text-ink-3">{row.date}</span>
                  </div>
                  {row.description && (
                    <p className="mt-1 truncate text-sm text-ink-2">{row.description}</p>
                  )}
                </div>
                <span className="amount shrink-0 text-sm font-medium text-ink">
                  {formatIDR(row.amount)}
                </span>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="kbd border-b border-rule text-left text-[10px] text-ink-3">
                  <th className="px-5 py-2 font-medium">{t('table.date')}</th>
                  <th className="px-5 py-2 font-medium">{t('table.category')}</th>
                  <th className="px-5 py-2 font-medium">{t('table.description')}</th>
                  <th className="px-5 py-2 text-right font-medium">{t('table.amount')}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, i) => (
                  <tr
                    key={`${row.created_at}-${i}`}
                    className="border-b border-rule last:border-0 transition-colors hover:bg-paper-2/60"
                  >
                    <td className="kbd whitespace-nowrap px-5 py-3 text-xs text-ink-3">
                      {row.date}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={categoryTone[row.category] || 'neutral'}>
                        {row.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-ink-2">
                      {row.description || <span className="text-ink-3">—</span>}
                    </td>
                    <td className="amount whitespace-nowrap px-5 py-3 text-right font-medium text-ink">
                      {formatIDR(row.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  )
}
