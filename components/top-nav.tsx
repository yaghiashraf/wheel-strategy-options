import Link from "next/link";
import { BarChart3, Compass, Landmark, Sigma } from "lucide-react";

const links = [
  { href: "/", label: "Discover" },
  { href: "/covered-call-screener", label: "Covered Calls" },
  { href: "/cash-secured-put-screener", label: "Cash-Secured Puts" },
  { href: "/fundamental-screener", label: "Fundamentals" },
  { href: "/tools", label: "Tools" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(10,20,22,0.9)] text-[var(--sand)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,248,235,0.16)] bg-[rgba(255,255,255,0.06)]">
            <Sigma className="h-5 w-5 text-[var(--gold)]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgba(255,248,235,0.62)]">
              Wheel Strategy
            </p>
            <p className="text-sm font-semibold">Income Lab</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[rgba(255,248,235,0.78)] md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,248,235,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-xs text-[rgba(255,248,235,0.7)]">
            <BarChart3 className="h-3.5 w-3.5 text-[var(--mint)]" />
            Alpaca-backed live screeners
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-3 md:hidden md:px-8">
        <Link href="/" className="mobile-nav-chip">
          <Compass className="h-3.5 w-3.5" />
          Discover
        </Link>
        <Link href="/covered-call-screener" className="mobile-nav-chip">
          <Landmark className="h-3.5 w-3.5" />
          Calls
        </Link>
        <Link href="/cash-secured-put-screener" className="mobile-nav-chip">
          <Landmark className="h-3.5 w-3.5" />
          Puts
        </Link>
        <Link href="/fundamental-screener" className="mobile-nav-chip">
          <BarChart3 className="h-3.5 w-3.5" />
          Stocks
        </Link>
      </div>
    </header>
  );
}
