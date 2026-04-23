export type UniverseName = "core" | "dow" | "sp500";

export const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "NVDA", "AMZN", "TSLA", "SPY"];

export const WHEEL_UNIVERSE = [
  "AAPL",
  "MSFT",
  "NVDA",
  "AMZN",
  "TSLA",
  "SPY",
  "GOOGL",
  "META",
  "AVGO",
  "JPM",
  "COST",
  "AMD",
  "CRM",
  "NFLX",
  "KO",
  "XOM",
  "WMT",
  "DIS",
  "NKE",
  "QQQ",
];

export const DOW_FALLBACK_SYMBOLS = [
  "MMM",
  "AXP",
  "AMGN",
  "AMZN",
  "AAPL",
  "BA",
  "CAT",
  "CVX",
  "CSCO",
  "KO",
  "DIS",
  "GS",
  "HD",
  "HON",
  "IBM",
  "JNJ",
  "JPM",
  "MCD",
  "MRK",
  "MSFT",
  "NKE",
  "NVDA",
  "PG",
  "CRM",
  "SHW",
  "TRV",
  "UNH",
  "VZ",
  "V",
  "WMT",
];

export const SP500_FALLBACK_SYMBOLS = [
  "MMM", "AOS", "ABT", "ABBV", "ACN", "ADBE", "AMD", "AES",
  "AFL", "A", "APD", "ABNB", "AKAM", "ALB", "ARE", "ALGN",
  "ALLE", "LNT", "ALL", "GOOGL", "GOOG", "MO", "AMZN", "AMCR",
  "AEE", "AEP", "AXP", "AIG", "AMT", "AWK", "AMP", "AME",
  "AMGN", "APH", "ADI", "AON", "APA", "APO", "AAPL", "AMAT",
  "APP", "APTV", "ACGL", "ADM", "ARES", "ANET", "AJG", "AIZ",
  "T", "ATO", "ADSK", "ADP", "AZO", "AVB", "AVY", "AXON",
  "BKR", "BALL", "BAC", "BAX", "BDX", "BRK-B", "BBY", "TECH",
  "BIIB", "BLK", "BX", "XYZ", "BK", "BA", "BKNG", "BSX",
  "BMY", "AVGO", "BR", "BRO", "BF-B", "BLDR", "BG", "BXP",
  "CHRW", "CDNS", "CPT", "CPB", "COF", "CAH", "CCL", "CARR",
  "CVNA", "CASY", "CAT", "CBOE", "CBRE", "CDW", "COR", "CNC",
  "CNP", "CF", "CRL", "SCHW", "CHTR", "CVX", "CMG", "CB",
  "CHD", "CIEN", "CI", "CINF", "CTAS", "CSCO", "C", "CFG",
  "CLX", "CME", "CMS", "KO", "CTSH", "COHR", "COIN", "CL",
  "CMCSA", "FIX", "CAG", "COP", "ED", "STZ", "CEG", "COO",
  "CPRT", "GLW", "CPAY", "CTVA", "CSGP", "COST", "CTRA", "CRH",
  "CRWD", "CCI", "CSX", "CMI", "CVS", "DHR", "DRI", "DDOG",
  "DVA", "DECK", "DE", "DELL", "DAL", "DVN", "DXCM", "FANG",
  "DLR", "DG", "DLTR", "D", "DPZ", "DASH", "DOV", "DOW",
  "DHI", "DTE", "DUK", "DD", "ETN", "EBAY", "SATS", "ECL",
  "EIX", "EW", "EA", "ELV", "EME", "EMR", "ETR", "EOG",
  "EPAM", "EQT", "EFX", "EQIX", "EQR", "ERIE", "ESS", "EL",
  "EG", "EVRG", "ES", "EXC", "EXE", "EXPE", "EXPD", "EXR",
  "XOM", "FFIV", "FDS", "FICO", "FAST", "FRT", "FDX", "FIS",
  "FITB", "FSLR", "FE", "FISV", "F", "FTNT", "FTV", "FOXA",
  "FOX", "BEN", "FCX", "GRMN", "IT", "GE", "GEHC", "GEV",
  "GEN", "GNRC", "GD", "GIS", "GM", "GPC", "GILD", "GPN",
  "GL", "GDDY", "GS", "HAL", "HIG", "HAS", "HCA", "DOC",
  "HSIC", "HSY", "HPE", "HLT", "HD", "HON", "HRL", "HST",
  "HWM", "HPQ", "HUBB", "HUM", "HBAN", "HII", "IBM", "IEX",
  "IDXX", "ITW", "INCY", "IR", "PODD", "INTC", "IBKR", "ICE",
  "IFF", "IP", "INTU", "ISRG", "IVZ", "INVH", "IQV", "IRM",
  "JBHT", "JBL", "JKHY", "J", "JNJ", "JCI", "JPM", "KVUE",
  "KDP", "KEY", "KEYS", "KMB", "KIM", "KMI", "KKR", "KLAC",
  "KHC", "KR", "LHX", "LH", "LRCX", "LVS", "LDOS", "LEN",
  "LII", "LLY", "LIN", "LYV", "LMT", "L", "LOW", "LULU",
  "LITE", "LYB", "MTB", "MPC", "MAR", "MRSH", "MLM", "MAS",
  "MA", "MKC", "MCD", "MCK", "MDT", "MRK", "META", "MET",
  "MTD", "MGM", "MCHP", "MU", "MSFT", "MAA", "MRNA", "TAP",
  "MDLZ", "MPWR", "MNST", "MCO", "MS", "MOS", "MSI", "MSCI",
  "NDAQ", "NTAP", "NFLX", "NEM", "NWSA", "NWS", "NEE", "NKE",
  "NI", "NDSN", "NSC", "NTRS", "NOC", "NCLH", "NRG", "NUE",
  "NVDA", "NVR", "NXPI", "ORLY", "OXY", "ODFL", "OMC", "ON",
  "OKE", "ORCL", "OTIS", "PCAR", "PKG", "PLTR", "PANW", "PSKY",
  "PH", "PAYX", "PYPL", "PNR", "PEP", "PFE", "PCG", "PM",
  "PSX", "PNW", "PNC", "POOL", "PPG", "PPL", "PFG", "PG",
  "PGR", "PLD", "PRU", "PEG", "PTC", "PSA", "PHM", "PWR",
  "QCOM", "DGX", "Q", "RL", "RJF", "RTX", "O", "REG",
  "REGN", "RF", "RSG", "RMD", "RVTY", "HOOD", "ROK", "ROL",
  "ROP", "ROST", "RCL", "SPGI", "CRM", "SNDK", "SBAC", "SLB",
  "STX", "SRE", "NOW", "SHW", "SPG", "SWKS", "SJM", "SW",
  "SNA", "SOLV", "SO", "LUV", "SWK", "SBUX", "STT", "STLD",
  "STE", "SYK", "SMCI", "SYF", "SNPS", "SYY", "TMUS", "TROW",
  "TTWO", "TPR", "TRGP", "TGT", "TEL", "TDY", "TER", "TSLA",
  "TXN", "TPL", "TXT", "TMO", "TJX", "TKO", "TTD", "TSCO",
  "TT", "TDG", "TRV", "TRMB", "TFC", "TYL", "TSN", "USB",
  "UBER", "UDR", "ULTA", "UNP", "UAL", "UPS", "URI", "UNH",
  "UHS", "VLO", "VTR", "VLTO", "VRSN", "VRSK", "VZ", "VRTX",
  "VRT", "VTRS", "VICI", "V", "VST", "VMC", "WRB", "GWW",
  "WAB", "WMT", "DIS", "WBD", "WM", "WAT", "WEC", "WFC",
  "WELL", "WST", "WDC", "WY", "WSM", "WMB", "WTW", "WDAY",
  "WYNN", "XEL", "XYL", "YUM", "ZBRA", "ZBH", "ZTS",
];

