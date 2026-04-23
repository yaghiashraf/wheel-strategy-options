import Link from "next/link";
import { ExternalLink } from "lucide-react";
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
      <div className="terminal-empty">
        <span>NO MATCHES</span>
        <strong>Adjust filters or run a broader universe scan.</strong>
      </div>
    );
  }

  return (
    <div className="terminal-table-shell">
      <div className="terminal-table-title">
        <span>Ranked Contracts</span>
        <strong>{opportunities.length} rows</strong>
      </div>
      <table className="terminal-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Underlying</th>
            <th>Contract</th>
            <th>Strike</th>
            <th>Exp</th>
            <th>DTE</th>
            <th>Bid/Ask</th>
            <th>Mid</th>
            <th>Yield</th>
            <th>Ann</th>
            <th>OTM</th>
            <th>Delta</th>
            <th>IV</th>
            <th>OI</th>
            <th>Score</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {opportunities.map((item, index) => (
            <tr key={item.contractSymbol}>
              <td className="muted-cell">#{index + 1}</td>
              <td>
                <div className="symbol-stack">
                  <strong>{item.symbol}</strong>
                  <span>{item.companyName}</span>
                </div>
              </td>
              <td className="mono-cell">{item.contractSymbol}</td>
              <td>{formatCurrency(item.strike)}</td>
              <td>{item.expirationDate}</td>
              <td>{item.dte}</td>
              <td className="mono-cell">
                {formatCurrency(item.bid)} / {formatCurrency(item.ask)}
              </td>
              <td>{formatCurrency(item.mark)}</td>
              <td className="positive-cell">{formatPercent(item.yieldPct)}</td>
              <td>{formatPercent(item.annualizedYieldPct)}</td>
              <td>{formatPercent(item.otmPct)}</td>
              <td>{formatDelta(item.delta)}</td>
              <td>{formatPercent(item.impliedVolatilityPct)}</td>
              <td>{item.openInterest ?? "-"}</td>
              <td>
                <span className="score-badge">{item.score}</span>
              </td>
              <td>
                <Link
                  href={`/${strategy}/${item.symbol.toLowerCase()}`}
                  className="terminal-row-link"
                  aria-label={`Open ${item.symbol}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
