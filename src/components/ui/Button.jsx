import { Spinner } from "./Spinner.jsx";

const variants = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-strong active:translate-y-px disabled:bg-ink-3/60",
  secondary:
    "border border-rule-2 text-ink hover:border-accent hover:text-accent active:translate-y-px disabled:text-ink-3",
  ghost:
    "text-ink-2 hover:bg-paper-2 active:translate-y-px disabled:text-ink-3",
  danger:
    "bg-danger text-white hover:opacity-90 active:translate-y-px disabled:opacity-50",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-btn font-medium transition-[background-color,border-color,color,transform,opacity] duration-(--dur-base) ease-out disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
