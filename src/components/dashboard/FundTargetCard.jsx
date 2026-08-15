import { Card } from '../ui/Card.jsx'
import { Badge } from '../ui/Badge.jsx'
import { useT } from '../../i18n/LanguageProvider.jsx'
import { formatIDR } from '../../utils/financeFormulas.js'

export function FundTargetCard({ label, multiplier, targetAmount }) {
  const t = useT()
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{label}</h3>
        <Badge tone="accent">
          {multiplier}
          {t('fundTarget.multMonthly')}
        </Badge>
      </div>
      <p className="amount mt-3 text-2xl font-semibold text-ink md:text-3xl">
        {formatIDR(targetAmount)}
      </p>
    </Card>
  )
}
