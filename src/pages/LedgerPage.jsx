import { useEffect } from 'react'
import { useSpreadsheet } from '../hooks/useSpreadsheet.js'
import { IncomeForm } from '../components/ledger/IncomeForm.jsx'
import { ExpenseForm } from '../components/ledger/ExpenseForm.jsx'
import { TransactionTable } from '../components/ledger/TransactionTable.jsx'
import { Sidebar } from '../components/layout/Sidebar.jsx'
import { Navbar } from '../components/layout/Navbar.jsx'
import { BottomNav } from '../components/layout/BottomNav.jsx'
import { Skeleton } from '../components/ui/Skeleton.jsx'
import { useT } from '../i18n/LanguageProvider.jsx'

export default function LedgerPage() {
  const { ensureSpreadsheet, loadData, provisioning, loading, transactions } = useSpreadsheet()
  const t = useT()

  useEffect(() => {
    ensureSpreadsheet().then((id) => {
      if (id) loadData()
    })
  }, [ensureSpreadsheet, loadData])

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <Navbar />
      <BottomNav />
      <main className="min-w-0 flex-1 md:pl-64">
        <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 md:px-8 md:py-10">
          <header className="mb-8">
            <p className="kbd mb-1 text-[11px] text-ink-3">{t('ledger.kicker')}</p>
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold">{t('ledger.title')}</h1>
            <p className="mt-2 text-sm text-ink-3">{t('ledger.subtitle')}</p>
          </header>

          {provisioning ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <>
              <section className="mb-8 grid gap-4 lg:grid-cols-2">
                <IncomeForm />
                <ExpenseForm />
              </section>
              <TransactionTable transactions={transactions} loading={loading} />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
