export function GoogleSheetsIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#0F9D58"
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
      />
      <path fill="#F1F1F1" d="M14 2v6h6" />
      <path
        fill="#FFF"
        d="M8 12h8v1.5H8zm0 3h8v1.5H8zm0 3h5v1.5H8z"
        opacity="0.9"
      />
    </svg>
  );
}

export function GoogleDriveIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#FFBA00"
        d="M8.02 3.5 12.02 10.42 6.01 20.82 2.01 13.9z"
      />
      <path
        fill="#2684FC"
        d="M15.98 3.5H8.02l4 6.92h7.96z"
      />
      <path
        fill="#00AC47"
        d="M21.99 13.9 17.99 20.82H6.01l4-6.92h11.98z"
      />
    </svg>
  );
}

export function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] select-none">
      {/* Ambient background glow blobs */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

      {/* Main Mockup Card Frame with gentle float animation & refined border */}
      <div className="relative rounded-2xl border border-rule bg-paper p-2.5 sm:p-3.5 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-accent/10 hover:-translate-y-1 animate-float-slow">
        <div className="overflow-hidden rounded-xl border border-rule bg-paper-2/40">
          <img
            src="/preview-dashboard.svg"
            alt="Finance Tracker Dashboard Preview"
            width="1200"
            height="760"
            loading="eager"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Floating Google Sheets & Drive Badge at bottom-right */}
      <div className="absolute -bottom-4 -right-2 sm:-bottom-5 sm:-right-4 z-20 flex items-center gap-3 rounded-xl border border-rule bg-paper px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
        <GoogleSheetsIcon className="h-7 w-7 shrink-0" />
        <div className="text-left">
          <p className="text-[11px] sm:text-xs font-semibold text-ink leading-tight">
            Data tersimpan langsung di
          </p>
          <p className="text-[10px] sm:text-[11px] text-ink-3 font-medium">
            Google Sheets & Google Drive
          </p>
        </div>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success text-[11px] font-bold ml-1">
          ✓
        </span>
      </div>
    </div>
  );
}
