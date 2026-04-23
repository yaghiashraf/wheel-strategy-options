import { clamp } from "@/lib/format";
import { getCompanyMetadata } from "@/lib/company-metadata";
import { getDailyBars, getStockSnapshots, extractStockPrice } from "@/lib/alpaca";
import type { FundamentalRow } from "@/lib/types";

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function computeRealizedVolatilityPct(closes: number[]) {
  if (closes.length < 21) {
    return null;
  }

  const returns = closes.slice(1).map((close, index) => Math.log(close / closes[index]));
  const mean = average(returns);
  const variance = average(returns.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance) * Math.sqrt(252) * 100;
}

function trailingAverage(values: number[], length: number) {
  if (values.length < length) {
    return null;
  }

  return average(values.slice(-length));
}

function scoreFundamentalRow(row: Omit<FundamentalRow, "wheelScore">) {
  let score = 50;

  const averageVolume = row.averageVolume ?? 0;
  if (averageVolume > 20_000_000) score += 16;
  else if (averageVolume > 8_000_000) score += 12;
  else if (averageVolume > 3_000_000) score += 8;
  else if (averageVolume > 1_000_000) score += 4;
  else score -= 8;

  const realizedVolatility = row.realizedVolatilityPct ?? 0;
  if (realizedVolatility >= 18 && realizedVolatility <= 48) score += 16;
  else if (realizedVolatility >= 12 && realizedVolatility <= 60) score += 10;
  else if (realizedVolatility > 75) score -= 8;
  else score -= 2;

  const distance50 = row.distanceFromFiftyDayPct ?? 0;
  const distance200 = row.distanceFromTwoHundredDayPct ?? 0;
  if (distance50 > 0) score += 6;
  if (distance200 > 0) score += 8;
  if (distance50 < -8) score -= 6;
  if (distance200 < -12) score -= 8;

  const thirtyDayChange = row.thirtyDayChangePct ?? 0;
  if (thirtyDayChange >= -5 && thirtyDayChange <= 15) score += 10;
  else if (thirtyDayChange > 20) score -= 2;
  else if (thirtyDayChange < -12) score -= 10;

  if (row.sector === "ETF") score += 8;
  if (row.marketCap && row.marketCap > 50_000_000_000) score += 8;

  return clamp(score, 0, 100);
}

export async function getFundamentalRows(symbols: string[]) {
  const upperSymbols = symbols.map((symbol) => symbol.toUpperCase());
  const stockSnapshots = await getStockSnapshots(upperSymbols);

  const end = new Date().toISOString().slice(0, 10);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 420);
  const start = startDate.toISOString().slice(0, 10);

  const barsBySymbol = await getDailyBars(upperSymbols, start, end);

  return upperSymbols
    .map((symbol) => {
      const metadata = getCompanyMetadata(symbol);
      const bars = barsBySymbol[symbol] ?? [];
      const closes = bars.map((bar) => bar.c);
      const volumes = bars.map((bar) => bar.v);
      const price = extractStockPrice(stockSnapshots[symbol]) ?? closes.at(-1) ?? null;
      const fiftyDayAverage = trailingAverage(closes, 50);
      const twoHundredDayAverage = trailingAverage(closes, 200);
      const averageVolume = trailingAverage(volumes, 20);
      const realizedVolatilityPct = computeRealizedVolatilityPct(closes.slice(-31));
      const pastClose = closes.length > 21 ? closes[closes.length - 22] : null;
      const thirtyDayChangePct =
        price && pastClose ? ((price - pastClose) / pastClose) * 100 : null;
      const distanceFromFiftyDayPct =
        price && fiftyDayAverage ? ((price - fiftyDayAverage) / fiftyDayAverage) * 100 : null;
      const distanceFromTwoHundredDayPct =
        price && twoHundredDayAverage ? ((price - twoHundredDayAverage) / twoHundredDayAverage) * 100 : null;

      const baseRow: Omit<FundamentalRow, "wheelScore"> = {
        symbol,
        companyName: metadata.companyName,
        sector: metadata.sector,
        industry: metadata.industry,
        price,
        marketCap: metadata.marketCapBillions ? metadata.marketCapBillions * 1_000_000_000 : null,
        trailingPe: null,
        forwardPe: null,
        beta: null,
        dividendYieldPct: null,
        grossMarginPct: null,
        profitMarginPct: null,
        returnOnEquityPct: null,
        debtToEquity: null,
        revenueGrowthPct: null,
        fiftyDayAverage,
        twoHundredDayAverage,
        averageVolume,
        targetPrice: null,
        thirtyDayChangePct,
        realizedVolatilityPct,
        distanceFromFiftyDayPct,
        distanceFromTwoHundredDayPct,
        momentumScore: null,
        liquidityScore: null,
      };

      const wheelScore = scoreFundamentalRow(baseRow);

      return {
        ...baseRow,
        momentumScore: clamp((thirtyDayChangePct ?? 0) + (distanceFromFiftyDayPct ?? 0) * 0.7, 0, 100),
        liquidityScore: averageVolume ? clamp(Math.log10(averageVolume + 1) * 20, 0, 100) : 0,
        wheelScore,
      } satisfies FundamentalRow;
    })
    .sort((left, right) => right.wheelScore - left.wheelScore);
}
