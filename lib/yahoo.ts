import type { FundamentalRow } from "@/lib/types";
import { clamp } from "@/lib/format";

type YahooModuleValue = {
  raw?: number;
  fmt?: string;
  longFmt?: string;
};

type QuoteSummaryPayload = {
  quoteSummary?: {
    result?: Array<{
      price?: Record<string, YahooModuleValue | string>;
      summaryDetail?: Record<string, YahooModuleValue>;
      defaultKeyStatistics?: Record<string, YahooModuleValue>;
      financialData?: Record<string, YahooModuleValue>;
      assetProfile?: {
        sector?: string;
        industry?: string;
      };
    }>;
  };
};

function rawValue(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (value && typeof value === "object" && "raw" in value) {
    return Number((value as YahooModuleValue).raw ?? NaN);
  }

  return null;
}

async function fetchQuoteSummary(symbol: string) {
  const modules = [
    "price",
    "summaryDetail",
    "defaultKeyStatistics",
    "financialData",
    "assetProfile",
  ].join(",");

  const response = await fetch(
    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=${modules}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Yahoo Finance request failed for ${symbol}.`);
  }

  const payload = (await response.json()) as QuoteSummaryPayload;
  return payload.quoteSummary?.result?.[0] ?? null;
}

function computeWheelScore(row: Omit<FundamentalRow, "wheelScore">) {
  let score = 50;

  if ((row.marketCap ?? 0) > 25_000_000_000) score += 10;
  else if ((row.marketCap ?? 0) > 5_000_000_000) score += 6;
  else score -= 6;

  if ((row.profitMarginPct ?? -100) > 12) score += 10;
  else if ((row.profitMarginPct ?? -100) > 5) score += 5;
  else score -= 8;

  if ((row.returnOnEquityPct ?? -100) > 18) score += 8;
  else if ((row.returnOnEquityPct ?? -100) > 10) score += 4;
  else score -= 5;

  if ((row.debtToEquity ?? 999) < 80) score += 8;
  else if ((row.debtToEquity ?? 999) < 160) score += 4;
  else score -= 6;

  if ((row.revenueGrowthPct ?? -100) > 8) score += 7;
  else if ((row.revenueGrowthPct ?? -100) > 0) score += 4;
  else score -= 4;

  if ((row.averageVolume ?? 0) > 4_000_000) score += 6;
  else if ((row.averageVolume ?? 0) > 1_500_000) score += 3;
  else score -= 4;

  if ((row.beta ?? 99) >= 0.75 && (row.beta ?? 99) <= 1.9) score += 6;
  else score -= 2;

  if ((row.price ?? 0) > (row.fiftyDayAverage ?? Number.MAX_VALUE)) score += 3;
  if ((row.price ?? 0) > (row.twoHundredDayAverage ?? Number.MAX_VALUE)) score += 4;

  return clamp(score, 0, 100);
}

export async function getFundamentalRows(symbols: string[]) {
  const rows = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const summary = await fetchQuoteSummary(symbol);

        if (!summary) {
          return null;
        }

        const price = summary.price ?? {};
        const detail = summary.summaryDetail ?? {};
        const financial = summary.financialData ?? {};
        const profile = summary.assetProfile ?? {};

        const baseRow = {
          symbol,
          companyName:
            String(price.longName ?? price.shortName ?? symbol) || symbol,
          sector: profile.sector ?? "Unknown",
          industry: profile.industry ?? "Unknown",
          price: rawValue(price.regularMarketPrice),
          marketCap: rawValue(price.marketCap),
          trailingPe: rawValue(price.trailingPE),
          forwardPe: rawValue(financial.forwardPE) ?? rawValue(detail.forwardPE),
          beta: rawValue(detail.beta),
          dividendYieldPct: rawValue(detail.dividendYield)
            ? rawValue(detail.dividendYield)! * 100
            : null,
          grossMarginPct: rawValue(financial.grossMargins)
            ? rawValue(financial.grossMargins)! * 100
            : null,
          profitMarginPct: rawValue(financial.profitMargins)
            ? rawValue(financial.profitMargins)! * 100
            : null,
          returnOnEquityPct: rawValue(financial.returnOnEquity)
            ? rawValue(financial.returnOnEquity)! * 100
            : null,
          debtToEquity: rawValue(financial.debtToEquity),
          revenueGrowthPct: rawValue(financial.revenueGrowth)
            ? rawValue(financial.revenueGrowth)! * 100
            : null,
          fiftyDayAverage: rawValue(detail.fiftyDayAverage),
          twoHundredDayAverage: rawValue(detail.twoHundredDayAverage),
          averageVolume: rawValue(detail.averageVolume),
          targetPrice: rawValue(financial.targetMeanPrice),
        };

        return {
          ...baseRow,
          wheelScore: computeWheelScore(baseRow),
        } satisfies FundamentalRow;
      } catch {
        return null;
      }
    }),
  );

  return rows.filter((row): row is FundamentalRow => row !== null);
}
