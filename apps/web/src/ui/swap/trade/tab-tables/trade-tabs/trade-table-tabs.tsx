'use client'

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { DCAOrdersTable } from '../dca-orders-table/dca-orders-table'
import { HistoryTable } from '../history-tables/history-table'
import { LimitOrdersTable } from '../limit-orders-table/limit-orders-table'
import { TradeTableFilters } from './trade-table-filters'

export const TABS = [
  {
    label: 'Limit Orders (2)',
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
  const [currentTab, setCurrentTab] = useState(TABS[0].value)
  const { theme } = useTheme()

  return (
    <Tabs
      defaultValue={TABS[0].value}
      onValueChange={setCurrentTab}
      className="-mx-5 md:mx-0"
    >
      <div className="flex flex-col items-start justify-between xl:items-center xl:flex-row">
        <div className="w-full p-3 bg-white border-b rounded-t-lg xl:px-0 md:border-none xl:!bg-background dark:bg-background md:dark:bg-slate-800 border-accent">
          <TabsList className="!px-2.5 w-full md:!px-0 gap-2 md:!pb-0 !pb-6 !justify-start bg-white xl:!bg-transparent dark:bg-background md:dark:bg-slate-800 !border-none rounded-none shadow-none md:rounded-lg md:border-none md:mx-0 xl:rounded-lg !rounded-b-none">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="!bg-transparent xl:!bg-background !border-none !shadow-none !px-0"
              >
                <Button
                  key={tab.value}
                  asChild
                  size="sm"
                  variant={
                    currentTab === tab.value
                      ? theme === 'dark'
                        ? 'quaternary'
                        : 'quinary'
                      : 'ghost'
                  }
                  className="select-none !gap-1"
                >
                  {tab.label}
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TradeTableFilters />
      </div>
      <TabsContent
        value={TABS[0].value}
        className="px-5 !mt-0 !pt-2 md:!pt-0 xl:!pt-2 bg-[#F9FAFB] dark:bg-slate-900 md:px-0 pb-[86px] md:bg-white xl:bg-transparent md:pb-0 rounded-b-xl"
      >
        <LimitOrdersTable />
      </TabsContent>
      <TabsContent
        value={TABS[1].value}
        className="px-5 !mt-0 !pt-2 md:!pt-0 xl:!pt-2 bg-[#F9FAFB] dark:bg-slate-900 md:px-0 pb-[86px] md:bg-white xl:bg-transparent md:pb-0 rounded-b-xl"
      >
        <DCAOrdersTable />
      </TabsContent>
      <TabsContent
        value={TABS[2].value}
        className="px-5 !mt-0 !pt-2 md:!pt-0 xl:!pt-2 bg-[#F9FAFB] dark:bg-slate-900 md:px-0 pb-[86px] md:bg-white xl:bg-transparent md:pb-0 rounded-b-xl"
      >
        <HistoryTable />
      </TabsContent>
    </Tabs>
  )
}
