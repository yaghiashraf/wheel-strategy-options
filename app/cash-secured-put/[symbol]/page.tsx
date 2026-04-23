import { SymbolSummary } from "@/components/symbol-summary";
import { getStrategySummary } from "@/lib/wheel";

export const dynamic = "force-dynamic";

export default async function CashSecuredPutSymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const summary = await getStrategySummary("cash-secured-put", symbol);

  return (
    <div className="page-wrap">
      <SymbolSummary strategy="cash-secured-put" summary={summary} />
    </div>
  );
}
