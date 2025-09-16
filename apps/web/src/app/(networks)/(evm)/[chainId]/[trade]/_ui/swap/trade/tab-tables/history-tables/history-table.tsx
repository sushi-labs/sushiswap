import {
  Button,
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  classNames,
} from '@sushiswap/ui'
import {
  HISTORY_TABLE_TABS,
  useTradeTablesContext,
} from '../trade-tables-context'
import { DCAOrdersHistoryTable } from './dca-history-table/dca-history-table'
import { LimitOrdersHistoryTable } from './limit-history-table/limit-history-table'
import { MarketTable } from './market-history-table/market-history-table'

export const HistoryTable = () => {
  const { historyTableTab, setHistoryTableTab } = useTradeTablesContext()
  return (
    <Card className="overflow-hidden border-none !shadow-none md:px-3 md:pt-3 xl:bg-red-white dark:md:bg-slate-800 rounded-t-none xl:rounded-lg">
      <Tabs
        value={historyTableTab}
        onValueChange={(value: string) => {
          setHistoryTableTab(value as typeof historyTableTab)
        }}
        className="border-none bg-[#F9FAFB] dark:bg-slate-900 dark:md:!bg-slate-800 md:bg-white"
      >
        <TabsList className="w-full gap-2 flex !bg-[#F9FAFB] md:!bg-white dark:!bg-slate-900 dark:md:!bg-slate-800 rounded-none md:rounded-lg !justify-start border-none">
          {HISTORY_TABLE_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="!bg-transparent border-none !px-0 !shadow-none focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent"
            >
              <Button
                size="sm"
                asChild
                variant={tab.value === historyTableTab ? 'secondary' : 'ghost'}
                className={classNames(
                  tab.value === historyTableTab
                    ? '!bg-slate-200 dark:!bg-slate-750'
                    : '',
                )}
              >
                {tab.label}
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="py-2 bg-[#F9FAFB] md:bg-white dark:bg-slate-900 dark:md:!bg-slate-800" />

        <TabsContent
          value={HISTORY_TABLE_TABS[0].value}
          className="border border-accent md:border-none rounded-xl !mt-0"
        >
          <MarketTable />
        </TabsContent>
        <TabsContent
          value={HISTORY_TABLE_TABS[1].value}
          className="border border-accent md:border-none rounded-xl !mt-0"
        >
          <LimitOrdersHistoryTable />
        </TabsContent>
        <TabsContent
          value={HISTORY_TABLE_TABS[2].value}
          className="border border-accent md:border-none rounded-xl !mt-0"
        >
          <DCAOrdersHistoryTable />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
