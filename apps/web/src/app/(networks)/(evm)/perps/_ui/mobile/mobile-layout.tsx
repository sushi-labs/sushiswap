'use client'
import { Activity, useState } from 'react'
import { PerpTokenSelector } from '../perp-token-selector'
import { TradeTables } from '../trade-tables/trade-tables'
import { FooterNav } from './footer-nav'
import { TabbedView } from './tabbed-view'

export type PerpsMobileViewType = 'markets' | 'trade' | 'account'

export const MobileLayout = () => {
  const [view, setView] = useState<PerpsMobileViewType>('markets')
  return (
    <div className="pb-[52px] bg-red-500/70 w-full h-full min-h-[calc(100vh-96px)]">
      <div className="flex flex-col gap-1 pt-2 bg-green-500/20 ">
        <Activity mode={view === 'account' ? 'hidden' : 'visible'}>
          <PerpTokenSelector />
        </Activity>
        <Activity mode={view === 'markets' ? 'visible' : 'hidden'}>
          <TabbedView />
        </Activity>
        <Activity mode={view === 'trade' ? 'visible' : 'hidden'}>
          <div className="bg-yellow-500/50 border p-2 h-[460px] min-h-[350px]">
            trade comp and order book
          </div>
        </Activity>
        <Activity mode={view === 'account' ? 'visible' : 'hidden'}>
          <div className="bg-orange-500/50 border p-2 min-h-[calc(100vh-118px)]">
            full account view
          </div>
        </Activity>
        <Activity mode={view === 'account' ? 'hidden' : 'visible'}>
          <TradeTables className="min-h-[300px]" />
        </Activity>
      </div>
      <FooterNav view={view} setView={setView} />
    </div>
  )
}
