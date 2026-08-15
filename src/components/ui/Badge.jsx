const tones = {
  neutral: 'bg-paper-2 text-ink-2 border-rule-2',
  accent: 'bg-accent-soft text-accent border-transparent',
  success: 'bg-success-soft text-success border-transparent',
  danger: 'bg-danger-soft text-danger border-transparent',
  warning: 'bg-warning-soft text-warning border-transparent',
}

export function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`kbd inline-flex items-center gap-1 whitespace-nowrap rounded border px-2 py-0.5 text-[11px] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
