import type { Metadata } from "next";
import Link from "next/link";
import { createRecord } from "@/lib/actions";
import RecordForm from "@/components/RecordForm";

export const metadata: Metadata = { title: "新規記録" };

export default function NewPage() {
  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="パンくずリスト" style={{ padding: "16px 20px 0" }}>
        <ol style={{ display: "flex", alignItems: "center", gap: 6, listStyle: "none",
          fontSize: 12, fontWeight: 500, color: "var(--on-surface-variant)" }}>
          <li><Link href="/" style={{ color: "var(--secondary)", textDecoration: "none" }}>Archive</Link></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" style={{ color: "var(--on-surface)" }}>新規記録</li>
        </ol>
      </nav>

      <div style={{ padding: "12px 20px 0" }}>
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em",
            color: "var(--on-surface)", marginBottom: 20,
          }}
        >
          新規記録
        </h1>
        <RecordForm action={createRecord} />
      </div>
    </>
  );
}
