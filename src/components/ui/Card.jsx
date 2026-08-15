export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-rule bg-paper ${className}`} {...props}>
      {children}
    </div>
  )
}
