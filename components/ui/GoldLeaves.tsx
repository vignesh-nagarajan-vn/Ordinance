"use client";

// Five distinct fragment shapes — hammered metal, not plant leaves
const SHAPES = [
  "M5 0 L11 3 L12 10 L7 18 L1 15 L0 7 Z",
  "M5 0 L9 8 L5 19 L1 8 Z",
  "M2 0 L10 2 L12 9 L9 16 L1 14 L0 6 Z",
  "M4 0 L11 4 L10 13 L3 16 L0 8 Z",
  "M6 0 L11 4 L12 9 L8 14 L3 15 L0 10 L1 4 Z",
] as const;

const COLORS = [
  "#D4A017",
  "#C8870A",
  "#B87333",
  "#D4AF37",
  "#C9960C",
] as const;

interface LeafConfig {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  shape: number;
  color: string;
  anim: 1 | 2 | 3;
}

// 21 leaves — varied position, size, speed, and drift path.
// Negative delays start leaves mid-fall on load so the effect is immediate.
const LEAVES: LeafConfig[] = [
  { id: 0,  x: 3,  size: 14, duration: 12, delay: -6,   shape: 0, color: COLORS[0], anim: 1 },
  { id: 1,  x: 10, size: 10, duration: 15, delay:  2.5, shape: 2, color: COLORS[2], anim: 2 },
  { id: 2,  x: 20, size: 16, duration: 11, delay: -5,   shape: 1, color: COLORS[1], anim: 3 },
  { id: 3,  x: 31, size:  9, duration: 14, delay:  1,   shape: 3, color: COLORS[3], anim: 1 },
  { id: 4,  x: 41, size: 18, duration: 13, delay: -7,   shape: 0, color: COLORS[4], anim: 2 },
  { id: 5,  x: 49, size: 12, duration: 10, delay:  3.5, shape: 4, color: COLORS[0], anim: 3 },
  { id: 6,  x: 58, size: 15, duration: 16, delay: -8,   shape: 2, color: COLORS[1], anim: 1 },
  { id: 7,  x: 66, size: 11, duration: 12, delay:  6,   shape: 3, color: COLORS[2], anim: 2 },
  { id: 8,  x: 76, size: 17, duration: 14, delay: -4,   shape: 1, color: COLORS[3], anim: 3 },
  { id: 9,  x: 85, size: 10, duration: 11, delay:  8,   shape: 0, color: COLORS[4], anim: 1 },
  { id: 10, x: 93, size: 13, duration: 13, delay: -3,   shape: 4, color: COLORS[0], anim: 2 },
  { id: 11, x:  7, size: 11, duration: 15, delay:  9,   shape: 3, color: COLORS[1], anim: 3 },
  { id: 12, x: 16, size: 16, duration: 12, delay: -9,   shape: 0, color: COLORS[2], anim: 1 },
  { id: 13, x: 26, size:  9, duration: 14, delay: 11,   shape: 2, color: COLORS[3], anim: 2 },
  { id: 14, x: 36, size: 14, duration: 10, delay: -1,   shape: 1, color: COLORS[4], anim: 3 },
  { id: 15, x: 45, size: 12, duration: 16, delay:  4.5, shape: 4, color: COLORS[0], anim: 1 },
  { id: 16, x: 54, size: 18, duration: 11, delay: -10,  shape: 0, color: COLORS[1], anim: 2 },
  { id: 17, x: 62, size: 10, duration: 13, delay:  6.5, shape: 3, color: COLORS[2], anim: 3 },
  { id: 18, x: 72, size: 15, duration: 15, delay: -2,   shape: 2, color: COLORS[3], anim: 1 },
  { id: 19, x: 81, size: 11, duration: 12, delay: 12,   shape: 1, color: COLORS[4], anim: 2 },
  { id: 20, x: 88, size: 14, duration: 14, delay: -5.5, shape: 4, color: COLORS[0], anim: 3 },
];

export function GoldLeaves() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      {LEAVES.map((leaf) => (
        <div
          key={leaf.id}
          className={`absolute top-0 leaf-fall-${leaf.anim}`}
          style={{
            left: `${leaf.x}%`,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationFillMode: "backwards",
          }}
        >
          <svg
            width={leaf.size}
            height={Math.round(leaf.size * 1.58)}
            viewBox="0 0 12 19"
            fill={leaf.color}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={SHAPES[leaf.shape]} />
          </svg>
        </div>
      ))}
    </div>
  );
}
