import {
  Button,
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { useState } from 'react'
import { DCAOrdersHistoryTable } from './dca-history-table/dca-history-table'
import { LimitOrdersHistoryTable } from './limit-history-table/limit-history-table'
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
    <Card className="overflow-hidden border-none !shadow-none md:p-3 md:bg-slate-50 dark:md:bg-slate-800">
      <Tabs
        defaultValue={TABS[0].value}
        onValueChange={setCurrentTab}
        className="border-none bg-[#F9FAFB] dark:bg-slate-900 dark:md:!bg-slate-800 md:bg-white"
      >
        <TabsList className="w-full flex !bg-[#F9FAFB] dark:!bg-slate-900 dark:md:!bg-slate-800 rounded-none md:rounded-lg !justify-start border-none">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="!bg-transparent border-none !px-0 !shadow-none"
            >
              <Button
                size="sm"
                asChild
                variant={tab.value === currentTab ? 'secondary' : 'ghost'}
              >
                {tab.label}
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="py-2 bg-[#F9FAFB] dark:bg-slate-900 dark:md:!bg-slate-800" />

        <TabsContent
          value={TABS[0].value}
          className="border border-accent md:border-none rounded-xl !mt-0"
        >
          <MarketTable />
        </TabsContent>
        <TabsContent
          value={TABS[1].value}
          className="border border-accent md:border-none rounded-xl !mt-0"
        >
          <LimitOrdersHistoryTable />
        </TabsContent>
        <TabsContent
          value={TABS[2].value}
          className="border border-accent md:border-none rounded-xl !mt-0"
        >
          <DCAOrdersHistoryTable />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
