import Link from "next/link";
import type { OptionOpportunity, Strategy } from "@/lib/types";
import {
  formatCurrency,
  formatDelta,
  formatPercent,
} from "@/lib/format";

export function OpportunityTable({
  opportunities,
  strategy,
}: {
  opportunities: OptionOpportunity[];
  strategy: Strategy;
}) {
  if (opportunities.length === 0) {
    return (
      <div className="panel p-6 text-sm text-[var(--muted)]">
        No contracts matched the current filters. Loosen yield, delta, or OTM settings and run the screener again.
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--line)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
          <tr>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Strike</th>
            <th className="px-4 py-3">Expiration</th>
            <th className="px-4 py-3">DTE</th>
            <th className="px-4 py-3">Premium</th>
            <th className="px-4 py-3">Yield</th>
            <th className="px-4 py-3">Annualized</th>
            <th className="px-4 py-3">OTM</th>
            <th className="px-4 py-3">Delta</th>
            <th className="px-4 py-3">IV</th>
            <th className="px-4 py-3">OI</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((item) => (
            <tr key={item.contractSymbol} className="border-b border-[rgba(244,239,229,0.06)] align-top">
              <td className="px-4 py-4">
                <p className="font-semibold text-[var(--ink)]">{item.symbol}</p>
                <p className="max-w-[16rem] text-xs text-[var(--muted)]">{item.companyName}</p>
              </td>
              <td className="px-4 py-4 font-medium">{formatCurrency(item.strike)}</td>
              <td className="px-4 py-4">{item.expirationDate}</td>
              <td className="px-4 py-4">{item.dte}</td>
              <td className="px-4 py-4">
                <p>{formatCurrency(item.premium)}</p>
                <p className="text-xs text-[var(--muted)]">
                  {formatCurrency(item.premiumPerContract, 0)} / contract
                </p>
              </td>
              <td className="px-4 py-4 text-[var(--teal-700)]">{formatPercent(item.yieldPct)}</td>
              <td className="px-4 py-4 text-[var(--ink)]">
                {formatPercent(item.annualizedYieldPct)}
              </td>
              <td className="px-4 py-4">{formatPercent(item.otmPct)}</td>
              <td className="px-4 py-4">{formatDelta(item.delta)}</td>
              <td className="px-4 py-4">{formatPercent(item.impliedVolatilityPct)}</td>
              <td className="px-4 py-4">{item.openInterest ?? "—"}</td>
              <td className="px-4 py-4">
                <Link
                  href={`/${strategy}/${item.symbol.toLowerCase()}`}
                  className="inline-flex rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--teal-700)] hover:text-[var(--teal-700)]"
                >
                  View symbol
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
