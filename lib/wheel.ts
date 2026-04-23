import { average, clamp, ratingFromScore } from "@/lib/format";
import { getCompanyMetadata } from "@/lib/company-metadata";
import {
  extractOptionDelta,
  extractOptionIv,
  extractOptionQuote,
  extractOptionTradePrice,
  extractStockPrice,
  getOptionContracts,
  getOptionSnapshots,
  getStockSnapshots,
} from "@/lib/alpaca";
import { getFundamentalRows } from "@/lib/yahoo";
import type {
  DiscoverPayload,
  FundamentalRow,
  OptionOpportunity,
  ScreenerFilters,
  Strategy,
  StrategySummary,
} from "@/lib/types";
import { DEFAULT_SYMBOLS } from "@/lib/universe";

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days: number) {
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

function daysToExpiration(expirationDate: string) {
  const now = new Date();
  const expiry = new Date(`${expirationDate}T16:00:00-04:00`);
  const diff = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function midpoint(bid: number | null, ask: number | null) {
  if (bid && ask) {
    return Number(((bid + ask) / 2).toFixed(2));
  }

  return bid ?? ask ?? null;
}

function normalizeVolatility(value: number | null) {
  if (value === null) {
    return null;
  }

  return value <= 1 ? value * 100 : value;
}

function scoreOpportunity(opportunity: OptionOpportunity) {
  const targetDelta = opportunity.strategy === "covered-call" ? 0.3 : 0.25;
  const yieldScore = clamp(opportunity.yieldPct * 11, 0, 35);
  const annualizedScore = clamp(opportunity.annualizedYieldPct / 2.2, 0, 20);
  const deltaScore =
    opportunity.delta === null
      ? 4
      : clamp(18 - Math.abs(Math.abs(opportunity.delta) - targetDelta) * 45, 0, 18);
  const otmScore = clamp(opportunity.otmPct * 1.5, 0, 12);
  const liquidityScore = opportunity.openInterest
    ? clamp(Math.log10(opportunity.openInterest + 1) * 6, 0, 10)
    : 2;
  const ivScore =
    opportunity.impliedVolatilityPct === null
      ? 4
      : clamp(opportunity.impliedVolatilityPct / 5, 0, 10);

  return Number(
    clamp(yieldScore + annualizedScore + deltaScore + otmScore + liquidityScore + ivScore, 0, 100).toFixed(1),
  );
}

export async function getStrategyIdeas(
  strategy: Strategy,
  filters: Partial<ScreenerFilters> = {},
) {
  const normalizedSymbols = Array.from(
    new Set((filters.symbols?.length ? filters.symbols : DEFAULT_SYMBOLS).map((symbol) => symbol.toUpperCase())),
  );

  const minDte = filters.minDte ?? 7;
  const maxDte = filters.maxDte ?? 45;
  const minYield = filters.minYield ?? 0;
  const maxDelta = filters.maxDelta ?? 0.45;
  const minOtm = filters.minOtm ?? 0;
  const maxResults = filters.maxResults ?? 30;

  const stockSnapshots = await getStockSnapshots(normalizedSymbols);
  const companies = await getFundamentalRows(normalizedSymbols);
  const companyBySymbol = new Map(companies.map((item) => [item.symbol, item]));

  const contractBatches = await Promise.all(
    normalizedSymbols.map(async (symbol) => {
      const stockPrice = extractStockPrice(stockSnapshots[symbol]);
      if (!stockPrice) {
        return [];
      }

      const strikePriceGte =
        strategy === "covered-call" ? stockPrice * 0.98 : stockPrice * 0.72;
      const strikePriceLte =
        strategy === "covered-call" ? stockPrice * 1.22 : stockPrice * 1.02;

      const contracts = await getOptionContracts({
        underlyingSymbol: symbol,
        type: strategy === "covered-call" ? "call" : "put",
        expirationDateGte: addDays(Math.max(0, minDte - 1)),
        expirationDateLte: addDays(maxDte),
        strikePriceGte,
        strikePriceLte,
        limit: 220,
      });

      return contracts.map((contract) => ({
        contract,
        stockPrice,
        underlyingSymbol: symbol,
      }));
    }),
  );

  const allContracts = contractBatches.flat();
  const snapshots = await getOptionSnapshots(allContracts.map((item) => item.contract.symbol));

  const opportunities = allContracts
    .map(({ contract, stockPrice, underlyingSymbol }) => {
      const snapshot = snapshots[contract.symbol];
      const { bid, ask } = extractOptionQuote(snapshot);
      const mark = midpoint(bid, ask);
      const premium = Number((mark ?? extractOptionTradePrice(snapshot) ?? Number(contract.close_price ?? 0)).toFixed(2));
      const strike = Number(contract.strike_price);
      const dte = daysToExpiration(contract.expiration_date);
      const delta = extractOptionDelta(snapshot);
      const iv = normalizeVolatility(extractOptionIv(snapshot));
      const collateral = strike * 100;
      const yieldPct = premium > 0 ? (premium / strike) * 100 : 0;
      const annualizedYieldPct = dte > 0 ? yieldPct * (365 / dte) : 0;
      const otmPct =
        strategy === "covered-call"
          ? ((strike - stockPrice) / stockPrice) * 100
          : ((stockPrice - strike) / stockPrice) * 100;
      const assignmentProbabilityPct = delta === null ? null : Math.abs(delta) * 100;
      const baseSymbol = contract.underlying_symbol ?? underlyingSymbol;
      const row: OptionOpportunity = {
        symbol: baseSymbol,
        companyName: companyBySymbol.get(baseSymbol)?.companyName ??
          getCompanyMetadata(baseSymbol).companyName,
        contractSymbol: contract.symbol,
        strategy,
        expirationDate: contract.expiration_date,
        dte,
        strike,
        stockPrice,
        premium,
        premiumPerContract: premium * 100,
        yieldPct,
        annualizedYieldPct,
        otmPct,
        delta,
        impliedVolatilityPct: iv,
        bid,
        ask,
        mark,
        openInterest: contract.open_interest ? Number(contract.open_interest) : null,
        breakeven: strategy === "covered-call" ? stockPrice - premium : strike - premium,
        collateral,
        assignmentProbabilityPct,
        score: 0,
      };

      return {
        ...row,
        symbol: baseSymbol,
        companyName: companyBySymbol.get(baseSymbol)?.companyName ?? getCompanyMetadata(baseSymbol).companyName,
      };
    })
    .filter((item) => {
      if (!item.symbol) return false;
      if (item.dte < minDte || item.dte > maxDte) return false;
      if (item.yieldPct < minYield) return false;
      if (item.otmPct < minOtm) return false;
      if (item.delta !== null && Math.abs(item.delta) > maxDelta) return false;
      if (strategy === "covered-call" && item.strike < item.stockPrice * 0.985) return false;
      if (strategy === "cash-secured-put" && item.strike > item.stockPrice * 1.02) return false;
      return item.premium > 0.05;
    })
    .map((item) => ({
      ...item,
      score: scoreOpportunity(item),
    }))
    .sort((left, right) => right.score - left.score || right.yieldPct - left.yieldPct)
    .slice(0, maxResults);

  return {
    generatedAt: new Date().toISOString(),
    strategy,
    filters: {
      symbols: normalizedSymbols,
      minDte,
      maxDte,
      minYield,
      maxDelta,
      minOtm,
      maxResults,
    },
    opportunities,
  };
}

export async function getFundamentalIdeas(symbols: string[]) {
  const rows = await getFundamentalRows(symbols);

  return rows.sort((left, right) => right.wheelScore - left.wheelScore);
}

export async function getDiscoverPayload(): Promise<DiscoverPayload> {
  const universe = DEFAULT_SYMBOLS;
  const [coveredCalls, cashSecuredPuts, fundamentals] = await Promise.all([
    getStrategyIdeas("covered-call", {
      symbols: universe,
      minDte: 7,
      maxDte: 45,
      minYield: 0.4,
      maxDelta: 0.42,
      minOtm: 1,
      maxResults: 8,
    }),
    getStrategyIdeas("cash-secured-put", {
      symbols: universe,
      minDte: 7,
      maxDte: 45,
      minYield: 0.45,
      maxDelta: 0.38,
      minOtm: 2,
      maxResults: 8,
    }),
    getFundamentalIdeas(universe),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    universe,
    coveredCalls: coveredCalls.opportunities,
    cashSecuredPuts: cashSecuredPuts.opportunities,
    fundamentals: fundamentals.slice(0, 8),
  };
}

export async function getStrategySummary(
  strategy: Strategy,
  symbol: string,
): Promise<StrategySummary> {
  const upperSymbol = symbol.toUpperCase();
  const [ideas, fundamentals] = await Promise.all([
    getStrategyIdeas(strategy, {
      symbols: [upperSymbol],
      minDte: 7,
      maxDte: 60,
      minYield: 0,
      maxDelta: 0.55,
      minOtm: 0,
      maxResults: 30,
    }),
    getFundamentalRows([upperSymbol]),
  ]);

  const company = fundamentals[0] as FundamentalRow | undefined;
  const opportunities = ideas.opportunities.filter((row) => row.symbol === upperSymbol);
  const metadata = getCompanyMetadata(upperSymbol);
  const averageYieldPct = average(opportunities.map((row) => row.yieldPct));
  const maximumYieldPct = Math.max(...opportunities.map((row) => row.yieldPct), 0);
  const averageIvPct = average(opportunities.map((row) => row.impliedVolatilityPct));
  const peakIvPct = Math.max(...opportunities.map((row) => row.impliedVolatilityPct ?? 0), 0);

  return {
    symbol: upperSymbol,
    companyName: company?.companyName ?? metadata.companyName,
    sector: company?.sector ?? metadata.sector,
    industry: company?.industry ?? metadata.industry,
    stockPrice: company?.price ?? opportunities[0]?.stockPrice ?? null,
    marketCap: company?.marketCap ?? (metadata.marketCapBillions ? metadata.marketCapBillions * 1_000_000_000 : null),
    rating: ratingFromScore(company?.wheelScore ?? 55),
    averageYieldPct,
    maximumYieldPct,
    averageIvPct,
    peakIvPct,
    availableContracts: opportunities.length,
    opportunities,
  };
}

export function getDefaultDateRange() {
  return {
    from: getTodayIso(),
    to: addDays(45),
  };
}
