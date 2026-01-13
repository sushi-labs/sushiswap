import { classNames } from '@sushiswap/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import { TradeFilter } from './filters/trade-filter'
import {
  TRADE_TABLES_TABS,
  type TradeTablesTabValue,
  useTradeTables,
} from './trade-tables-provider'

export const TradeTables = ({ className }: { className?: string }) => {
  const {
    state: { activeTab },
    mutate: { setActiveTab },
  } = useTradeTables()
  const ExtraFilter = useMemo(
    () => TRADE_TABLES_TABS.find((tab) => tab.value === activeTab)?.extraFilter,
    [activeTab],
  )

  const ActiveContent = useMemo(() => {
    return TRADE_TABLES_TABS.find((t) => t.value === activeTab)?.content
  }, [activeTab])

  return (
    <div className={classNames('bg-teal-500/50 border ', className ?? '')}>
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TradeTablesTabValue)}
      >
        <div className="flex flex-wrap justify-between p-1 gap-2 overflow-x-auto">
          <div className="hide-scrollbar overflow-x-auto">
            <TabsList className="!px-0 !h-8">
              {TRADE_TABLES_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="!px-1.5 !text-xs"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="items-center gap-2 whitespace-nowrap flex lg:max-w-fit justify-between w-full">
            <TradeFilter />
            {ExtraFilter ? <ExtraFilter /> : null}
          </div>
        </div>
        {TRADE_TABLES_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="p-2 !pt-0">
              <div>{ActiveContent ? <ActiveContent /> : null}</div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
