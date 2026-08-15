import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { LoginButton } from '../components/auth/LoginButton.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'

export default function LoginPage() {
  const { isAuthed } = useAuth()

  if (isAuthed) return <Navigate to="/dashboard" replace />

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[8px] bg-accent font-display text-xl font-bold text-accent-ink">
            F
          </div>
          <h1 className="font-bold leading-tight text-[clamp(1.75rem,6vw,2.5rem)]">
            Finance Tracker
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-3">
            Your private, zero-cost finance dashboard — data lives in your own Google Drive.
          </p>
        </div>

        <Card className="p-6">
          <LoginButton />
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge>drive.file only</Badge>
            <Badge>in-memory token</Badge>
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-ink-3">
            Sign in to provision your spreadsheet and start tracking income and expenses.
          </p>
        </Card>

        <p className="kbd mt-6 text-center text-[10px] text-ink-3">
          Finance Tracker · 50/30/20 · v1.0
        </p>
      </div>
    </main>
  )
}
