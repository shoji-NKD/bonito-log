import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "BONITO LOG", template: "%s - BONITO LOG" },
  description: "The Nautical Archive",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <a href="#main" className="skip-link">Skip</a>
        <header className="app-header" role="banner">
          <Link
            href="/"
            style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:17, fontWeight:800, letterSpacing:"-0.02em", color:"var(--primary-dark)", display:"flex", alignItems:"center", gap:8 }}
          >
            <svg width="22" height="10" viewBox="0 0 52 22" fill="currentColor" aria-hidden="true">
              <path d="M 2 11 C 5 3 18 1 30 6 C 37 9 41 11 41 11 C 41 11 37 13 30 16 C 18 21 5 19 2 11 Z" />
              <path d="M 41 6 L 51 2 L 46 11 L 51 20 L 41 16 Z" />
              <path d="M 16 1 C 19 -3 26 -3 28 1 Z" />
            </svg>
            BONITO LOG
          </Link>
        </header>
        <main id="main" className="main-content" role="main">{children}</main>
        <nav className="bottom-nav" role="navigation" aria-label="nav">
          <Link href="/" className="nav-item active">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </Link>
          <Link href="/new" className="nav-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            New
          </Link>
        </nav>
      </body>
    </html>
  );
}
