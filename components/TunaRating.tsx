"use client";

interface TunaRatingProps {
  value: number;             // 1–5
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;             // px幅
}

const LABELS = ["", "とても悪い", "悪い", "普通", "良い", "とても良い"];

/** カツオのシルエット SVG パス（viewBox 0 0 52 22） */
function TunaIcon({
  filled,
  size = 36,
}: {
  filled: boolean;
  size?: number;
}) {
  const h = Math.round((size * 22) / 52);
  const color = filled ? "#F2C94C" : "rgba(255,255,255,0.18)";
  const eyeFill    = filled ? "#191918" : "transparent";
  const eyeHighlight = filled ? "rgba(255,255,255,0.6)" : "transparent";
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 52 22"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* 胴体 */}
      <path
        d="M 2 11 C 5 3 18 1 30 6 C 37 9 41 11 41 11 C 41 11 37 13 30 16 C 18 21 5 19 2 11 Z"
        fill={color}
      />
      {/* 尾びれ */}
      <path
        d="M 41 6 L 51 2 L 46 11 L 51 20 L 41 16 Z"
        fill={color}
      />
      {/* 背びれ */}
      <path
        d="M 16 1 C 19 -3 26 -3 28 1 Z"
        fill={color}
      />
      {/* 目（黒目） */}
      <circle cx="10" cy="10" r="2" fill={eyeFill} />
      {/* 目（ハイライト） */}
      <circle cx="10" cy="10" r="1.1" fill={eyeHighlight} />
    </svg>
  );
}

export default function TunaRating({
  value,
  onChange,
  readonly = false,
  size = 36,
}: TunaRatingProps) {
  if (readonly) {
    return (
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label={`評価 ${value}点（5点満点）`}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <TunaIcon key={n} filled={n <= value} size={size} />
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="評価を選択（マグロ1〜5匹）"
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            onMouseEnter={(e) => {
              // ホバー時プレビュー
              const parent = e.currentTarget.closest("[role=group]");
              if (!parent) return;
              parent.querySelectorAll("button").forEach((btn, i) => {
                const paths = btn.querySelectorAll("path, circle");
                const on = i < n;
                paths[0]?.setAttribute("fill", on ? "#F2C94C" : "rgba(255,255,255,0.18)");
                paths[1]?.setAttribute("fill", on ? "#F2C94C" : "rgba(255,255,255,0.18)");
                paths[2]?.setAttribute("fill", on ? "#F2C94C" : "rgba(255,255,255,0.18)");
              });
            }}
            onMouseLeave={(e) => {
              // ホバー解除 → 現在値に戻す
              const parent = e.currentTarget.closest("[role=group]");
              if (!parent) return;
              parent.querySelectorAll("button").forEach((btn, i) => {
                const paths = btn.querySelectorAll("path, circle");
                const on = i < value;
                paths[0]?.setAttribute("fill", on ? "#F2C94C" : "rgba(255,255,255,0.18)");
                paths[1]?.setAttribute("fill", on ? "#F2C94C" : "rgba(255,255,255,0.18)");
                paths[2]?.setAttribute("fill", on ? "#F2C94C" : "rgba(255,255,255,0.18)");
              });
            }}
            aria-label={`${n}点（${LABELS[n]}）`}
            aria-pressed={n <= value}
            className="cursor-pointer rounded focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-[#2383E2] transition-opacity"
          >
            <TunaIcon filled={n <= value} size={size} />
          </button>
        ))}
      </div>
      {value > 0 && (
        <span
          className="text-sm"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {LABELS[value]}
        </span>
      )}
    </div>
  );
}
