// DB初期化スクリプト: npm run db:init
import { initDb } from "../lib/db";
await initDb();
console.log("✅ katsuo_records テーブルを作成しました");
process.exit(0);
