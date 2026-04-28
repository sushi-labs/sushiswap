import { useLocalStorage } from '@sushiswap/hooks'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  classNames,
} from '@sushiswap/ui'
import { AllAssets } from './all-assets'
import { FavoriteAssets } from './favorite-assets'
import { HIP3Assets } from './hip-3-assets'
import { SpotAssets } from './spot-assets'
import { TradfiAssets } from './tradfi-assets'

const TABS = ['all', 'perps', 'spot', 'Tradfi', 'HIP-3', 'favorites'] as const
type TabType = (typeof TABS)[number]

export const AssetTabs = () => {
  const [selectedTab, setSelectedTab] = useLocalStorage<TabType>(
    'sushi.perps.selected-search-asset-tab',
    'all',
  )
  return (
    <Tabs
      className="w-fit"
      value={selectedTab}
      onValueChange={(val) => {
        setSelectedTab(val as TabType)
      }}
    >
      <TabsList className="!flex w-fit !px-0 !mx-2 !h-8 bg-secondary">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="flex w-fit !px-1.5 !text-xs capitalize"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <div
        className={classNames(
          'mt-2',
          selectedTab !== 'HIP-3' &&
            selectedTab !== 'spot' &&
            selectedTab !== 'Tradfi'
            ? 'min-h-[88dvh] max-h-[88dvh] hide-scrollbar lg:min-h-[450px] lg:max-h-[450px] overflow-auto max-w-[100vw]'
            : '',
        )}
      >
        <TabsContent value="all">
          <AllAssets />
        </TabsContent>
        <TabsContent value="perps">
          <AllAssets filter="perps-only" />
        </TabsContent>
        <TabsContent value="spot">
          <SpotAssets />
        </TabsContent>
        <TabsContent value="Tradfi">
          <TradfiAssets />
        </TabsContent>
        <TabsContent value="HIP-3">
          <HIP3Assets />
        </TabsContent>
        <TabsContent value="favorites">
          <FavoriteAssets />
        </TabsContent>
      </div>
    </Tabs>
  )
}
