import Link from "next/link";
import { KatsuoRecord } from "@/types";
import SkipjackRating from "./SkipjackRating";

const TYPE_CONFIG: Record<string, { cls: string; label: string }> = {
  "初カツオ":  { cls: "type-hatsu",  label: "🌸 初カツオ" },
  "戻りカツオ": { cls: "type-modori", label: "🍂 戻りカツオ" },
  "その他":    { cls: "type-other",  label: "その他" },
};

export default function TimelineCard({ record }: { record: KatsuoRecord }) {
  const dateStr = new Date(record.date + "T00:00:00").toLocaleDateString("ja-JP", {
    month: "numeric", day: "numeric",
  });
  const tc = TYPE_CONFIG[record.katsuo_type] ?? TYPE_CONFIG["その他"];

  return (
    <Link
      href={`/${record.id}`}
      className="record-card flex items-center gap-3 px-4 py-3 no-underline"
      style={{ color: "inherit", display: "flex", position: "relative", overflow: "hidden" }}
      aria-label={`${dateStr}、${record.dish}、${record.location}、評価${record.rating}点`}
    >
      {/* Left accent bar on hover */}
      <span
        style={{
          position: "absolute", left: 0, top: "20%", bottom: "20%",
          width: 3, borderRadius: "0 3px 3px 0",
          background: "var(--primary)", opacity: 0,
          transition: "opacity 140ms",
        }}
        className="card-accent"
        aria-hidden="true"
      />

      {/* Thumbnail */}
      {record.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={record.photo_url}
          alt={record.dish}
          style={{
            width: 52, height: 52, borderRadius: 12,
            objectFit: "cover", flexShrink: 0,
          }}
          loading="lazy"
        />
      ) : (
        <div
          style={{
            width: 52, height: 52, borderRadius: 12,
            background: "var(--surface-high)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <svg width="28" height="12" viewBox="0 0 52 22" fill="rgba(72,95,132,0.35)">
            <path d="M 2 11 C 5 3 18 1 30 6 C 37 9 41 11 41 11 C 41 11 37 13 30 16 C 18 21 5 19 2 11 Z" />
            <path d="M 41 6 L 51 2 L 46 11 L 51 20 L 41 16 Z" />
            <path d="M 16 1 C 19 -3 26 -3 28 1 Z" />
          </svg>
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em",
            color: "var(--on-surface)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            marginBottom: 3,
          }}
        >
          {record.dish}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span className={`type-badge ${tc.cls}`}>{tc.label}</span>
          {record.location && (
            <span style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>
              📍 {record.location}
            </span>
          )}
        </div>
        <SkipjackRating value={record.rating} readonly size={18} />
      </div>

      {/* Right */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
        {record.weight_g && (
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 17, fontWeight: 800, letterSpacing: "-0.03em",
              color: "var(--secondary)",
            }}
          >
            {record.weight_g.toLocaleString()}g
          </span>
        )}
        <time
          dateTime={record.date}
          style={{ fontSize: 11, color: "var(--on-surface-variant)", fontWeight: 500 }}
        >
          {dateStr}
        </time>
                <span style={{ fontSize: 12, color: "rgba(72,95,132,0.35)" }}>›</span>
      </div>
    </Link>
  );
}
