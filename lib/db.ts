import { createClient } from "@libsql/client";
import { KatsuoRecord, Stats } from "@/types";

const dbUrl =
  process.env.TURSO_DATABASE_URL &&
  !process.env.TURSO_DATABASE_URL.includes("your-db")
    ? process.env.TURSO_DATABASE_URL
    : "file:./bonito-log-dev.db";

export const db = createClient({
  url: dbUrl,
  authToken: dbUrl.startsWith("libsql://") ? process.env.TURSO_AUTH_TOKEN : undefined,
});

let initialized = false;

async function ensureInit() {
  if (initialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS katsuo_records (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      katsuo_type TEXT NOT NULL DEFAULT 'その他',
      dish TEXT NOT NULL,
      weight_g INTEGER,
      location TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      memo TEXT NOT NULL DEFAULT '',
      photo_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  initialized = true;
}

export async function initDb() {
  initialized = false;
  await ensureInit();
}

export async function getAllRecords(): Promise<KatsuoRecord[]> {
  await ensureInit();
  const r = await db.execute(
    "SELECT * FROM katsuo_records ORDER BY date DESC, created_at DESC"
  );
  return r.rows as unknown as KatsuoRecord[];
}

export async function getRecord(id: string): Promise<KatsuoRecord | null> {
  await ensureInit();
  const r = await db.execute({
    sql: "SELECT * FROM katsuo_records WHERE id = ?",
    args: [id],
  });
  return (r.rows[0] as unknown as KatsuoRecord) ?? null;
}

export async function insertRecord(record: KatsuoRecord): Promise<void> {
  await ensureInit();
  await db.execute({
    sql: `INSERT INTO katsuo_records
      (id, date, katsuo_type, dish, weight_g, location, rating, memo, photo_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      record.id, record.date, record.katsuo_type, record.dish,
      record.weight_g, record.location, record.rating, record.memo,
      record.photo_url, record.created_at, record.updated_at,
    ],
  });
}

export async function updateRecord(record: KatsuoRecord): Promise<void> {
  await ensureInit();
  await db.execute({
    sql: `UPDATE katsuo_records SET
      date=?, katsuo_type=?, dish=?, weight_g=?,
      location=?, rating=?, memo=?, photo_url=?, updated_at=?
      WHERE id=?`,
    args: [
      record.date, record.katsuo_type, record.dish, record.weight_g,
      record.location, record.rating, record.memo, record.photo_url,
      record.updated_at, record.id,
    ],
  });
}

export async function deleteRecord(id: string): Promise<void> {
  await ensureInit();
  await db.execute({
    sql: "DELETE FROM katsuo_records WHERE id = ?",
    args: [id],
  });
}

export function calcStats(records: KatsuoRecord[]): Stats {
  const year = new Date().getFullYear().toString();
  const thisYear = records.filter((r) => r.date.startsWith(year));
  const withWeight = records.filter((r) => r.weight_g != null);
  const totalWeightG = withWeight.reduce((s, r) => s + (r.weight_g ?? 0), 0);
  const thisYearWeightG = thisYear
    .filter((r) => r.weight_g != null)
    .reduce((s, r) => s + (r.weight_g ?? 0), 0);
  const avgRating =
    records.length > 0
      ? records.reduce((s, r) => s + r.rating, 0) / records.length
      : 0;
  const avgWeightG =
    withWeight.length > 0 ? totalWeightG / withWeight.length : 0;
  const locMap: Record<string, number> = {};
  records.forEach((r) => {
    if (r.location) locMap[r.location] = (locMap[r.location] ?? 0) + 1;
  });
  const topLocation =
    Object.entries(locMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  return {
    totalRecords: records.length,
    totalWeightG,
    thisYearWeightG,
    thisYearCount: thisYear.length,
    avgRating: Math.round(avgRating * 10) / 10,
    avgWeightG: Math.round(avgWeightG),
    topLocation,
  };
}
