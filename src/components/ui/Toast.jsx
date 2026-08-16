import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useT } from '../../i18n/LanguageProvider.jsx'

const ToastContext = createContext(null)
let nextId = 0

const toneStyles = {
  success: 'border-l-success',
  error: 'border-l-danger',
  info: 'border-l-accent',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})
  const t = useT()

  const toneLabels = {
    success: t('toast.saved'),
    error: t('toast.error'),
    info: t('toast.note'),
  }

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback(
    (message, tone) => {
      const id = ++nextId
      setToasts((prev) => [...prev, { id, message, tone }])
      timers.current[id] = setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  const toast = useMemo(
    () => ({
      success: (m) => push(m, 'success'),
      error: (m) => push(m, 'error'),
      info: (m) => push(m, 'info'),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`flex items-start gap-2 rounded-card border border-rule-2 border-l-4 bg-paper px-4 py-3 text-left text-sm text-ink-2 shadow-lg transition-[transform,opacity] duration-(--dur-base) ease-out hover:-translate-y-px ${toneStyles[t.tone]}`}
          >
            <span className="kbd mt-0.5 text-[10px] text-ink-3">{toneLabels[t.tone]}</span>
            <span className="flex-1">{t.message}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
