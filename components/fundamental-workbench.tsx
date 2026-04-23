"use client";

import { useEffect, useState } from "react";
import { formatCompactNumber, formatCurrency, formatPercent } from "@/lib/format";
import type { FundamentalRow } from "@/lib/types";

type FundamentalsResponse = {
  generatedAt: string;
  rows: FundamentalRow[];
};

export function FundamentalWorkbench({ defaultSymbols }: { defaultSymbols: string }) {
  const [symbols, setSymbols] = useState(defaultSymbols);
  const [rows, setRows] = useState<FundamentalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/fundamentals?symbols=${encodeURIComponent(symbols)}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as FundamentalsResponse | { error: string };
      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Failed to load screener.");
      }

      setRows(payload.rows);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Failed to load fundamentals.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-6">
      <section className="hero-panel">
        <div className="max-w-3xl">
          <p className="section-kicker">Wheel Stock Screener</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[var(--sand)] md:text-5xl">
            Find wheel candidates you would actually be willing to own through assignment.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[rgba(255,248,235,0.74)]">
            This screen now runs entirely on Alpaca market data plus a curated company universe. It ranks names by liquidity, price trend, and realized volatility instead of relying on a brittle public fundamentals scraper.
          </p>
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <label className="field flex-1">
            <span className="field-label">Symbols</span>
            <input value={symbols} onChange={(event) => setSymbols(event.target.value)} className="field-input" />
          </label>
          <button onClick={loadData} className="primary-button" type="button">
            Run stock screener
          </button>
        </div>
      </section>

      {loading ? <div className="panel p-6 text-sm text-[var(--muted)]">Loading fundamentals...</div> : null}
      {error ? <div className="panel p-6 text-sm text-[var(--rose)]">{error}</div> : null}

      {!loading && !error ? (
        <div className="table-shell">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Market Cap</th>
                <th className="px-4 py-3">30D Move</th>
                <th className="px-4 py-3">50D Trend</th>
                <th className="px-4 py-3">200D Trend</th>
                <th className="px-4 py-3">20D Avg Vol</th>
                <th className="px-4 py-3">Realized Vol</th>
                <th className="px-4 py-3">Wheel Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.symbol} className="border-b border-[rgba(17,24,39,0.06)]">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-[var(--ink)]">{item.symbol}</p>
                    <p className="max-w-[16rem] text-xs text-[var(--muted)]">
                      {item.companyName} · {item.sector}
                    </p>
                  </td>
                  <td className="px-4 py-4">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-4">{formatCompactNumber(item.marketCap)}</td>
                  <td className="px-4 py-4">{formatPercent(item.thirtyDayChangePct ?? null)}</td>
                  <td className="px-4 py-4">{formatPercent(item.distanceFromFiftyDayPct ?? null)}</td>
                  <td className="px-4 py-4">{formatPercent(item.distanceFromTwoHundredDayPct ?? null)}</td>
                  <td className="px-4 py-4">{formatCompactNumber(item.averageVolume)}</td>
                  <td className="px-4 py-4">{formatPercent(item.realizedVolatilityPct ?? null)}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-[var(--night)] px-3 py-2 text-xs font-semibold text-[var(--sand)]">
                      {item.wheelScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
