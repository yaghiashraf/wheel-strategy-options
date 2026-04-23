export type Strategy = "covered-call" | "cash-secured-put";

export type ScreenerFilters = {
  symbols: string[];
  minDte: number;
  maxDte: number;
  minYield: number;
  maxDelta: number;
  minOtm: number;
  maxResults: number;
};

export type OptionOpportunity = {
  symbol: string;
  companyName: string;
  contractSymbol: string;
  strategy: Strategy;
  expirationDate: string;
  dte: number;
  strike: number;
  stockPrice: number;
  premium: number;
  premiumPerContract: number;
  yieldPct: number;
  annualizedYieldPct: number;
  otmPct: number;
  delta: number | null;
  impliedVolatilityPct: number | null;
  bid: number | null;
  ask: number | null;
  mark: number | null;
  openInterest: number | null;
  breakeven: number;
  collateral: number;
  assignmentProbabilityPct: number | null;
  score: number;
};

export type FundamentalRow = {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  price: number | null;
  marketCap: number | null;
  trailingPe: number | null;
  forwardPe: number | null;
  beta: number | null;
  dividendYieldPct: number | null;
  grossMarginPct: number | null;
  profitMarginPct: number | null;
  returnOnEquityPct: number | null;
  debtToEquity: number | null;
  revenueGrowthPct: number | null;
  fiftyDayAverage: number | null;
  twoHundredDayAverage: number | null;
  averageVolume: number | null;
  targetPrice: number | null;
  wheelScore: number;
};

export type DiscoverPayload = {
  generatedAt: string;
  universe: string[];
  coveredCalls: OptionOpportunity[];
  cashSecuredPuts: OptionOpportunity[];
  fundamentals: FundamentalRow[];
};

export type StrategySummary = {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  stockPrice: number | null;
  marketCap: number | null;
  rating: string;
  averageYieldPct: number;
  maximumYieldPct: number;
  averageIvPct: number;
  peakIvPct: number;
  availableContracts: number;
  opportunities: OptionOpportunity[];
};
