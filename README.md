# 🐟 BONITO LOG — The Nautical Archive

カツオを食べた記録をつける高品質ログブック。Next.js 15 + Turso DB。

## デザインシステム

**The Nautical Archive** に準拠。「血と塩と深海」をテーマにした高エディトリアルUI。

| トークン | 値 |
|---------|-----|
| Primary | `#b7102a` — The Lifeblood |
| Secondary | `#485f84` — The Deep Water |
| Surface | `#f6faff` — The Sea Foam |
| Display font | Plus Jakarta Sans 800 (-0.04em) |
| Body font | Manrope 400/500/600 |

## セットアップ

```bash
npm install
cp .env.local.example .env.local   # Turso URLとトークンを設定
npm run db:init                    # テーブル作成
npm run dev
```

## Vercelデプロイ

```bash
git init && git add . && git commit -m "feat: BONITO LOG"
git remote add origin https://github.com/YOUR/bonito-log.git
git push -u origin main
```

Vercel → Import → Environment Variables を設定:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `BLOB_READ_WRITE_TOKEN`

## ファイル構成

```
app/
  layout.tsx        Glassmorphic nav + staggered fades
  page.tsx          Editorial hero (135° gradient) + stat tiles + archive list
  new/page.tsx      新規記録フォーム
  [id]/page.tsx     詳細 (gradient hero + tonal rows)
  [id]/edit/page.tsx
components/
  SkipjackRating.tsx  カスタムスキップジャック評価 (gradient shimmer)
  RecordForm.tsx      Minimalist inputs + glassmorphic type selector
  TimelineCard.tsx    No-divider cards with shimmer hover
  DeleteButton.tsx    Bottom-sheet modal
lib/
  db.ts             Turso / LibSQL queries
  actions.ts        Server Actions (CRUD + Vercel Blob)
```
