import Link from "next/link";
import { Activity, BarChart3, Compass, Landmark, Sigma } from "lucide-react";

const links = [
  { href: "/", label: "Discover" },
  { href: "/covered-call-screener", label: "Covered Calls" },
  { href: "/cash-secured-put-screener", label: "Cash-Secured Puts" },
  { href: "/fundamental-screener", label: "Fundamentals" },
  { href: "/tools", label: "Tools" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4 text-[var(--sand)] md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[1.6rem] border border-[var(--line)] bg-[rgba(7,17,22,0.72)] px-4 py-3 backdrop-blur-xl md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,248,235,0.14)] bg-[rgba(255,255,255,0.05)] shadow-[0_0_0_6px_rgba(255,255,255,0.02)]">
            <Sigma className="h-5 w-5 text-[var(--gold)]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgba(255,248,235,0.62)]">
              Wheel Strategy
            </p>
            <p className="text-sm font-semibold text-white">Income Lab</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 text-sm md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="nav-chip">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <span className="status-pill">
            <Activity className="h-3.5 w-3.5 text-[var(--mint)]" />
            Live Alpaca market feed
          </span>
          <span className="status-pill">
            <BarChart3 className="h-3.5 w-3.5 text-[var(--gold)]" />
            Ranked wheel workflows
          </span>
        </div>
      </div>
      <div className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto px-1 pb-1 md:hidden">
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
