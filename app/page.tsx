import type { Metadata } from "next";
import Link from "next/link";
import { getAllRecords, calcStats } from "@/lib/db";
import TimelineCard from "@/components/TimelineCard";

export const metadata: Metadata = { title: "Archive" };
export const dynamic = "force-dynamic";

function formatWeight(g: number): { val: string; unit: string } {
  if (g === 0) return { val: "0", unit: "g" };
  if (g >= 1000) {
    const kg = g / 1000;
    return { val: kg % 1 === 0 ? String(kg) : kg.toFixed(2).replace(/\.?0+$/, ""), unit: "kg" };
  }
  return { val: g.toLocaleString(), unit: "g" };
}

export default async function ArchivePage() {
  const records = await getAllRecords();
  const stats   = calcStats(records);
  const year    = new Date().getFullYear();
  const { val: wVal, unit: wUnit } = formatWeight(stats.thisYearWeightG);

  const statItems = [
    { l: "Catches",    v: `${stats.thisYearCount}回` },
    { l: "Total",      v: `${stats.totalRecords}回` },
    { l: "Avg Weight", v: stats.avgWeightG > 0 ? `${stats.avgWeightG.toLocaleString()}g` : "—" },
    { l: "Top Port",   v: stats.topLocation },
  ];

  return (
    <>
      {/* ── Hero: Signature Texture gradient (135°) ── */}
      <section
        className="fade-up"
        style={{
          background: "linear-gradient(135deg, #b7102a 0%, #db313f 100%)",
          padding: "32px 20px 40px",
          position: "relative",
          overflow: "hidden",
        }}
        aria-label="統計サマリー"
      >
        {/* Decorative bleed circle */}
        <div
          style={{
            position: "absolute", right: -50, top: -50,
            width: 240, height: 240, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
        {/* Bottom curve */}
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 24,
            background: "var(--surface)",
            borderRadius: "24px 24px 0 0",
          }}
          aria-hidden="true"
        />

        {/* Eyebrow */}
        <p
          className="fade-up"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.65)",
            marginBottom: 10,
          }}
        >
          {year}年 — 総摂取量
        </p>

        {/* Display number */}
        <div className="fade-up-2" style={{ marginBottom: 6 }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(60px, 16vw, 88px)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9,
              color: "#fff", display: "inline-block",
            }}
          >
            {wVal}
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.75)",
              marginLeft: 4, verticalAlign: "super",
            }}
          >
            {wUnit}
          </span>
        </div>

        <p
          className="fade-up-3"
          style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}
        >
          {stats.thisYearWeightG.toLocaleString()} g ／ {stats.thisYearCount}回
          {stats.totalRecords > stats.thisYearCount && (
            <span> （通算 {stats.totalRecords}回）</span>
          )}
        </p>
      </section>

      <div style={{ padding: "20px 20px 0" }}>

        {/* ── Stat tiles ── */}
        <section className="fade-up-4" aria-label="統計詳細" style={{ marginBottom: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {statItems.map(({ l, v }) => (
              <div
                key={l}
                style={{
                  background: "var(--surface-lowest)",
                  borderRadius: 18,
                  boxShadow: "0 4px 24px rgba(72,95,132,0.07)",
                  padding: "14px 12px",
                }}
              >
                <p
                  style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.10em",
                    textTransform: "uppercase", color: "var(--on-surface-variant)",
                    marginBottom: 6,
                  }}
                >
                  {l}
                </p>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 18, fontWeight: 800, letterSpacing: "-0.03em",
                    color: "var(--on-surface)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}
                  title={v}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="fade-up-5" aria-labelledby="archive-heading">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
            <h1
              id="archive-heading"
              style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.10em",
                textTransform: "uppercase", color: "var(--secondary)",
              }}
            >
              Archive
            </h1>
            <span style={{ fontSize: 12, color: "var(--on-surface-variant)", fontWeight: 500 }}>
              {records.length} logs
            </span>
          </div>

          {records.length === 0 ? (
            <div
              style={{
                background: "var(--surface-lowest)",
                borderRadius: 24,
                boxShadow: "0 4px 24px rgba(72,95,132,0.07)",
                padding: "52px 24px",
                textAlign: "center",
              }}
            >
              {/* Pulsing skipjack loader (empty state) */}
              <div className="sj-pulse" style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <svg width="72" height="30" viewBox="0 0 52 22" fill="#b7102a" opacity="0.25">
                  <path d="M 2 11 C 5 3 18 1 30 6 C 37 9 41 11 41 11 C 41 11 37 13 30 16 C 18 21 5 19 2 11 Z" />
                  <path d="M 41 6 L 51 2 L 46 11 L 51 20 L 41 16 Z" />
                  <path d="M 16 1 C 19 -3 26 -3 28 1 Z" />
                </svg>
              </div>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em",
                color: "var(--on-surface-variant)", marginBottom: 6,
              }}>
                まだ記録がありません
              </p>
              <p style={{ fontSize: 13, color: "rgba(72,95,132,0.45)", marginBottom: 24 }}>
                最初のカツオをアーカイブしましょう
              </p>
              <Link href="/new" className="btn-primary">最初の記録を追加</Link>
            </div>
          ) : (
            /* No-Divider Rule: gap + alternating tints via CSS nth-child */
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {records.map((r) => (
                <li key={r.id}>
                  <TimelineCard record={r} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
