import Link from "next/link";
import type { StrategySummary, Strategy } from "@/lib/types";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  titleCase,
} from "@/lib/format";
import { OpportunityTable } from "@/components/opportunity-table";

export function SymbolSummary({
  strategy,
  summary,
}: {
  strategy: Strategy;
  summary: StrategySummary;
}) {
  return (
    <div className="grid gap-6">
      <section className="hero-panel subtle-grid">
        <div className="max-w-4xl">
          <span className="eyebrow-chip">{titleCase(strategy)}</span>
          <h1 className="display-title mt-5 text-4xl font-semibold leading-[0.96] text-[var(--sand)] md:text-6xl">
            {summary.companyName} ({summary.symbol}) opportunities ranked for the wheel.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[rgba(255,248,235,0.74)]">
            {summary.sector} · {summary.industry}. This page is the symbol intelligence layer: contract ranking, ownership context, and the fastest route to compare both legs of the wheel on one name.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={strategy === "covered-call" ? "/covered-call-screener" : "/cash-secured-put-screener"}
              className="primary-button"
            >
              Open full screener
            </Link>
            <Link
              href={strategy === "covered-call" ? `/cash-secured-put/${summary.symbol.toLowerCase()}` : `/covered-call/${summary.symbol.toLowerCase()}`}
              className="secondary-button"
            >
              Compare opposite wheel leg
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="metric-card">
          <p className="metric-label">Available Contracts</p>
          <p className="metric-value">{summary.availableContracts}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Average Yield</p>
          <p className="metric-value">{formatPercent(summary.averageYieldPct)}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Maximum Yield</p>
          <p className="metric-value">{formatPercent(summary.maximumYieldPct)}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Current Stock Price</p>
          <p className="metric-value">{formatCurrency(summary.stockPrice)}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Average IV</p>
          <p className="metric-value">{formatPercent(summary.averageIvPct)}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Market Cap / Rating</p>
          <p className="metric-value">
            {(summary.marketCap ? formatCompactNumber(summary.marketCap) : summary.sector) + " · " + summary.rating}
          </p>
        </div>
      </section>

      <OpportunityTable opportunities={summary.opportunities.slice(0, 20)} strategy={strategy} />
    </div>
  );
}
