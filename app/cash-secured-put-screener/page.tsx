import { StrategyWorkbench } from "@/components/strategy-workbench";

export default function CashSecuredPutPage() {
  return (
    <div className="page-wrap">
      <StrategyWorkbench
        strategy="cash-secured-put"
        defaultSymbols="AAPL,MSFT,NVDA,AMZN,TSLA,SPY"
        title="Cash-Secured Put Screener"
        description="Rank downside entries by premium, assignment distance, and collateral efficiency."
      />
    </div>
  );
}
