import { StrategyWorkbench } from "@/components/strategy-workbench";

export default function CoveredCallPage() {
  return (
    <div className="page-wrap">
      <StrategyWorkbench
        strategy="covered-call"
        defaultSymbols="AAPL,MSFT,NVDA,AMZN,TSLA,SPY"
        title="Covered Call Screener"
        description="Scan yield-bearing call sales across your wheel watchlist."
      />
    </div>
  );
}
