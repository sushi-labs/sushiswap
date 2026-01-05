import { useState } from 'react'
import { AccountManagement } from '../account-management'
import { Chart } from '../chart'
import { PerpTokenSelector } from '../perp-token-selector'
import { TradeTables } from '../trade-tables'
import { TradeWidget } from '../trade-widget'
import { type DesktopTab, DesktopTabbedView } from './desktop-tabbed-view'

export const DesktopLayout = () => {
  const [tab, setTab] = useState<DesktopTab>('order-book')
  return (
    <div className="h-[calc(100vh-56px)] w-full">
      <div className="flex gap-1">
        <div className="flex flex-col w-full gap-1">
          <div className="flex gap-1 w-full">
            <div className="flex flex-col gap-1 w-full">
              <div className="bg-blue-500/50 border p-2">favorites</div>
              <PerpTokenSelector />
              <Chart className="min-h-[675px]" />
            </div>

            <div className="hidden xl:block min-w-[300px] xl:w-[29.074%]">
              <DesktopTabbedView tab={tab} setTab={setTab} />
            </div>
          </div>
          <div className="min-h-[450px]">
            <TradeTables className="h-full" />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-[40%] xl:w-[22.5%]">
          <div className="flex flex-col xl:flex-row w-full gap-1 xl:min-w-[280px]">
            <div className="w-full min-h-[783px] block xl:hidden">
              <DesktopTabbedView tab={tab} setTab={setTab} />
            </div>

            <div className="w-full min-h-[783px]">
              <TradeWidget className="h-full" />
            </div>
          </div>
          <div className="min-h-[675px]">
            <AccountManagement className="h-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
