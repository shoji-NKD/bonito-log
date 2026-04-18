"use client";

interface SkipjackRatingProps {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
}

const LABELS = ["", "物足りない", "まあまあ", "良い", "とても良い", "最高の一本"];

/** Skipjack silhouette — filled uses primary→primary-container gradient */
function SkipjackIcon({
  filled,
  size = 36,
  gradientId,
}: {
  filled: boolean;
  size?: number;
  gradientId: string;
}) {
  const h = Math.round((size * 22) / 52);
  const fill = filled ? `url(#${gradientId})` : "rgba(72,95,132,0.22)";
  const eye  = filled ? "rgba(255,255,255,0.55)" : "transparent";

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 52 22"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#b7102a" />
          <stop offset="100%" stopColor="#db313f" />
        </linearGradient>
      </defs>
      {/* Body */}
      <path
        d="M 2 11 C 5 3 18 1 30 6 C 37 9 41 11 41 11 C 41 11 37 13 30 16 C 18 21 5 19 2 11 Z"
        fill={fill}
      />
      {/* Tail */}
      <path d="M 41 6 L 51 2 L 46 11 L 51 20 L 41 16 Z" fill={fill} />
      {/* Dorsal fin */}
      <path d="M 16 1 C 19 -3 26 -3 28 1 Z" fill={fill} />
      {/* Eye */}
      <circle cx="10" cy="10" r="2" fill={eye} />
    </svg>
  );
}

export default function SkipjackRating({
  value,
  onChange,
  readonly = false,
  size = 36,
}: SkipjackRatingProps) {
  if (readonly) {
    return (
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label={`評価 ${value}（5点満点）— ${LABELS[value] ?? ""}`}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <SkipjackIcon
            key={n}
            filled={n <= value}
            size={size}
            gradientId={`sj-ro-${n}-${size}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="評価を選択（スキップジャック1〜5匹）"
      className="flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={(e) => {
            const parent = e.currentTarget.parentElement;
            if (!parent) return;
            parent.querySelectorAll<SVGPathElement>("path").forEach((p, i) => {
              const target = Math.floor(i / 3); // 3 paths per icon
              p.setAttribute(
                "fill",
                target < n ? `url(#sj-i-${target + 1}-${size})` : "rgba(72,95,132,0.22)"
              );
            });
          }}
          onMouseLeave={(e) => {
            const parent = e.currentTarget.parentElement;
            if (!parent) return;
            parent.querySelectorAll<SVGPathElement>("path").forEach((p, i) => {
              const target = Math.floor(i / 3);
              p.setAttribute(
                "fill",
                target < value ? `url(#sj-i-${target + 1}-${size})` : "rgba(72,95,132,0.22)"
              );
            });
          }}
          className="cursor-pointer rounded transition-transform duration-75 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--primary]"
          aria-label={`${n}点 — ${LABELS[n]}`}
          aria-pressed={n <= value}
        >
          <SkipjackIcon filled={n <= value} size={size} gradientId={`sj-i-${n}-${size}`} />
        </button>
      ))}
      {value > 0 && (
        <span
          className="ml-2 text-sm font-semibold"
          style={{ color: "var(--on-surface-variant)" }}
        >
          {LABELS[value]}
        </span>
      )}
    </div>
  );
}
