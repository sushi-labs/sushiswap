import { useBreakpoint } from '@sushiswap/hooks'
import { AssetSelectorAndStats, GeoBlockedMessage } from '../_common'
import { AccountManagement } from '../account-management'
import { Chart } from '../chart'
import { Favorites } from '../favorites'
import { OrderBookTradesTabbedView } from '../order-book-trades-tabbed-view'
import { TradeTables } from '../trade-tables'
import { TradeWidget } from '../trade-widget'

export const DesktopLayout = () => {
  const { isXl } = useBreakpoint('xl')

  return (
    <div className="h-[calc(100vh-60px)] w-full overflow-x-hidden ">
      <GeoBlockedMessage />
      <div className="flex gap-1 min-w-0 mt-1 px-1 pb-20">
        <div className="flex flex-col flex-1 gap-1 min-w-0">
          <div className="flex gap-1 w-full min-w-0">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <Favorites />
              <AssetSelectorAndStats />
              <div className="flex gap-1">
                <div className="w-full h-full">
                  <Chart />
                </div>
                {isXl ? (
                  <div className="flex-none basis-[29.074%] min-w-[300px] h-[561px]">
                    <OrderBookTradesTabbedView />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="min-h-[450px]">
            <TradeTables className="h-full" />
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-none w-[40%] lg:max-w-xs xl:max-w-full xl:basis-[22.5%] xl:w-auto min-w-0">
          <div className="flex flex-col xl:flex-row w-full gap-1 xl:min-w-[280px] min-w-0">
            <div className="w-full min-h-[665px] min-w-0">
              <TradeWidget />
            </div>
            {isXl ? null : (
              <div className="w-full max-h-[671px] min-w-0">
                <OrderBookTradesTabbedView />
              </div>
            )}
          </div>

          <div className="min-h-[333px] min-w-0">
            <AccountManagement className="h-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
