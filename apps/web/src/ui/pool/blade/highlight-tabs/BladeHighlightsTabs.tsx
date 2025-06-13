'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import type { FC } from 'react'
import { useState } from 'react'
import { TabNavigation } from './TabNavigation'
import { MevProofTab } from './mev-proof'
import { NoImpermanentLossTab } from './no-impermanent-loss'
import { SuperiorYieldsTab } from './superior-yields'

interface BladeHighlightsTabsProps {
  pool: BladePool
}

type TabType = 'superior-yields' | 'no-impermanent-loss' | 'mev-proof'

export const BladeHighlightsTabs: FC<BladeHighlightsTabsProps> = ({ pool }) => {
  const [activeTab, setActiveTab] = useState<TabType>('superior-yields')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'superior-yields':
        return <SuperiorYieldsTab pool={pool} />
      case 'no-impermanent-loss':
        return <NoImpermanentLossTab pool={pool} />
      case 'mev-proof':
        return <MevProofTab pool={pool} />
      default:
        return <SuperiorYieldsTab pool={pool} />
    }
  }

  return (
    <div className="relative flex w-full flex-col items-center gap-8 lg:gap-[54px]">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderTabContent()}
      <div className="-left-[300px] pointer-events-none absolute top-0 hidden h-[410px] w-[590px] flex-shrink-0 rounded-[590px] bg-[#D1B6ED] opacity-20 blur-[100px] lg:block dark:opacity-10" />
    </div>
  )
}
