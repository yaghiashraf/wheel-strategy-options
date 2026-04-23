import { StrategyWorkbench } from "@/components/strategy-workbench";
import { WHEEL_UNIVERSE } from "@/lib/universe";

export default function CoveredCallPage() {
  return (
    <div className="page-wrap">
      <StrategyWorkbench
        strategy="covered-call"
        defaultSymbols={WHEEL_UNIVERSE.join(",")}
        title="Covered Call Screener"
        description="Scan yield-bearing call sales across your wheel watchlist."
      />
    </div>
  );
}
