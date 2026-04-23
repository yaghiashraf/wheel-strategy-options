import { StrategyWorkbench } from "@/components/strategy-workbench";
import { WHEEL_UNIVERSE } from "@/lib/universe";

export default function HomePage() {
  return (
    <div className="page-wrap">
      <StrategyWorkbench
        strategy="covered-call"
        defaultSymbols={WHEEL_UNIVERSE.join(",")}
        title="CCALL"
        description="Covered Call Scanner"
      />
    </div>
  );
}
