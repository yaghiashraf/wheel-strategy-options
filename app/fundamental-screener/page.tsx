import { FundamentalWorkbench } from "@/components/fundamental-workbench";
import { WHEEL_UNIVERSE } from "@/lib/universe";

export default function FundamentalScreenerPage() {
  return (
    <div className="page-wrap">
      <FundamentalWorkbench defaultSymbols={WHEEL_UNIVERSE.join(",")} />
    </div>
  );
}
