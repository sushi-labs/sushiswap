import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useBreakpoint,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { TradeFilter } from '../filters/trade-filter'
import {
  TWAP_TABLES_TABS,
  type TwapTableTabValue,
  useTradeTables,
} from '../trade-tables-provider'

export const TwapTables = () => {
  const { isLg } = useBreakpoint('lg')
  const {
    state: { activeTwapTab },
    mutate: { setActiveTwapTab },
  } = useTradeTables()
  const ActiveContent = useMemo(() => {
    return TWAP_TABLES_TABS.find((t) => t.value === activeTwapTab)?.content
  }, [activeTwapTab])
  return (
    <Tabs
      value={activeTwapTab}
      onValueChange={(val) => setActiveTwapTab(val as TwapTableTabValue)}
    >
      <div className="flex items-center justify-between">
        {!isLg ? <TradeFilter /> : null}
        <TabsList className="!px-0 !h-8">
          {TWAP_TABLES_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="!px-1.5 !py-.5 !text-xs"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {TWAP_TABLES_TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="p-2 !pt-0 max-h-[335px] hide-scrollbar overflow-y-auto">
            <div>{ActiveContent ? <ActiveContent /> : null}</div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
