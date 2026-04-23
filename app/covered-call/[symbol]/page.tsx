import { SymbolSummary } from "@/components/symbol-summary";
import { getStrategySummary } from "@/lib/wheel";

export const dynamic = "force-dynamic";

export default async function CoveredCallSymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const summary = await getStrategySummary("covered-call", symbol);

  return (
    <div className="page-wrap">
      <SymbolSummary strategy="covered-call" summary={summary} />
    </div>
  );
}
