import { useState } from 'react'
import { AccountManagement } from '../account-management'
import { AssetSelectorAndStats } from '../asset-selector-and-stats'
import { Chart } from '../chart'
import { TradeTables } from '../trade-tables/trade-tables'
import { TradeWidget } from '../trade-widget'
import { type DesktopTab, DesktopTabbedView } from './desktop-tabbed-view'

export const DesktopLayout = () => {
  const [tab, setTab] = useState<DesktopTab>('order-book')
  return (
    <div className="h-[calc(100vh-56px)] w-full overflow-x-hidden">
      <div className="flex gap-1 min-w-0">
        <div className="flex flex-col flex-1 gap-1 min-w-0">
          <div className="flex gap-1 w-full min-w-0">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="bg-blue-500/50 border p-2">favorites</div>
              <AssetSelectorAndStats />
              <Chart className="min-h-[675px]" />
            </div>

            <div className="hidden xl:block flex-none basis-[29.074%] min-w-[300px] ">
              <DesktopTabbedView tab={tab} setTab={setTab} />
            </div>
          </div>

          <div className="min-h-[450px]">
            <TradeTables className="h-full" />
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-none w-[40%] lg:max-w-xs xl:max-w-full xl:basis-[22.5%] xl:w-auto min-w-0">
          <div className="flex flex-col xl:flex-row w-full gap-1 xl:min-w-[280px] min-w-0">
            <div className="w-full min-h-[783px] block xl:hidden min-w-0">
              <DesktopTabbedView tab={tab} setTab={setTab} />
            </div>

            <div className="w-full min-h-[783px] min-w-0">
              <TradeWidget className="h-full" />
            </div>
          </div>

          <div className="min-h-[675px] min-w-0">
            <AccountManagement className="h-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
