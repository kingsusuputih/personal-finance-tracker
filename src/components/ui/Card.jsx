export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-card border border-rule bg-paper ${className}`}
      {...props}>
      {children}
    </div>
  );
}
