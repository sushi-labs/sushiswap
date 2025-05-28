import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { DCAOrdersTable } from '../dca-orders-table/dca-orders-table'
import { HistoryTable } from '../history-table/history-table'
import { LimitOrdersTable } from '../limit-orders-table/limit-orders-table'

export const TABS = [
  {
    label: 'Limit Orders',
    value: 'limit-orders',
  },
  {
    label: 'DCA Orders',
    value: 'dca-orders',
  },
  {
    label: 'History',
    value: 'history',
  },
]

export const TradeTableTabs = () => {
  return (
    <Tabs defaultValue={TABS[0].value}>
      <TabsList className="border-none">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-white dark:data-[state=active]:text-skyblue dark:data-[state=active]:bg-[#3DB1FF14] border-none"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={TABS[0].value}>
        <LimitOrdersTable />
      </TabsContent>
      <TabsContent value={TABS[1].value}>
        <DCAOrdersTable />
      </TabsContent>
      <TabsContent value={TABS[2].value}>
        <HistoryTable />
      </TabsContent>
    </Tabs>
  )
}
