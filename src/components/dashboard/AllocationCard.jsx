import { Card } from '../ui/Card.jsx'
import { Badge } from '../ui/Badge.jsx'
import { useT } from '../../i18n/LanguageProvider.jsx'
import { formatIDR } from '../../utils/financeFormulas.js'

export function AllocationCard({ label, percent, targetAmount, actualAmount }) {
  const t = useT()
  const over = actualAmount > targetAmount
  const ratio = targetAmount > 0 ? Math.min(actualAmount / targetAmount, 1) : 0
  const width = `${ratio * 100}%`

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{label}</h3>
        <Badge tone={over ? 'danger' : 'success'}>{over ? t('allocation.over') : t('allocation.onTrack')}</Badge>
      </div>
      <p className="kbd mt-1 text-[10px] text-ink-3">
        {percent}% {t('allocation.percentOf')}
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="kbd text-[10px] text-ink-3">{t('allocation.target')}</p>
          <p className="amount mt-1 text-lg font-semibold text-ink">{formatIDR(targetAmount)}</p>
        </div>
        <div className="text-right">
          <p className="kbd text-[10px] text-ink-3">{t('allocation.spent')}</p>
          <p
            className={`amount mt-1 text-lg font-semibold ${
              over ? 'text-danger' : 'text-success'
            }`}
          >
            {formatIDR(actualAmount)}
          </p>
        </div>
      </div>

      <div
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper-3"
        role="progressbar"
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('allocation.used', { label })}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-out)] ${
            over ? 'bg-danger' : 'bg-success'
          }`}
          style={{ width }}
        />
      </div>
    </Card>
  )
}
