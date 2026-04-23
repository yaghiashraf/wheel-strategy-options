"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DiscoverPayload } from "@/lib/types";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "@/lib/format";

export function DiscoverBoard() {
  const [data, setData] = useState<DiscoverPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/discover", { cache: "no-store" });
        const payload = (await response.json()) as DiscoverPayload | { error: string };

        if (!response.ok || "error" in payload) {
          throw new Error("error" in payload ? payload.error : "Failed to load discover feed.");
        }

        if (!cancelled) {
          setData(payload);
        }
      } catch (issue) {
        if (!cancelled) {
          setError(issue instanceof Error ? issue.message : "Unable to load discover feed.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="panel p-6 text-sm text-[var(--muted)]">Loading live ideas from Alpaca...</div>;
  }

  if (error) {
    return <div className="panel p-6 text-sm text-[var(--rose)]">{error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel p-5 md:p-6">
          <p className="section-kicker">Covered Calls</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
            Shortlist covered calls with live option snapshots.
          </h3>
          <p className="terminal-note mt-3">
            Start from names you can own comfortably, then optimize premium capture without overreaching on delta or giving away too much upside.
          </p>
          <div className="mt-5 space-y-3">
            {data.coveredCalls.slice(0, 4).map((item) => (
              <div key={item.contractSymbol} className="premium-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {item.symbol} {formatCurrency(item.strike)} exp {item.expirationDate}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Premium {formatCurrency(item.premium)} | Yield {formatPercent(item.yieldPct)} | Delta{" "}
                      {item.delta?.toFixed(2) ?? "—"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--mint-soft)] px-3 py-1 text-xs font-semibold text-[var(--teal-700)]">
                    Score {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/covered-call-screener" className="cta-link mt-5">
            Open call screener
          </Link>
        </section>

        <section className="panel p-5 md:p-6">
          <p className="section-kicker">Cash-Secured Puts</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
            Rank put sales by yield, distance, and delta.
          </h3>
          <p className="terminal-note mt-3">
            Price the entry you actually want. The best setups balance assignment quality, premium efficiency, and enough distance to avoid sloppy fills.
          </p>
          <div className="mt-5 space-y-3">
            {data.cashSecuredPuts.slice(0, 4).map((item) => (
              <div key={item.contractSymbol} className="premium-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {item.symbol} {formatCurrency(item.strike)} exp {item.expirationDate}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Premium {formatCurrency(item.premium)} | Yield {formatPercent(item.yieldPct)} | OTM {formatPercent(item.otmPct)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--gold-soft)] px-3 py-1 text-xs font-semibold text-[var(--rust)]">
                    Score {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/cash-secured-put-screener" className="cta-link mt-5">
            Open put screener
          </Link>
        </section>

        <section className="panel p-5 md:p-6">
          <p className="section-kicker">Stock Quality</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
            Blend stock quality with wheel suitability.
          </h3>
          <p className="terminal-note mt-3">
            Treat this as the ownership filter. If the stock fails here, the option premium should not rescue the idea.
          </p>
          <div className="mt-5 space-y-3">
            {data.fundamentals.slice(0, 4).map((item) => (
              <div key={item.symbol} className="premium-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">{item.symbol}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {item.sector} | 20D avg vol {formatCompactNumber(item.averageVolume)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      30D move {formatPercent(item.thirtyDayChangePct ?? null)} | 50D trend {formatPercent(item.distanceFromFiftyDayPct ?? null)} | Realized vol {formatPercent(item.realizedVolatilityPct ?? null)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--night)] px-3 py-1 text-xs font-semibold text-[var(--sand)]">
                    Wheel {item.wheelScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/fundamental-screener" className="cta-link mt-5">
            Open stock screener
          </Link>
        </section>
      </div>

      <div className="panel flex flex-wrap items-center justify-between gap-4 p-5 text-sm text-[var(--muted)]">
        <p>
          Live universe: {data.universe.join(", ")}. Generated{" "}
          {new Date(data.generatedAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          .
        </p>
        <Link href="/tools" className="cta-link">
          Open wheel calculators
        </Link>
      </div>
    </div>
  );
}
