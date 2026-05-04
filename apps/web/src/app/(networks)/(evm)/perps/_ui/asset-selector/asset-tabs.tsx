import { useLocalStorage } from '@sushiswap/hooks'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  classNames,
} from '@sushiswap/ui'
// import { BitcoinIcon } from '@sushiswap/ui/icons/BitcoinIcon'
import { BankIcon } from '@sushiswap/ui/icons/BankIcon'
import { CirclesIcon } from '@sushiswap/ui/icons/CirclesIcon'
import { ClockIcon } from '@sushiswap/ui/icons/ClockIcon'
import { InfinityIcon } from '@sushiswap/ui/icons/InfinityIcon'
import { LightningIcon } from '@sushiswap/ui/icons/LightningIcon'
import { useEffect } from 'react'
import { FavoriteIcon } from '../_common'
import { AllAssets } from './all-assets'
import { FavoriteAssets } from './favorite-assets'
import { HIP3Assets } from './hip-3-assets'
import { SpotAssets } from './spot-assets'
import { TradfiAssets } from './tradfi-assets'
// import { FireIcon } from '@sushiswap/ui/icons/FireIcon';

const TABS = [
  { value: 'all', icon: <ClockIcon className="w-3 h-3" /> },
  { value: 'perps', icon: <InfinityIcon className="w-3 h-3" /> },
  { value: 'spot', icon: <CirclesIcon className="w-3 h-3" /> },
  // { value: 'crypto', icon: <BitcoinIcon className="w-3 h-3" /> },
  { value: 'Tradfi', icon: <BankIcon className="w-3 h-3" /> },
  { value: 'HIP-3', icon: <LightningIcon className="w-3 h-3" /> },
  // { value: 'trending', icon: <FireIcon className="w-3 h-3" /> },
  { value: 'watchlist', icon: <FavoriteIcon className="w-3 h-3" /> },
] as const
type TabType = (typeof TABS)[number]['value']

export const AssetTabs = () => {
  const [selectedTab, setSelectedTab] = useLocalStorage<TabType>(
    'sushi.perps.selected-search-asset-tab',
    'all',
  )
  useEffect(() => {
    const toggleSelector = (event: KeyboardEvent) => {
      //select tabs with left and right arrow keys
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        const currentIndex = TABS.findIndex((tab) => tab.value === selectedTab)
        if (event.key === 'ArrowRight') {
          const nextIndex = (currentIndex + 1) % TABS.length
          setSelectedTab(TABS[nextIndex].value)
        } else {
          const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length
          setSelectedTab(TABS[prevIndex].value)
        }
      }
    }

    window.addEventListener('keydown', toggleSelector)
    return () => {
      window.removeEventListener('keydown', toggleSelector)
    }
  }, [selectedTab, setSelectedTab])

  return (
    <Tabs
      className="w-fit"
      value={selectedTab}
      onValueChange={(val) => {
        setSelectedTab(val as TabType)
      }}
    >
      <TabsList
        className="!flex w-fit overflow-x-auto !px-0 !mx-2 !h-8 bg-transparent border-transparent !justify-start hide-scrollbar overflow-y-hidden"
        style={{
          maxWidth: `calc(100vw - 16px)`,
        }}
      >
        {TABS.map((tab, idx) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex w-fit !px-1.5 !text-xs capitalize !bg-transparent !border-transparent"
          >
            {<span className="mr-1">{tab.icon}</span>}
            {tab.value}
            {idx !== TABS.length - 1 ? (
              <span className="h-[10px] w-px bg-perps-muted-20 ml-3" />
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>
      <div
        className={classNames(
          selectedTab !== 'HIP-3' &&
            selectedTab !== 'spot' &&
            selectedTab !== 'Tradfi'
            ? 'min-h-[88dvh] max-h-[88dvh] overflow-auto hide-scrollbar lg:min-h-[450px] lg:max-h-[450px] max-w-[100vw]'
            : '',
        )}
      >
        <TabsContent value="all" className="!mt-0">
          <AllAssets />
        </TabsContent>
        <TabsContent value="perps" className="!mt-0">
          <AllAssets filter="perps-only" />
        </TabsContent>
        <TabsContent value="spot" className="!mt-0">
          <SpotAssets />
        </TabsContent>
        <TabsContent value="Tradfi" className="!mt-0">
          <TradfiAssets />
        </TabsContent>
        <TabsContent value="HIP-3" className="!mt-0">
          <HIP3Assets />
        </TabsContent>
        <TabsContent value="watchlist" className="!mt-0">
          <FavoriteAssets />
        </TabsContent>
      </div>
    </Tabs>
  )
}
