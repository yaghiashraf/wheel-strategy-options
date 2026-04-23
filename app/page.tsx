import Link from "next/link";
import { ArrowRight, Database, Radar, ShieldCheck, Sigma } from "lucide-react";
import { DiscoverBoard } from "@/components/discover-board";

const pillars = [
  {
    title: "Live option ranking",
    copy: "Covered-call and cash-secured-put screeners rank contracts by yield, annualized rate, delta fit, OTM room, and open interest.",
    icon: Radar,
  },
  {
    title: "Fundamental overlay",
    copy: "A separate stock screener keeps the wheel focused on names you could actually tolerate owning through assignment.",
    icon: ShieldCheck,
  },
  {
    title: "Execution-ready stack",
    copy: "Server-side Alpaca ingestion keeps credentials off the client and makes the screeners deploy cleanly on GitHub plus Vercel.",
    icon: Database,
  },
];

const heroStats = [
  { label: "Data plane", value: "Alpaca stock + options snapshots" },
  { label: "Core workflows", value: "Discover, calls, puts, fundamentals, calculators" },
  { label: "Rank model", value: "Yield, annualized rate, delta, OTM room, liquidity" },
];

export default function HomePage() {
  return (
    <div className="page-wrap grid gap-8">
      <section className="hero-panel subtle-grid">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-end">
          <div>
            <span className="eyebrow-chip">Premium Wheel Intelligence</span>
            <p className="section-kicker mt-6">Wheel Strategy Income Lab</p>
            <h1 className="display-title mt-4 max-w-5xl text-5xl font-semibold leading-[0.92] text-[var(--sand)] md:text-7xl">
              A sharper, more premium wheel terminal built for screening income trades fast.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[rgba(255,248,235,0.78)]">
              The product should feel more decisive than the reference site, not just imitate it. This version centers the actual operating loop: qualify the stock, rank the call or put, inspect the symbol page, and pressure-test the numbers before execution.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/covered-call-screener" className="primary-button">
                Launch covered-call desk
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/cash-secured-put-screener" className="secondary-button">
                Open put desk
              </Link>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <p className="hero-stat-label">{stat.label}</p>
                  <p className="hero-stat-value">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6 md:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,248,235,0.08)] bg-[rgba(255,255,255,0.04)]">
                <Sigma className="h-6 w-6 text-[var(--gold)]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Desk Overview
                </p>
                <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">
                  One workflow from idea discovery to wheel math.
                </p>
              </div>
            </div>
            <div className="glass-divider my-6" />
            <div className="mt-6 grid gap-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="premium-card">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,248,235,0.08)] bg-[rgba(255,255,255,0.04)]">
                        <Icon className="h-5 w-5 text-[var(--mint)]" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-[var(--ink)]">{pillar.title}</p>
                        <p className="premium-card-muted mt-2 text-sm leading-7">{pillar.copy}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/fundamental-screener" className="secondary-button">
                Stock quality layer
              </Link>
              <Link href="/tools" className="secondary-button">
                Wheel calculators
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DiscoverBoard />
    </div>
  );
}
