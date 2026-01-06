import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  TWAP_TABLES_TABS,
  type TwapTableTabValue,
  useTradeTables,
} from '../trade-tables-provider'

export const TwapTables = () => {
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

      {TWAP_TABLES_TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="p-4">
            <div>{ActiveContent ? <ActiveContent /> : null}</div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
