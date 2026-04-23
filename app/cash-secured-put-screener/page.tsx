import { StrategyWorkbench } from "@/components/strategy-workbench";
import { WHEEL_UNIVERSE } from "@/lib/universe";

export default function CashSecuredPutPage() {
  return (
    <div className="page-wrap">
      <StrategyWorkbench
        strategy="cash-secured-put"
        defaultSymbols={WHEEL_UNIVERSE.join(",")}
        title="Cash-Secured Put Screener"
        description="Rank downside entries by premium, assignment distance, and collateral efficiency."
      />
    </div>
  );
}
