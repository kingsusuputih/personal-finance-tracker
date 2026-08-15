export function Skeleton({ className = '', ...props }) {
  return <div className={`animate-pulse rounded bg-paper-3 ${className}`} {...props} />
}
