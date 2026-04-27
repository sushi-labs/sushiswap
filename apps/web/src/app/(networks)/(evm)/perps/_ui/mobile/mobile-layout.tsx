'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { AssetSelectorAndStats, GeoBlockedMessage } from '../_common'
import { AccountManagement } from '../account-management'
import { Chart } from '../chart'
import { Favorites } from '../favorites'
import { OrderBookTradesTabbedView } from '../order-book-trades-tabbed-view'
import { TradeTables } from '../trade-tables'
import { TradeWidget } from '../trade-widget'
import { FooterNav } from './footer-nav'

export type PerpsMobileViewType = 'order' | 'charts'

export const MobileLayout = () => {
  const [view, setView] = useLocalStorage<PerpsMobileViewType>(
    'sushi.perps.mobile-layout-tab',
    'order',
  )
  return (
    <div className="pb-[75px] w-full h-full min-h-[calc(100vh-96px)] overflow-x-hidden px-1">
      <GeoBlockedMessage />
      <div className="flex flex-col gap-1">
        {view === 'order' ? (
          <>
            <AssetSelectorAndStats />
            <TradeWidget />
            <AccountManagement />
          </>
        ) : (
          <>
            <Favorites />
            <AssetSelectorAndStats />
            <Chart />
            <OrderBookTradesTabbedView />
            <TradeTables />
          </>
        )}
      </div>
      <FooterNav view={view} setView={setView} />
    </div>
  )
}
