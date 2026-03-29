'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { AssetSelectorAndStats } from '../_common'
import { AccountManagement } from '../account-management'
import { TradeTables } from '../trade-tables'
import { TradeWidget } from '../trade-widget'
import { FooterNav } from './footer-nav'
import { TabbedView } from './tabbed-view'

export type PerpsMobileViewType = 'markets' | 'trade' | 'account'

export const MobileLayout = () => {
  const [view, setView] = useLocalStorage<PerpsMobileViewType>(
    'sushi.perps.mobile-layout-tab',
    'markets',
  )
  return (
    <div className="pb-[52px] w-full h-full min-h-[calc(100vh-96px)]">
      <div className="flex flex-col gap-1 pt-2">
        {view !== 'account' ? <AssetSelectorAndStats /> : null}
        {view === 'markets' ? <TabbedView /> : null}
        {view === 'trade' ? <TradeWidget className="min-h-[380px]" /> : null}
        {view === 'account' ? (
          <AccountManagement className="min-h-[calc(100vh-116px)] rounded-b-none justify-between" />
        ) : null}
        {view !== 'account' ? <TradeTables className="min-h-[300px]" /> : null}
      </div>
      <FooterNav view={view} setView={setView} />
    </div>
  )
}
