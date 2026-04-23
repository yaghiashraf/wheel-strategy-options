"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { OptionOpportunity, Strategy } from "@/lib/types";
import { OpportunityTable } from "@/components/opportunity-table";
import type { UniverseName } from "@/lib/universe";

type StrategyResponse = {
  generatedAt: string;
  strategy: Strategy;
  opportunities: OptionOpportunity[];
};

type UniverseResponse = {
  name: UniverseName;
  label: string;
  symbols: string[];
  count: number;
  source: string;
};

type ScanProgress = {
  completed: number;
  total: number;
  symbolsScanned: number;
  totalSymbols: number;
};

const universeOptions: Array<{ value: UniverseName | "custom"; label: string }> = [
  { value: "dow", label: "Dow 30" },
  { value: "sp500", label: "S&P 500" },
  { value: "core", label: "Core" },
  { value: "custom", label: "Custom" },
];

function parseSymbols(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[,\s]+/)
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean),
    ),
  );
}

function chunkSymbols(symbols: string[], size: number) {
  const chunks: string[][] = [];
  for (let index = 0; index < symbols.length; index += size) {
    chunks.push(symbols.slice(index, index + size));
  }

  return chunks;
}

function rankOpportunities(opportunities: OptionOpportunity[]) {
  return opportunities.sort(
    (left, right) => right.score - left.score || right.yieldPct - left.yieldPct,
  );
}

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
  const scanIdRef = useRef(0);
  const [universeMode, setUniverseMode] = useState<UniverseName | "custom">("dow");
  const [symbols, setSymbols] = useState(defaultSymbols);
  const [minDte, setMinDte] = useState("7");
  const [maxDte, setMaxDte] = useState("45");
  const [minYield, setMinYield] = useState(strategy === "covered-call" ? "0.4" : "0.45");
  const [maxDelta, setMaxDelta] = useState(strategy === "covered-call" ? "0.42" : "0.38");
  const [minOtm, setMinOtm] = useState(strategy === "covered-call" ? "1" : "2");
  const [batchSize, setBatchSize] = useState("18");
  const [contractLimit, setContractLimit] = useState("50");
  const [rows, setRows] = useState<OptionOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [universeLabel, setUniverseLabel] = useState("Dow 30");
  const [universeCount, setUniverseCount] = useState(30);
  const [progress, setProgress] = useState<ScanProgress>({
    completed: 0,
    total: 0,
    symbolsScanned: 0,
    totalSymbols: 0,
  });

  async function loadUniverseSymbols(mode: UniverseName | "custom") {
    if (mode === "custom") {
      const customSymbols = parseSymbols(symbols);
      return {
        label: "Custom",
        symbols: customSymbols,
        source: "manual",
      };
    }

    const response = await fetch(`/api/universe?name=${mode}`, { cache: "no-store" });
    const payload = (await response.json()) as UniverseResponse | { error: string };
    if (!response.ok || "error" in payload) {
      throw new Error("error" in payload ? payload.error : "Failed to load universe.");
    }

    return payload;
  }

  async function loadData(nextMode = universeMode) {
    const scanId = scanIdRef.current + 1;
    scanIdRef.current = scanId;
    setLoading(true);
    setError(null);
    setRows([]);
    setProgress({
      completed: 0,
      total: 0,
      symbolsScanned: 0,
      totalSymbols: 0,
    });

    try {
      const universe = await loadUniverseSymbols(nextMode);
      const selectedSymbols = universe.symbols;
      const chunks = chunkSymbols(selectedSymbols, Math.max(1, Number(batchSize) || 18));
      const merged = new Map<string, OptionOpportunity>();

      setUniverseLabel(universe.label);
      setUniverseCount(selectedSymbols.length);
      setProgress({
        completed: 0,
        total: chunks.length,
        symbolsScanned: 0,
        totalSymbols: selectedSymbols.length,
      });

      for (const [index, chunk] of chunks.entries()) {
        if (scanIdRef.current !== scanId) {
          return;
        }

        const params = new URLSearchParams({
          strategy,
          symbols: chunk.join(","),
          minDte,
          maxDte,
          minYield,
          maxDelta,
          minOtm,
          maxResults: "20",
          contractLimit,
        });

        const response = await fetch(`/api/screener?${params.toString()}`, {
          cache: "no-store",
        });

        const payload = (await response.json()) as StrategyResponse | { error: string };
        if (!response.ok || "error" in payload) {
          throw new Error("error" in payload ? payload.error : "Failed to load screener.");
        }

        for (const opportunity of payload.opportunities) {
          merged.set(opportunity.contractSymbol, opportunity);
        }

        const nextRows = rankOpportunities(Array.from(merged.values())).slice(0, 80);
        setRows(nextRows);
        setProgress({
          completed: index + 1,
          total: chunks.length,
          symbolsScanned: Math.min(selectedSymbols.length, (index + 1) * chunk.length),
          totalSymbols: selectedSymbols.length,
        });
      }

      setLastUpdated(new Date().toISOString());
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Failed to load screener.");
    } finally {
      if (scanIdRef.current === scanId) {
        setLoading(false);
      }
    }
  }

  function stopScan() {
    scanIdRef.current += 1;
    setLoading(false);
  }

  useEffect(() => {
    loadData("dow");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategy]);

  const progressPct =
    progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
  const runLabel = loading ? "SCAN" : universeMode === "sp500" ? "SCAN SPX" : "SCAN";
  const bestScore = rows[0]?.score ?? 0;
  const topYield = rows[0]?.yieldPct ?? 0;
  const avgYield =
    rows.length > 0 ? rows.reduce((sum, row) => sum + row.yieldPct, 0) / rows.length : 0;

  return (
    <div className="terminal-layout">
      <section className="desk-header">
        <div>
          <p className="terminal-symbol">{title}</p>
          <h1>{description}</h1>
        </div>
        <div className="scan-stat-grid">
          <div className="scan-stat">
            <span>Universe</span>
            <strong>{universeLabel}</strong>
          </div>
          <div className="scan-stat">
            <span>Symbols</span>
            <strong>{universeCount}</strong>
          </div>
          <div className="scan-stat">
            <span>Matches</span>
            <strong>{rows.length}</strong>
          </div>
          <div className="scan-stat">
            <span>Best Score</span>
            <strong>{bestScore}</strong>
          </div>
          <div className="scan-stat">
            <span>Top Yield</span>
            <strong>{topYield.toFixed(2)}%</strong>
          </div>
          <div className="scan-stat">
            <span>Avg Yield</span>
            <strong>{avgYield.toFixed(2)}%</strong>
          </div>
        </div>
      </section>

      <section className="terminal-control-panel">
        <div className="terminal-control-row">
          <div className="segmented-control">
            {universeOptions.map((option) => (
              <button
                key={option.value}
                className={universeMode === option.value ? "segment-button active" : "segment-button"}
                onClick={() => {
                  setUniverseMode(option.value);
                  if (option.value !== "custom") {
                    setUniverseLabel(option.label);
                  }
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="terminal-actions">
            {loading ? (
              <button onClick={stopScan} className="secondary-button compact-button" type="button">
                <Pause className="h-4 w-4" />
                HALT
              </button>
            ) : null}
            <button onClick={() => loadData()} className="primary-button compact-button" disabled={loading} type="button">
              {loading ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {runLabel}
            </button>
          </div>
        </div>

        <div className="terminal-filter-grid">
          <label className="field terminal-symbol-input">
            <span className="field-label">Symbols</span>
            <input
              value={symbols}
              onChange={(event) => setSymbols(event.target.value)}
              className="field-input"
              placeholder="AAPL,MSFT,NVDA"
            />
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
          <label className="field">
            <span className="field-label">Batch Size</span>
            <input value={batchSize} onChange={(event) => setBatchSize(event.target.value)} className="field-input" />
          </label>
          <label className="field">
            <span className="field-label">Contracts/Symbol</span>
            <input
              value={contractLimit}
              onChange={(event) => setContractLimit(event.target.value)}
              className="field-input"
            />
          </label>
        </div>

        <div className="terminal-progress-row">
          <div className="progress-track">
            <div style={{ width: `${progressPct}%` }} />
          </div>
          <div className="terminal-run-meta">
            <span>
              {progress.total > 0
                ? `${progress.completed}/${progress.total} BATCHES`
                : "IDLE"}
            </span>
            <span>{progress.symbolsScanned}/{progress.totalSymbols} SYM</span>
            <span>{progressPct}%</span>
          {lastUpdated ? (
            <span>
              {new Date(lastUpdated).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
            </span>
          ) : null}
          </div>
        </div>
      </section>

      {error ? (
        <div className="terminal-alert">
          <SlidersHorizontal className="h-4 w-4" />
          {error}
        </div>
      ) : null}
      {!error ? <OpportunityTable opportunities={rows} strategy={strategy} /> : null}
    </div>
  );
}
