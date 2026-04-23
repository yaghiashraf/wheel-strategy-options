import Link from "next/link";
import { Activity, BarChart3, Calculator, Database, Sigma } from "lucide-react";

const links = [
  { href: "/", label: "CALLS" },
  { href: "/cash-secured-put-screener", label: "PUTS" },
  { href: "/fundamental-screener", label: "EQUITY" },
  { href: "/tools", label: "RISK" },
];

export function TopNav() {
  return (
    <header className="terminal-topbar">
      <Link href="/" className="terminal-brand">
        <Sigma className="h-4 w-4 text-[var(--gold)]" />
        <span>WHEEL.Q</span>
      </Link>

      <nav className="terminal-nav">
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="terminal-status">
        <span>
          <Activity className="h-3.5 w-3.5 text-[var(--mint)]" />
          LIVE
        </span>
        <span>
          <Database className="h-3.5 w-3.5 text-[var(--gold)]" />
          ALPACA
        </span>
        <span className="hidden sm:inline-flex">
          <BarChart3 className="h-3.5 w-3.5" />
          INDEX SCAN
        </span>
        <Link href="/tools" className="terminal-icon-link" aria-label="Risk tools">
          <Calculator className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
