export type CompanyMetadata = {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  marketCapBillions?: number;
};

export const COMPANY_METADATA: Record<string, CompanyMetadata> = {
  AAPL: { symbol: "AAPL", companyName: "Apple Inc.", sector: "Technology", industry: "Consumer Electronics", marketCapBillions: 4100 },
  ABBV: { symbol: "ABBV", companyName: "AbbVie Inc.", sector: "Healthcare", industry: "Drug Manufacturers", marketCapBillions: 320 },
  ABNB: { symbol: "ABNB", companyName: "Airbnb, Inc.", sector: "Consumer Cyclical", industry: "Travel Services", marketCapBillions: 110 },
  AMD: { symbol: "AMD", companyName: "Advanced Micro Devices, Inc.", sector: "Technology", industry: "Semiconductors", marketCapBillions: 310 },
  AMZN: { symbol: "AMZN", companyName: "Amazon.com, Inc.", sector: "Consumer Cyclical", industry: "Internet Retail", marketCapBillions: 2600 },
  BAC: { symbol: "BAC", companyName: "Bank of America Corporation", sector: "Financial Services", industry: "Banks", marketCapBillions: 340 },
  BABA: { symbol: "BABA", companyName: "Alibaba Group Holding Limited", sector: "Consumer Cyclical", industry: "Internet Retail", marketCapBillions: 260 },
  CCJ: { symbol: "CCJ", companyName: "Cameco Corporation", sector: "Energy", industry: "Uranium", marketCapBillions: 32 },
  COIN: { symbol: "COIN", companyName: "Coinbase Global, Inc.", sector: "Financial Services", industry: "Capital Markets", marketCapBillions: 92 },
  COST: { symbol: "COST", companyName: "Costco Wholesale Corporation", sector: "Consumer Defensive", industry: "Discount Stores", marketCapBillions: 420 },
  CRM: { symbol: "CRM", companyName: "Salesforce, Inc.", sector: "Technology", industry: "Software - Application", marketCapBillions: 300 },
  DIS: { symbol: "DIS", companyName: "The Walt Disney Company", sector: "Communication Services", industry: "Entertainment", marketCapBillions: 210 },
  ET: { symbol: "ET", companyName: "Energy Transfer LP", sector: "Energy", industry: "Oil & Gas Midstream", marketCapBillions: 62 },
  F: { symbol: "F", companyName: "Ford Motor Company", sector: "Consumer Cyclical", industry: "Auto Manufacturers", marketCapBillions: 64 },
  GOOGL: { symbol: "GOOGL", companyName: "Alphabet Inc.", sector: "Communication Services", industry: "Internet Content & Information", marketCapBillions: 2500 },
  HOOD: { symbol: "HOOD", companyName: "Robinhood Markets, Inc.", sector: "Financial Services", industry: "Capital Markets", marketCapBillions: 48 },
  INTC: { symbol: "INTC", companyName: "Intel Corporation", sector: "Technology", industry: "Semiconductors", marketCapBillions: 180 },
  IWM: { symbol: "IWM", companyName: "iShares Russell 2000 ETF", sector: "ETF", industry: "Small-Cap Blend", marketCapBillions: 78 },
  JPM: { symbol: "JPM", companyName: "JPMorgan Chase & Co.", sector: "Financial Services", industry: "Banks", marketCapBillions: 710 },
  KO: { symbol: "KO", companyName: "The Coca-Cola Company", sector: "Consumer Defensive", industry: "Beverages - Non-Alcoholic", marketCapBillions: 310 },
  META: { symbol: "META", companyName: "Meta Platforms, Inc.", sector: "Communication Services", industry: "Internet Content & Information", marketCapBillions: 1700 },
  MRVL: { symbol: "MRVL", companyName: "Marvell Technology, Inc.", sector: "Technology", industry: "Semiconductors", marketCapBillions: 88 },
  MSFT: { symbol: "MSFT", companyName: "Microsoft Corporation", sector: "Technology", industry: "Software - Infrastructure", marketCapBillions: 3800 },
  NET: { symbol: "NET", companyName: "Cloudflare, Inc.", sector: "Technology", industry: "Software - Infrastructure", marketCapBillions: 44 },
  NFLX: { symbol: "NFLX", companyName: "Netflix, Inc.", sector: "Communication Services", industry: "Entertainment", marketCapBillions: 520 },
  NKE: { symbol: "NKE", companyName: "NIKE, Inc.", sector: "Consumer Cyclical", industry: "Footwear & Accessories", marketCapBillions: 155 },
  NVDA: { symbol: "NVDA", companyName: "NVIDIA Corporation", sector: "Technology", industry: "Semiconductors", marketCapBillions: 4600 },
  PLTR: { symbol: "PLTR", companyName: "Palantir Technologies Inc.", sector: "Technology", industry: "Software - Infrastructure", marketCapBillions: 240 },
  QQQ: { symbol: "QQQ", companyName: "Invesco QQQ Trust", sector: "ETF", industry: "Large-Cap Growth", marketCapBillions: 360 },
  SCHW: { symbol: "SCHW", companyName: "The Charles Schwab Corporation", sector: "Financial Services", industry: "Capital Markets", marketCapBillions: 180 },
  SHOP: { symbol: "SHOP", companyName: "Shopify Inc.", sector: "Technology", industry: "Software - Application", marketCapBillions: 130 },
  SMCI: { symbol: "SMCI", companyName: "Super Micro Computer, Inc.", sector: "Technology", industry: "Computer Hardware", marketCapBillions: 70 },
  SOFI: { symbol: "SOFI", companyName: "SoFi Technologies, Inc.", sector: "Financial Services", industry: "Credit Services", marketCapBillions: 19 },
  SPY: { symbol: "SPY", companyName: "SPDR S&P 500 ETF Trust", sector: "ETF", industry: "Large-Cap Blend", marketCapBillions: 680 },
  TSLA: { symbol: "TSLA", companyName: "Tesla, Inc.", sector: "Consumer Cyclical", industry: "Auto Manufacturers", marketCapBillions: 900 },
  UBER: { symbol: "UBER", companyName: "Uber Technologies, Inc.", sector: "Technology", industry: "Software - Application", marketCapBillions: 210 },
  WMT: { symbol: "WMT", companyName: "Walmart Inc.", sector: "Consumer Defensive", industry: "Discount Stores", marketCapBillions: 640 },
  XLF: { symbol: "XLF", companyName: "Financial Select Sector SPDR Fund", sector: "ETF", industry: "Financial Services", marketCapBillions: 56 },
  XOM: { symbol: "XOM", companyName: "Exxon Mobil Corporation", sector: "Energy", industry: "Oil & Gas Integrated", marketCapBillions: 560 },
};

export function getCompanyMetadata(symbol: string) {
  return (
    COMPANY_METADATA[symbol] ?? {
      symbol,
      companyName: symbol,
      sector: "Unknown",
      industry: "Unknown",
    }
  );
}
