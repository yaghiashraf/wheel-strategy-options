import { NextRequest, NextResponse } from "next/server";
import { getUniverseSymbols, type UniverseName } from "@/lib/universe";

export const dynamic = "force-dynamic";

function parseUniverse(value: string | null): UniverseName {
  if (value === "dow" || value === "sp500" || value === "core") {
    return value;
  }

  return "core";
}

export async function GET(request: NextRequest) {
  try {
    const universe = await getUniverseSymbols(parseUniverse(request.nextUrl.searchParams.get("name")));
    return NextResponse.json({
      ...universe,
      count: universe.symbols.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (issue) {
    return NextResponse.json(
      {
        error: issue instanceof Error ? issue.message : "Failed to load universe.",
      },
      { status: 500 },
    );
  }
}
