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

export const HistoryTable = ({
  tableRowClassName = '',
  tableHeaderClassName = '',
  mobileCardClassName = '',
}: {
  tableRowClassName?: string
  tableHeaderClassName?: string
  mobileCardClassName?: string
}) => {
  const { historyTableTab, setHistoryTableTab } = useTradeTablesContext()

  return (
    <Card className="overflow-hidden border-none !shadow-none lg:px-3 lg:pt-3 xl:bg-red-white dark:lg:bg-slate-800 !rounded-lg lg:!rounded-none">
      <Tabs
        defaultValue={historyTableTab}
        onValueChange={(value: string) => {
          setHistoryTableTab(value as typeof historyTableTab)
        }}
        className={classNames(
          'border-none bg-[#F9FAFB] dark:bg-slate-900 dark:md:!bg-slate-800 md:bg-white',
          tableHeaderClassName,
        )}
      >
        <TabsList
          className={classNames(
            'w-full gap-2 flex !bg-[#F9FAFB] md:!bg-white dark:!bg-slate-900 dark:md:!bg-slate-800 rounded-none md:rounded-lg !justify-start border-none',
            tableHeaderClassName,
          )}
        >
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
        <div
          className={classNames(
            'py-2 bg-[#F9FAFB] md:bg-white dark:bg-slate-900 dark:md:!bg-slate-800',
            tableHeaderClassName,
          )}
        />

        <TabsContent
          value={HISTORY_TABLE_TABS[0].value}
          className="border border-accent md:border-none rounded-xl !mt-0"
        >
          <MarketTable
            tableRowClassName={tableRowClassName}
            mobileCardClassName={mobileCardClassName}
          />
        </TabsContent>
        <TabsContent
          value={HISTORY_TABLE_TABS[1].value}
          className="border border-accent md:border-none rounded-xl !mt-0"
        >
          <LimitOrdersHistoryTable
            tableRowClassName={tableRowClassName}
            mobileCardClassName={mobileCardClassName}
          />
        </TabsContent>
        <TabsContent
          value={HISTORY_TABLE_TABS[2].value}
          className="border border-accent md:border-none rounded-xl !mt-0"
        >
          <DCAOrdersHistoryTable
            tableRowClassName={tableRowClassName}
            mobileCardClassName={mobileCardClassName}
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
