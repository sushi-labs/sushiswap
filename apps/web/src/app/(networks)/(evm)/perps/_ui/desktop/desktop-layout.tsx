import { useBreakpoint, useLocalStorage } from '@sushiswap/hooks'
import { AccountManagement } from '../account-management'
import { AssetSelectorAndStats } from '../asset-selector-and-stats'
import { Chart } from '../chart'
import { Favorites } from '../favorites'
import { TradeTables } from '../trade-tables/trade-tables'
import { TradeWidget } from '../trade-widget/trade-widget'
import { type DesktopTab, DesktopTabbedView } from './desktop-tabbed-view'

export const DesktopLayout = () => {
  const { isXl } = useBreakpoint('xl')
  const [tab, setTab] = useLocalStorage<DesktopTab>(
    'sushi.perps.desktop-layout-tab',
    'order-book',
  )
  return (
    <div className="h-[calc(100vh-60px)] w-full overflow-x-hidden mt-1">
      <div className="flex gap-1 min-w-0">
        <div className="flex flex-col flex-1 gap-1 min-w-0">
          <div className="flex gap-1 w-full min-w-0">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <Favorites />
              <AssetSelectorAndStats />
              <Chart />
            </div>

            {isXl ? (
              <div className="hidden xl:block flex-none basis-[29.074%] min-w-[300px] ">
                <DesktopTabbedView tab={tab} setTab={setTab} />
              </div>
            ) : null}
          </div>

          <div className="min-h-[450px]">
            <TradeTables className="h-full" />
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-none w-[40%] lg:max-w-xs xl:max-w-full xl:basis-[22.5%] xl:w-auto min-w-0">
          <div className="flex flex-col xl:flex-row w-full gap-1 xl:min-w-[280px] min-w-0">
            {isXl ? null : (
              <div className="w-full max-h-[734px] block xl:hidden min-w-0">
                <DesktopTabbedView tab={tab} setTab={setTab} />
              </div>
            )}

            <div className="w-full min-h-[736px] min-w-0">
              <TradeWidget className="h-full" />
            </div>
          </div>

          <div className="min-h-[450px] min-w-0">
            <AccountManagement className="h-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
