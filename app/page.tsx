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
    title: "Deployment-ready",
    copy: "This build is set up for GitHub plus Vercel, with server-side route handlers protecting your Alpaca credentials.",
    icon: Database,
  },
];

export default function HomePage() {
  return (
    <div className="page-wrap grid gap-8">
      <section className="hero-panel">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
          <div>
            <p className="section-kicker">Wheel Strategy Income Lab</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.96] text-[var(--sand)] md:text-7xl">
              Recreate the wheelstrategyoptions.com workflow with Alpaca under the hood.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[rgba(255,248,235,0.78)]">
              This version focuses on the actual jobs that matter: screening stocks, finding covered calls, ranking cash-secured puts, and doing the math fast enough to act.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/covered-call-screener" className="primary-button">
                Open covered-call screener
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/cash-secured-put-screener" className="secondary-button">
                Open put screener
              </Link>
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--night)]">
                <Sigma className="h-6 w-6 text-[var(--gold)]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Product Scope
                </p>
                <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">
                  Screeners, symbol pages, calculators, fundamentals
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="rounded-3xl border border-[var(--line)] bg-white/90 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--night)]">
                        <Icon className="h-5 w-5 text-[var(--mint)]" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-[var(--ink)]">{pillar.title}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{pillar.copy}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <DiscoverBoard />
    </div>
  );
}
