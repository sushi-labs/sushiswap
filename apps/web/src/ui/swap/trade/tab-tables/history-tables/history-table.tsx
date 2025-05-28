import {
  Button,
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { useState } from 'react'
import { DCAOrdersHistoryTable } from './dca-history-table'
import { LimitOrdersHistoryTable } from './limit-history-table'
import { MarketTable } from './market-history-table/market-history-table'

export const TABS = [
  {
    label: 'Market',
    value: 'market',
  },
  {
    label: 'Limit',
    value: 'limit',
  },
  {
    label: 'DCA',
    value: 'dca',
  },
]

export const HistoryTable = () => {
  const [currentTab, setCurrentTab] = useState(TABS[0].value)

  return (
    <Card className="p-3 overflow-hidden border-none bg-slate-50 dark:bg-slate-800">
      <Tabs
        defaultValue={TABS[0].value}
        onValueChange={setCurrentTab}
        className="border-none"
      >
        <TabsList className="bg-transparent border-none">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="!bg-transparent border-none !px-0 !shadow-none"
            >
              <Button
                size="sm"
                variant={tab.value === currentTab ? 'secondary' : 'ghost'}
              >
                {tab.label}
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={TABS[0].value}>
          <MarketTable />
        </TabsContent>
        <TabsContent value={TABS[1].value}>
          <LimitOrdersHistoryTable />
        </TabsContent>
        <TabsContent value={TABS[2].value}>
          <DCAOrdersHistoryTable />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
