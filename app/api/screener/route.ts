import { NextRequest, NextResponse } from "next/server";
import { getStrategyIdeas } from "@/lib/wheel";
import type { Strategy } from "@/lib/types";

export const dynamic = "force-dynamic";

function parseSymbols(value: string | null) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
}

export async function GET(request: NextRequest) {
  const strategy = request.nextUrl.searchParams.get("strategy") as Strategy | null;

  if (strategy !== "covered-call" && strategy !== "cash-secured-put") {
    return NextResponse.json({ error: "Invalid strategy." }, { status: 400 });
  }

  try {
    const payload = await getStrategyIdeas(strategy, {
      symbols: parseSymbols(request.nextUrl.searchParams.get("symbols")),
      minDte: Number(request.nextUrl.searchParams.get("minDte") ?? 7),
      maxDte: Number(request.nextUrl.searchParams.get("maxDte") ?? 45),
      minYield: Number(request.nextUrl.searchParams.get("minYield") ?? 0),
      maxDelta: Number(request.nextUrl.searchParams.get("maxDelta") ?? 0.45),
      minOtm: Number(request.nextUrl.searchParams.get("minOtm") ?? 0),
      maxResults: Number(request.nextUrl.searchParams.get("maxResults") ?? 40),
    });

    return NextResponse.json(payload);
  } catch (issue) {
    return NextResponse.json(
      {
        error: issue instanceof Error ? issue.message : "Failed to run screener.",
      },
      { status: 500 },
    );
  }
}
