import { NextResponse } from "next/server";
import { getDiscoverPayload } from "@/lib/wheel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getDiscoverPayload();
    return NextResponse.json(payload);
  } catch (issue) {
    return NextResponse.json(
      {
        error: issue instanceof Error ? issue.message : "Failed to load discover feed.",
      },
      { status: 500 },
    );
  }
}
