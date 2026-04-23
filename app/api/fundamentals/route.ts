import { NextRequest, NextResponse } from "next/server";
import { getFundamentalIdeas } from "@/lib/wheel";
import { WHEEL_UNIVERSE } from "@/lib/universe";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rawSymbols = request.nextUrl.searchParams.get("symbols");
  const symbols = rawSymbols
    ? rawSymbols
        .split(",")
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean)
    : WHEEL_UNIVERSE;

  try {
    const rows = await getFundamentalIdeas(symbols);
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      rows,
    });
  } catch (issue) {
    return NextResponse.json(
      {
        error: issue instanceof Error ? issue.message : "Failed to load fundamentals.",
      },
      { status: 500 },
    );
  }
}
