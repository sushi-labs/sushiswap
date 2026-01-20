'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { Card } from '@sushiswap/ui'
import { Activity } from 'react'
import { AccountManagement } from '../account-management/account-management'
import { AssetSelectorAndStats } from '../asset-selector-and-stats'
import { TradeTables } from '../trade-tables/trade-tables'
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
          <Card className=" p-2 h-[460px] min-h-[350px]">
            trade comp and order book
          </Card>
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
