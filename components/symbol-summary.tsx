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
      <section className="hero-panel">
        <div className="max-w-4xl">
          <p className="section-kicker">{titleCase(strategy)}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[var(--sand)] md:text-5xl">
            {summary.companyName} ({summary.symbol}) opportunities ranked for the wheel.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[rgba(255,248,235,0.74)]">
            {summary.sector} · {summary.industry}. This page mirrors the symbol landing pages on the reference site, but the data is computed from Alpaca option contracts and live snapshots.
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
            {formatCompactNumber(summary.marketCap)} · {summary.rating}
          </p>
        </div>
      </section>

      <OpportunityTable opportunities={summary.opportunities.slice(0, 20)} strategy={strategy} />
    </div>
  );
}
