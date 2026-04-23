"use client";

import { useState } from "react";
import { formatCurrency, formatPercent } from "@/lib/format";
import { TOOL_CARDS } from "@/lib/universe";

export function CalculatorLab() {
  const [premium, setPremium] = useState("2.40");
  const [strike, setStrike] = useState("100");
  const [stockCost, setStockCost] = useState("96");
  const [contracts, setContracts] = useState("3");
  const [dte, setDte] = useState("30");

  const premiumValue = Number(premium);
  const strikeValue = Number(strike);
  const stockCostValue = Number(stockCost);
  const contractCount = Number(contracts);
  const dteValue = Number(dte);

  const premiumYield = strikeValue > 0 ? (premiumValue / strikeValue) * 100 : 0;
  const annualizedYield = dteValue > 0 ? premiumYield * (365 / dteValue) : 0;
  const cashRequired = strikeValue * 100 * contractCount;
  const putBreakeven = strikeValue - premiumValue;
  const coveredCallMaxProfit =
    stockCostValue > 0 ? (((strikeValue - stockCostValue) + premiumValue) / stockCostValue) * 100 : 0;

  return (
    <div className="grid gap-6">
      <section className="hero-panel subtle-grid">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-3xl">
            <span className="eyebrow-chip">Wheel Calculators</span>
            <h1 className="display-title mt-5 text-4xl font-semibold leading-[0.96] text-[var(--sand)] md:text-6xl">
              Quick option math for yield, collateral, breakeven, and max-profit checks.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[rgba(255,248,235,0.74)]">
              Instead of scattering utility pages across the product, this desk keeps the core wheel calculations in one focused workbench you can use alongside the live screeners.
            </p>
          </div>
          <div className="dashboard-strip">
            <div className="hero-stat">
              <p className="hero-stat-label">Primary use</p>
              <p className="hero-stat-value">Check yield before execution</p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-label">Coverage</p>
              <p className="hero-stat-value">Put breakeven, collateral, max profit</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="field panel p-4">
          <span className="field-label">Premium per share</span>
          <input value={premium} onChange={(event) => setPremium(event.target.value)} className="field-input" />
        </label>
        <label className="field panel p-4">
          <span className="field-label">Strike</span>
          <input value={strike} onChange={(event) => setStrike(event.target.value)} className="field-input" />
        </label>
        <label className="field panel p-4">
          <span className="field-label">Stock cost basis</span>
          <input value={stockCost} onChange={(event) => setStockCost(event.target.value)} className="field-input" />
        </label>
        <label className="field panel p-4">
          <span className="field-label">Contracts</span>
          <input value={contracts} onChange={(event) => setContracts(event.target.value)} className="field-input" />
        </label>
        <label className="field panel p-4">
          <span className="field-label">Days to expiration</span>
          <input value={dte} onChange={(event) => setDte(event.target.value)} className="field-input" />
        </label>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="metric-card">
          <p className="metric-label">Premium Yield</p>
          <p className="metric-value">{formatPercent(premiumYield)}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Annualized Yield</p>
          <p className="metric-value">{formatPercent(annualizedYield)}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Cash Required</p>
          <p className="metric-value">{formatCurrency(cashRequired, 0)}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Put Breakeven</p>
          <p className="metric-value">{formatCurrency(putBreakeven)}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="panel p-5">
          <p className="section-kicker">Covered Call Max Profit</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--ink)]">{formatPercent(coveredCallMaxProfit)}</p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            This assumes assignment at the strike and includes the option premium in the total return.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {TOOL_CARDS.map((tool) => (
            <div key={tool.title} className="panel p-5">
              <p className="text-lg font-semibold text-[var(--ink)]">{tool.title}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{tool.description}</p>
              <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.04)] px-4 py-3 font-mono text-sm text-[var(--sand)]">
                {tool.formula}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
