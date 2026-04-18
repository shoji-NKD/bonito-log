import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getRecord } from "@/lib/db";
import { editRecord } from "@/lib/actions";
import RecordForm from "@/components/RecordForm";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const r = await getRecord(params.id);
  return { title: r ? `${r.dish} を編集` : "編集" };
}

export default async function EditPage({ params }: { params: { id: string } }) {
  const record = await getRecord(params.id);
  if (!record) notFound();

  const action = editRecord.bind(null, record.id);

  return (
    <>
      <nav aria-label="パンくずリスト" style={{ padding: "16px 20px 0" }}>
        <ol style={{ display: "flex", alignItems: "center", gap: 6, listStyle: "none",
          fontSize: 12, fontWeight: 500, color: "var(--on-surface-variant)" }}>
          <li><Link href="/" style={{ color: "var(--secondary)", textDecoration: "none" }}>Archive</Link></li>
          <li aria-hidden="true">›</li>
          <li><Link href={`/${record.id}`} style={{ color: "var(--secondary)", textDecoration: "none" }}>{record.dish}</Link></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" style={{ color: "var(--on-surface)" }}>編集</li>
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
          記録を編集
        </h1>
        <RecordForm action={action} initial={record} />
      </div>
    </>
  );
}
