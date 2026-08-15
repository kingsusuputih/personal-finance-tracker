import { useEffect } from 'react'
import { useSpreadsheet } from '../hooks/useSpreadsheet.js'
import { useFinanceCalc } from '../hooks/useFinanceCalc.js'
import { AllocationCard } from '../components/dashboard/AllocationCard.jsx'
import { FundTargetCard } from '../components/dashboard/FundTargetCard.jsx'
import { SpendingChart } from '../components/dashboard/SpendingChart.jsx'
import { Sidebar } from '../components/layout/Sidebar.jsx'
import { Navbar } from '../components/layout/Navbar.jsx'
import { BottomNav } from '../components/layout/BottomNav.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Skeleton } from '../components/ui/Skeleton.jsx'
import { useT } from '../i18n/LanguageProvider.jsx'
import { formatIDR } from '../utils/financeFormulas.js'

export default function DashboardPage() {
  const { ensureSpreadsheet, loadData, provisioning, loading } = useSpreadsheet()
  const calc = useFinanceCalc()
  const t = useT()

  useEffect(() => {
    ensureSpreadsheet().then((id) => {
      if (id) loadData()
    })
  }, [ensureSpreadsheet, loadData])

  const allocationCards = [
    {
      key: 'needs',
      label: 'Needs',
      percent: 50,
      targetAmount: calc.allocations.needs,
      actualAmount: calc.actualSpending.needs,
    },
    {
      key: 'investments',
      label: 'Investments',
      percent: 30,
      targetAmount: calc.allocations.investments,
      actualAmount: calc.actualSpending.investments,
    },
    {
      key: 'lifestyle',
      label: 'Lifestyle',
      percent: 20,
      targetAmount: calc.allocations.lifestyle,
      actualAmount: calc.actualSpending.lifestyle,
    },
  ]

  const chartData = [
    { name: 'Needs', value: calc.actualSpending.needs },
    { name: 'Lifestyle', value: calc.actualSpending.lifestyle },
    { name: 'Investment', value: calc.actualSpending.investments },
  ]

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 md:px-8 md:py-10">
          <header className="mb-8">
            <p className="kbd mb-1 text-[11px] text-ink-3">{calc.currentMonth}</p>
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold">{t('dash.title')}</h1>
          </header>

          {provisioning ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <>
              <section className="mb-8 grid gap-4 sm:grid-cols-2">
                <Card className="p-5">
                  <p className="kbd text-[10px] text-ink-3">{t('dash.monthlyIncome')}</p>
                  <p className="amount mt-2 text-2xl font-semibold text-ink">
                    {formatIDR(calc.monthlyIncome)}
                  </p>
                  {calc.monthlyIncome === 0 && (
                    <p className="mt-1 text-xs text-ink-3">{t('dash.incomeHint')}</p>
                  )}
                </Card>
                <Card className="p-5">
                  <p className="kbd text-[10px] text-ink-3">{t('dash.monthlyExpenses')}</p>
                  <p className="amount mt-2 text-2xl font-semibold text-ink">
                    {formatIDR(calc.totalMonthlyExpenses)}
                  </p>
                </Card>
              </section>

              <section className="mb-8">
                <h2 className="mb-3 text-base font-semibold text-ink">{t('dash.allocation')}</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {allocationCards.map((c) => (
                    <AllocationCard key={c.key} {...c} />
                  ))}
                </div>
              </section>

              <section className="mb-8">
                <h2 className="mb-3 text-base font-semibold text-ink">{t('dash.fundTargets')}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FundTargetCard
                    label={t('dash.emergency')}
                    multiplier={6}
                    targetAmount={calc.fundTargets.emergencyFund}
                  />
                  <FundTargetCard
                    label={t('dash.retirement')}
                    multiplier={300}
                    targetAmount={calc.fundTargets.retirementFund}
                  />
                </div>
              </section>

              <SpendingChart data={chartData} loading={loading} />
            </>
          )}
        </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
