import { PerpTokenSelector } from './perp-token-selector'
import { TradeTables } from './trade-tables'

export const MobileLayout = () => (
  <div className="pb-[46px] w-full">
    <div className="flex flex-col gap-1 pt-2 h-full">
      <PerpTokenSelector />
      <div className="bg-blue-500/50 border p-2 h-[460px] min-h-[350px]">
        chart/orderbook/trades tabs
      </div>

      <TradeTables className="min-h-[300px] h-full" />
    </div>
    <div className="fixed bottom-0 w-full left-0 py-2.5 border bg-purple-500/50">
      footer nav
    </div>
  </div>
)