export const UNIVERSE_LABELS: Record<UniverseName, string> = {
  core: "Core Watchlist",
  dow: "Dow 30",
  sp500: "S&P 500",
};

const SP500_URL = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies";
const DOW_URL = "https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average";

function decodeEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#160;", " ")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"');
}

function stripHtml(value: string) {
  return decodeEntities(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function normalizeSymbol(value: string) {
  return value.trim().toUpperCase().replaceAll(".", "-");
}

function uniqueSymbols(symbols: string[]) {
  return Array.from(
    new Set(
      symbols
        .map(normalizeSymbol)
        .filter((symbol) => symbol !== "SYMBOL" && /^[A-Z][A-Z0-9-]*$/.test(symbol)),
    ),
  );
}

function extractTables(html: string) {
  return [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map((match) => match[0]);
}

function extractRows(table: string) {
  return [...table.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((match) => match[0]);
}

function extractCells(row: string) {
  return [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((match) => stripHtml(match[1]));
}

function extractSp500Symbols(html: string) {
  const table = extractTables(html).find((item) => item.includes("GICS Sector") && item.includes("CIK"));
  if (!table) {
    return [];
  }

  return uniqueSymbols(
    extractRows(table)
      .map((row) => extractCells(row)[0] ?? "")
      .filter(Boolean),
  );
}

function extractDowSymbols(html: string) {
  const table = extractTables(html).find(
    (item) => item.includes("Index weighting") && item.includes("Date added"),
  );
  if (!table) {
    return [];
  }

  return uniqueSymbols(
    extractRows(table)
      .map((row) => extractCells(row)[2] ?? "")
      .filter(Boolean),
  );
}

async function fetchUniversePage(url: string) {
  const response = await fetch(url, {
    next: { revalidate: 86_400 },
    headers: {
      "user-agent": "WheelStrategyOptions/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load universe source ${response.status}.`);
  }

  return response.text();
}

export async function getUniverseSymbols(name: UniverseName) {
  if (name === "core") {
    return {
      name,
      label: UNIVERSE_LABELS[name],
      symbols: WHEEL_UNIVERSE,
      source: "curated",
    };
  }

  try {
    const html = await fetchUniversePage(name === "sp500" ? SP500_URL : DOW_URL);
    const symbols = name === "sp500" ? extractSp500Symbols(html) : extractDowSymbols(html);

    if (symbols.length > 0) {
      return {
        name,
        label: UNIVERSE_LABELS[name],
        symbols,
        source: name === "sp500" ? SP500_URL : DOW_URL,
      };
    }
  } catch {
    // Fall through to local fallback if Wikipedia is unavailable.
  }

  const fallbackSymbols = name === "dow" ? DOW_FALLBACK_SYMBOLS : SP500_FALLBACK_SYMBOLS;
  return {
    name,
    label: UNIVERSE_LABELS[name],
    symbols: fallbackSymbols,
    source: "fallback",
  };
}

export const TOOL_CARDS = [
  {
    title: "Premium Yield",
    description: "Measure raw yield on collateral for a wheel trade.",
    formula: "premium / strike x 100",
  },
  {
    title: "Annualized Yield",
    description: "Normalize shorter expirations against a yearly rate.",
    formula: "premium yield x (365 / DTE)",
  },
  {
    title: "Cash Required",
    description: "Reserve the buying power needed for a CSP assignment.",
    formula: "strike x 100 x contracts",
  },
  {
    title: "Breakeven",
    description: "See the effective stock basis after premium.",
    formula: "put strike - premium or stock cost - premium",
  },
];
