// Small decorative line icons used in feature cells.
// All are 24x24 with strokeWidth 1.7, rendered at currentColor.

type IconProps = { className?: string };

const base = "h-full w-full";

function Svg({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const Icon = {
  Check: ({ className }: IconProps) => (
    <Svg className={className}>
      <polyline points="4 12 10 18 20 6" />
    </Svg>
  ),
  Clipboard: ({ className }: IconProps) => (
    <Svg className={className}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <rect x="9" y="2.5" width="6" height="3" rx="1" />
      <path d="M9 11h6M9 15h4" />
    </Svg>
  ),
  ScanQR: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3" />
      <path d="M7 12h10" />
    </Svg>
  ),
  Bell: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </Svg>
  ),
  Calendar: ({ className }: IconProps) => (
    <Svg className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </Svg>
  ),
  Users: ({ className }: IconProps) => (
    <Svg className={className}>
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="17" cy="8" r="2.6" />
      <path d="M15.5 14a4.5 4.5 0 0 1 6.5 4" />
    </Svg>
  ),
  BellRing: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M5 5l-2 2M19 5l2 2" />
      <path d="M7 16V11a5 5 0 1 1 10 0v5l1.2 2H5.8L7 16Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </Svg>
  ),
  Eye: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  ),
  Activity: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M3 12h4l3-7 4 14 3-7h4" />
    </Svg>
  ),
  Megaphone: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M3 11v2a3 3 0 0 0 3 3h2l8 4V4l-8 4H6a3 3 0 0 0-3 3Z" />
      <path d="M19 8v8" />
    </Svg>
  ),
  Sparkle: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M12 4v6M12 14v6M4 12h6M14 12h6" />
    </Svg>
  ),
  Robot: ({ className }: IconProps) => (
    <Svg className={className}>
      <rect x="5" y="7" width="14" height="11" rx="3" />
      <path d="M9 11v2M15 11v2M12 4v3" />
    </Svg>
  ),
  Refresh: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M3 12a9 9 0 0 1 16-5.7M21 12a9 9 0 0 1-16 5.7" />
      <path d="M19 3v4h-4M5 21v-4h4" />
    </Svg>
  ),
  Repeat: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M17 2l4 4-4 4" />
      <path d="M21 6H7a4 4 0 0 0-4 4v1" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M3 18h14a4 4 0 0 0 4-4v-1" />
    </Svg>
  ),
  Plug: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M9 4v5M15 4v5" />
      <rect x="7" y="9" width="10" height="5" rx="1.5" />
      <path d="M12 14v3a3 3 0 0 0 3 3h0" />
    </Svg>
  ),
  Person: ({ className }: IconProps) => (
    <Svg className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </Svg>
  ),
  Phone: ({ className }: IconProps) => (
    <Svg className={className}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </Svg>
  ),
  Devices: ({ className }: IconProps) => (
    <Svg className={className}>
      <rect x="3" y="5" width="13" height="9" rx="2" />
      <rect x="14" y="9" width="7" height="11" rx="2" />
      <path d="M3 14h13" />
    </Svg>
  ),
  Lightning: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />
    </Svg>
  ),
  Star: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="m12 3 2.6 5.6 6 .6-4.5 4.1 1.3 6-5.4-3.2L6.6 19.3l1.3-6L3.4 9.2l6-.6L12 3Z" />
    </Svg>
  ),
};

// Decorative sparkles/star ornaments above section headlines
export function HeadlineSparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M9 7 l3 5 5 3 -5 3 -3 5 -3 -5 -5 -3 5 -3 z"
        fill="#1F2223"
        opacity="0.85"
        transform="translate(2 2) scale(0.55)"
      />
      <path
        d="M22 16 l1.6 2.4 2.4 1.6 -2.4 1.6 -1.6 2.4 -1.6 -2.4 -2.4 -1.6 2.4 -1.6 z"
        fill="#1F2223"
        opacity="0.75"
        transform="translate(6 -2)"
      />
    </svg>
  );
}
