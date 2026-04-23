type StockSnapshotRecord = {
  latestTrade?: {
    price?: number;
  };
  latest_trade?: {
    price?: number;
  };
  latestQuote?: {
    bidPrice?: number;
    askPrice?: number;
  };
  latest_quote?: {
    bid_price?: number;
    ask_price?: number;
  };
  dailyBar?: {
    close?: number;
  };
  daily_bar?: {
    close?: number;
  };
};

export type AlpacaContract = {
  symbol: string;
  underlying_symbol?: string;
  expiration_date: string;
  strike_price: string;
  type: "call" | "put";
  open_interest?: string;
  close_price?: string;
  name?: string;
  status?: string;
};

export type AlpacaOptionSnapshot = {
  impliedVolatility?: number;
  implied_volatility?: number;
  greeks?: {
    delta?: number;
  };
  latestTrade?: {
    price?: number;
  };
  latest_trade?: {
    price?: number;
  };
  latestQuote?: {
    bidPrice?: number;
    askPrice?: number;
  };
  latest_quote?: {
    bid_price?: number;
    ask_price?: number;
  };
};

const TRADING_ROOT = (process.env.APCA_API_BASE_URL ||
  process.env.ALPACA_BASE_URL ||
  "https://paper-api.alpaca.markets")
  .replace(/\/+$/, "")
  .replace(/\/v2$/, "");

const DATA_ROOT = "https://data.alpaca.markets";

function getKeyId() {
  return process.env.APCA_API_KEY_ID || process.env.ALPACA_API_KEY || "";
}

function getSecret() {
  return process.env.APCA_API_SECRET_KEY || process.env.ALPACA_SECRET_KEY || "";
}

export function hasAlpacaCredentials() {
  return Boolean(getKeyId() && getSecret());
}

export function assertAlpacaConfigured() {
  if (!hasAlpacaCredentials()) {
    throw new Error(
      "Missing Alpaca credentials. Set APCA_API_KEY_ID/APCA_API_SECRET_KEY or ALPACA_API_KEY/ALPACA_SECRET_KEY.",
    );
  }
}

async function alpacaFetch<T>(url: string) {
  assertAlpacaConfigured();

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "APCA-API-KEY-ID": getKeyId(),
      "APCA-API-SECRET-KEY": getSecret(),
    },
  });

  if (!response.ok) {
    throw new Error(`Alpaca request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function getStockSnapshots(symbols: string[]) {
  const params = new URLSearchParams({
    symbols: symbols.join(","),
    feed: "iex",
  });

  const payload = await alpacaFetch<{ snapshots?: Record<string, StockSnapshotRecord> }>(
    `${DATA_ROOT}/v2/stocks/snapshots?${params.toString()}`,
  );

  return payload.snapshots ?? {};
}

export async function getOptionContracts(args: {
  underlyingSymbol: string;
  type: "call" | "put";
  expirationDateGte: string;
  expirationDateLte: string;
  strikePriceGte: number;
  strikePriceLte: number;
  limit?: number;
}) {
  const contracts: AlpacaContract[] = [];
  let pageToken = "";

  while (contracts.length < (args.limit ?? 250)) {
    const params = new URLSearchParams({
      underlying_symbols: args.underlyingSymbol,
      status: "active",
      type: args.type,
      expiration_date_gte: args.expirationDateGte,
      expiration_date_lte: args.expirationDateLte,
      strike_price_gte: args.strikePriceGte.toFixed(2),
      strike_price_lte: args.strikePriceLte.toFixed(2),
      limit: "200",
    });

    if (pageToken) {
      params.set("page_token", pageToken);
    }

    const payload = await alpacaFetch<{
      option_contracts?: AlpacaContract[];
      contracts?: AlpacaContract[];
      page_token?: string | null;
      next_page_token?: string | null;
    }>(`${TRADING_ROOT}/v2/options/contracts?${params.toString()}`);

    const batch = payload.option_contracts ?? payload.contracts ?? [];
    contracts.push(...batch);

    pageToken = payload.next_page_token ?? payload.page_token ?? "";
    if (!pageToken || batch.length === 0) {
      break;
    }
  }

  return contracts.slice(0, args.limit ?? 250);
}

export async function getOptionSnapshots(contractSymbols: string[]) {
  const allSnapshots: Record<string, AlpacaOptionSnapshot> = {};

  for (let index = 0; index < contractSymbols.length; index += 100) {
    const chunk = contractSymbols.slice(index, index + 100);
    const params = new URLSearchParams({
      symbols: chunk.join(","),
      feed: "indicative",
      limit: String(chunk.length),
    });

    const payload = await alpacaFetch<{
      snapshots?: Record<string, AlpacaOptionSnapshot>;
    }>(`${DATA_ROOT}/v1beta1/options/snapshots?${params.toString()}`);

    Object.assign(allSnapshots, payload.snapshots ?? {});
  }

  return allSnapshots;
}

export function extractStockPrice(snapshot: StockSnapshotRecord | undefined) {
  return (
    snapshot?.latestTrade?.price ??
    snapshot?.latest_trade?.price ??
    snapshot?.dailyBar?.close ??
    snapshot?.daily_bar?.close ??
    null
  );
}

export function extractOptionQuote(snapshot: AlpacaOptionSnapshot | undefined) {
  const latestQuote = snapshot?.latestQuote;
  const snakeQuote = snapshot?.latest_quote;

  return {
    bid: latestQuote?.bidPrice ?? snakeQuote?.bid_price ?? null,
    ask: latestQuote?.askPrice ?? snakeQuote?.ask_price ?? null,
  };
}

export function extractOptionTradePrice(snapshot: AlpacaOptionSnapshot | undefined) {
  return snapshot?.latestTrade?.price ?? snapshot?.latest_trade?.price ?? null;
}

export function extractOptionDelta(snapshot: AlpacaOptionSnapshot | undefined) {
  return snapshot?.greeks?.delta ?? null;
}

export function extractOptionIv(snapshot: AlpacaOptionSnapshot | undefined) {
  return snapshot?.impliedVolatility ?? snapshot?.implied_volatility ?? null;
}
