'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { Activity } from 'react'
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
        <Activity mode={view === 'account' ? 'hidden' : 'visible'}>
          <AssetSelectorAndStats />
        </Activity>
        <Activity mode={view === 'markets' ? 'visible' : 'hidden'}>
          <TabbedView />
        </Activity>
        <Activity mode={view === 'trade' ? 'visible' : 'hidden'}>
          <TradeWidget className="min-h-[380px]" />
        </Activity>
        <Activity mode={view === 'account' ? 'visible' : 'hidden'}>
          <AccountManagement className="min-h-[calc(100vh-116px)] rounded-b-none justify-between" />
        </Activity>
        <Activity mode={view === 'account' ? 'hidden' : 'visible'}>
          <TradeTables className="min-h-[300px]" />
        </Activity>
      </div>
      <FooterNav view={view} setView={setView} />
    </div>
  )
}
