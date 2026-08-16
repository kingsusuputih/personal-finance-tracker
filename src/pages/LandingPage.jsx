import { Link } from 'react-router-dom'
import { useT } from '../i18n/LanguageProvider.jsx'
import { LangToggle } from '../components/ui/LangToggle.jsx'
import { Card } from '../components/ui/Card.jsx'

const featureKeys = [
  { title: 'landing.featAllocTitle', body: 'landing.featAllocBody' },
  { title: 'landing.featFundsTitle', body: 'landing.featFundsBody' },
  { title: 'landing.featChartTitle', body: 'landing.featChartBody' },
]

const steps = [
  { title: 'landing.howStep1Title', body: 'landing.howStep1Body' },
  { title: 'landing.howStep2Title', body: 'landing.howStep2Body' },
  { title: 'landing.howStep3Title', body: 'landing.howStep3Body' },
]

export default function LandingPage() {
  const t = useT()

  return (
    <main className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] bg-accent font-display text-xs font-bold text-accent-ink">
              F
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-ink">
              {t('app.name')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link
              to="/login"
              className="rounded-[var(--radius-btn)] bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
            >
              {t('landing.signIn')}
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 pb-16 pt-20 text-center md:px-8 md:pt-28">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-[10px] bg-accent font-display text-2xl font-bold text-accent-ink">
            F
          </div>
          <h1 className="text-[clamp(2.25rem,7vw,3.75rem)] font-bold leading-tight">
            {t('app.name')}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-3">
            {t('login.tagline')}
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-[var(--radius-btn)] bg-accent px-8 text-base font-medium text-accent-ink transition-colors hover:bg-accent-strong"
          >
            {t('landing.signIn')}
          </Link>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold">
            {t('landing.featuresTitle')}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {featureKeys.map((f) => (
              <Card key={f.title} className="p-6">
                <h3 className="mb-2 font-semibold text-ink-2">{t(f.title)}</h3>
                <p className="text-sm leading-relaxed text-ink-3">{t(f.body)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-rule bg-paper-2 px-4 py-16 md:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold">
            {t('landing.howTitle')}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="p-2">
                <p className="kbd mb-3 text-[11px] text-accent">0{i + 1}</p>
                <h3 className="mb-2 font-semibold text-ink-2">{t(s.title)}</h3>
                <p className="text-sm leading-relaxed text-ink-3">{t(s.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold">
            {t('landing.privacyTitle')}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-3">{t('landing.privacyBody')}</p>
        </div>
      </section>

      <section className="pb-20 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold">
            {t('landing.ctaTitle')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-3">{t('login.note')}</p>
          <Link
            to="/login"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-[var(--radius-btn)] bg-accent px-8 text-base font-medium text-accent-ink transition-colors hover:bg-accent-strong"
          >
            {t('landing.signIn')}
          </Link>
        </div>
      </section>

      <footer className="border-t border-rule py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 md:px-8">
          <p className="kbd text-center text-[10px] text-ink-3">{t('login.footer')}</p>
          <div className="flex items-center gap-3 text-xs text-ink-3">
            <Link to="/privacy" className="transition-colors hover:text-accent">
              {t('legal.privacy')}
            </Link>
            <span>·</span>
            <Link to="/terms" className="transition-colors hover:text-accent">
              {t('legal.terms')}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}