export function GetDemoButton({
  label = "Try our demo",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <a
      href="/demo"
      className={`inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-[15px] font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.04)] transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${className}`}
    >
      <MonitorIcon />
      {label}
    </a>
  );
}

function MonitorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}
