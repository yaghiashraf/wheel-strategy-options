"use client";

import { useEffect, useState } from "react";
import type { OptionOpportunity, Strategy } from "@/lib/types";
import { OpportunityTable } from "@/components/opportunity-table";

type StrategyResponse = {
  generatedAt: string;
  strategy: Strategy;
  opportunities: OptionOpportunity[];
};

export function StrategyWorkbench({
  strategy,
  defaultSymbols,
  title,
  description,
}: {
  strategy: Strategy;
  defaultSymbols: string;
  title: string;
  description: string;
}) {
  const [symbols, setSymbols] = useState(defaultSymbols);
  const [minDte, setMinDte] = useState("7");
  const [maxDte, setMaxDte] = useState("45");
  const [minYield, setMinYield] = useState(strategy === "covered-call" ? "0.4" : "0.45");
  const [maxDelta, setMaxDelta] = useState(strategy === "covered-call" ? "0.42" : "0.38");
  const [minOtm, setMinOtm] = useState(strategy === "covered-call" ? "1" : "2");
  const [rows, setRows] = useState<OptionOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        strategy,
        symbols,
        minDte,
        maxDte,
        minYield,
        maxDelta,
        minOtm,
        maxResults: "40",
      });

      const response = await fetch(`/api/screener?${params.toString()}`, {
        cache: "no-store",
      });

      const payload = (await response.json()) as StrategyResponse | { error: string };
      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Failed to load screener.");
      }

      setRows(payload.opportunities);
      setLastUpdated(payload.generatedAt);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Failed to load screener.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategy]);

  return (
    <div className="grid gap-6">
      <section className="hero-panel">
        <div className="max-w-3xl">
          <p className="section-kicker">{title}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[var(--sand)] md:text-5xl">
            {description}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[rgba(255,248,235,0.74)]">
            Alpaca handles the option chain, quotes, and greeks. This workbench ranks contracts by raw yield, annualized yield, OTM distance, delta fit, and liquidity.
          </p>
        </div>
      </section>

      <section className="panel p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <label className="field">
            <span className="field-label">Symbols</span>
            <input value={symbols} onChange={(event) => setSymbols(event.target.value)} className="field-input" />
          </label>
          <label className="field">
            <span className="field-label">Min DTE</span>
            <input value={minDte} onChange={(event) => setMinDte(event.target.value)} className="field-input" />
          </label>
          <label className="field">
            <span className="field-label">Max DTE</span>
            <input value={maxDte} onChange={(event) => setMaxDte(event.target.value)} className="field-input" />
          </label>
          <label className="field">
            <span className="field-label">Min Yield %</span>
            <input value={minYield} onChange={(event) => setMinYield(event.target.value)} className="field-input" />
          </label>
          <label className="field">
            <span className="field-label">Max |Delta|</span>
            <input value={maxDelta} onChange={(event) => setMaxDelta(event.target.value)} className="field-input" />
          </label>
          <label className="field">
            <span className="field-label">Min OTM %</span>
            <input value={minOtm} onChange={(event) => setMinOtm(event.target.value)} className="field-input" />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button onClick={loadData} className="primary-button" type="button">
            Run screener
          </button>
          {lastUpdated ? (
            <p className="text-sm text-[var(--muted)]">
              Updated {new Date(lastUpdated).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          ) : null}
        </div>
      </section>

      {loading ? <div className="panel p-6 text-sm text-[var(--muted)]">Loading options data...</div> : null}
      {error ? <div className="panel p-6 text-sm text-[var(--rose)]">{error}</div> : null}
      {!loading && !error ? <OpportunityTable opportunities={rows} strategy={strategy} /> : null}
    </div>
  );
}
