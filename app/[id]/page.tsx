import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getRecord } from "@/lib/db";
import SkipjackRating from "@/components/SkipjackRating";
import DeleteButton from "@/components/DeleteButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const r = await getRecord(id);
  return { title: r ? r.dish : "記録" };
}

const TYPE_CONFIG: Record<string, { cls: string; label: string }> = {
  "初カツオ":  { cls: "type-hatsu",  label: "🌸 初カツオ" },
  "戻りカツオ": { cls: "type-modori", label: "🍂 戻りカツオ" },
  "その他":    { cls: "type-other",  label: "その他" },
};

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getRecord(id);
  if (!record) notFound();

  const dateStr = new Date(record.date + "T00:00:00").toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });
  const tc = TYPE_CONFIG[record.katsuo_type] ?? TYPE_CONFIG["その他"];

  return (
    <>
      <nav aria-label="パンくずリスト" style={{ padding: "16px 20px 0" }}>
        <ol style={{ display: "flex", alignItems: "center", gap: 6, listStyle: "none",
          fontSize: 12, fontWeight: 500, color: "var(--on-surface-variant)" }}>
          <li><Link href="/" style={{ color: "var(--secondary)", textDecoration: "none" }}>Archive</Link></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" style={{ color: "var(--on-surface)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {record.dish}
          </li>
        </ol>
      </nav>

      <div style={{
        background: "linear-gradient(135deg, #b7102a 0%, #db313f 100%)",
        padding: "24px 20px 44px", position: "relative", overflow: "hidden", margin: "12px 0 0",
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180,
          borderRadius: "50%", background: "rgba(255,255,255,0.10)", pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 24,
          background: "var(--surface)", borderRadius: "24px 24px 0 0" }} aria-hidden="true" />
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(24px, 6vw, 36px)",
          fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.2, marginBottom: 6 }}>
          {record.dish}
        </h1>
        <time dateTime={record.date} style={{ fontSize: 13, color: "rgba(255,255,255,0.70)", fontWeight: 500 }}>
          {dateStr}
        </time>
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        {record.photo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={record.photo_url} alt={`${record.dish}の写真`}
            style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 20,
              marginBottom: 14, boxShadow: "0 8px 40px rgba(72,95,132,0.10)", display: "block" }} />
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Link href={`/${record.id}/edit`} className="btn-glass" style={{ flex: 1, textAlign: "center" }}>編集</Link>
          <DeleteButton id={record.id} dish={record.dish} />
        </div>

        {[
          { l: "Skipjack Rating", node: <SkipjackRating value={record.rating} readonly size={28} /> },
          { l: "Cut Type", node: <span className={`type-badge ${tc.cls}`} style={{ fontSize: 13, padding: "4px 12px" }}>{tc.label}</span> },
          { l: "Location", node: <span>📍 {record.location}</span> },
          record.weight_g ? { l: "Weight", node: <span>⚖️ {record.weight_g.toLocaleString()} g</span> } : null,
          record.memo ? { l: "Notes", node: <p style={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{record.memo}</p> } : null,
          { l: "Logged", node: <span style={{ fontSize: 13, color: "var(--on-surface-variant)" }}>{new Date(record.created_at).toLocaleString("ja-JP")}</span> },
        ].filter(Boolean).map((row, i) => (
          <div key={row!.l} style={{ background: i % 2 === 0 ? "var(--surface-lowest)" : "var(--surface-low)",
            borderRadius: 18, boxShadow: "0 4px 24px rgba(72,95,132,0.07)", padding: "16px 20px", marginBottom: 10 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase",
              color: "var(--on-surface-variant)", marginBottom: 7 }}>{row!.l}</p>
            <div style={{ fontSize: 15, color: "var(--on-surface)", fontWeight: 500 }}>{row!.node}</div>
          </div>
        ))}
      </div>
    </>
  );
}
