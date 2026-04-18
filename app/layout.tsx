import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "BONITO LOG", template: "%s — BONITO LOG" },
  description: "The Nautical Archive — カツオを食べた記録をつける高品質ログブック",
};

const SkipjackLogo = () => (
  <svg width="26" height="11" viewBox="0 0 52 22" fill="currentColor" aria-hidden="true">
    <path d="M 2 11 C 5 3 18 1 30 6 C 37 9 41 11 41 11 C 41 11 37 13 30 16 C 18 21 5 19 2 11 Z" />
    <path d="M 41 6 L 51 2 L 46 11 L 51 20 L 41 16 Z" />
    <path d="M 16 1 C 19 -3 26 -3 28 1 Z" />
  </svg>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <a href="#main" className="skip-link">メインコンテンツへスキップ</a>

        {/* Glassmorphic sticky nav */}
        <header
          className="nav-glass sticky top-0 z-40 h-14"
          style={{ display: "flex", alignItems: "center" }}
          role="banner"
        >
          <div
            className="w-full flex items-center justify-between"
            style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}
          >
            <Link
              href="/"
              className="font-display flex items-center gap-2 text-[--on-surface] no-underline"
              style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}
              aria-label="BONITO LOG トップページ"
            >
              {/* Brand dot */}
              <span
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--primary)", flexShrink: 0,
                  display: "inline-block",
                }}
                aria-hidden="true"
              />
              <SkipjackLogo />
              BONITO LOG
            </Link>
            <Link href="/new" className="btn-pill">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              記録を追加
            </Link>
          </div>
        </header>

        {/* Main */}
        <main
          id="main"
          style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 80 }}
          role="main"
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          className="label-logbook text-center"
          style={{ padding: "24px 20px 48px", color: "rgba(72,95,132,0.4)" }}
          role="contentinfo"
        >
          BONITO LOG &nbsp;·&nbsp; The Nautical Archive
        </footer>
      </body>
    </html>
  );
}
