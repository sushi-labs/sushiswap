'use client'

import { OrderStatus } from '@orbs-network/twap-sdk'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  getTwapDcaOrders,
  getTwapLimitOrders,
} from 'src/lib/hooks/react-query/twap'
import { DCAOrdersTable } from '../dca-orders-table/dca-orders-table'
import { HistoryTable } from '../history-tables/history-table'
import { LimitOrdersTable } from '../limit-orders-table/limit-orders-table'
import {
  TABS,
  TradeTablesProvider,
  useTradeTablesContext,
} from '../trade-tables-context'
import { TradeTableFilters } from './trade-table-filters'

const useTabs = () => {
  const { orders, setCurrentTab, currentTab, setHistoryTableTab } =
    useTradeTablesContext()

  const tabs = useMemo(() => {
    const openLimitOrdersCount = getTwapLimitOrders(orders).filter(
      (order) => order.status === OrderStatus.Open,
    ).length
    const openDcaOrdersCount = getTwapDcaOrders(orders).filter(
      (order) => order.status === OrderStatus.Open,
    ).length

    return [
      {
        label: `Limit Orders ${openLimitOrdersCount > 0 ? `(${openLimitOrdersCount})` : ''}`,
        value: TABS.LIMIT_ORDERS,
        component: <LimitOrdersTable />,
      },
      {
        label: `DCA Orders ${openDcaOrdersCount > 0 ? `(${openDcaOrdersCount})` : ''}`,
        value: TABS.DCA_ORDERS,
        component: <DCAOrdersTable />,
      },
      {
        label: 'History',
        value: TABS.HISTORY,
        component: <HistoryTable />,
      },
    ]
  }, [orders])

  return { tabs, setCurrentTab, currentTab, setHistoryTableTab }
}

export const TradeTableTabs = () => {
  return (
    <TradeTablesProvider>
      <Content />
    </TradeTablesProvider>
  )
}

const Content = () => {
  const { tabs, setCurrentTab, currentTab, setHistoryTableTab } = useTabs()
  return (
    <Tabs
      id="trade-table"
      defaultValue={tabs[0].value}
      onValueChange={(value) => {
        setCurrentTab(value as TABS)

        setHistoryTableTab(value === TABS.HISTORY ? 'market' : undefined)
      }}
      className="-mx-5 md:mx-0"
    >
      <div className="flex flex-col xl:pb-2 items-start justify-between xl:items-center xl:flex-row overflow-x-auto hide-scrollbar">
        <TabsList className="md:border-none !border-t-transparent border-b pb-4 md:pb-0 !px-5 md:!px-3 !md:border-b-none !h-fit rounded-b-none xl:!bg-background bg-white dark:bg-slate-900 !justify-start md:dark:bg-slate-800 w-full xl:w-fit gap-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="!bg-transparent !border-none !shadow-none !px-0  focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent"
            >
              <Button
                key={tab.value}
                asChild
                size="sm"
                variant={currentTab === tab.value ? 'tertiary' : 'ghost'}
                className={'select-none !gap-1'}
              >
                {tab.label}
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>

        <TradeTableFilters />
      </div>
      {tabs.map((tab) => {
        return (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="px-5 !mt-0 !pt-2 md:!pt-0 xl:!pt-2 bg-[#F9FAFB] dark:bg-slate-900 md:px-0 pb-[86px] md:bg-white xl:bg-transparent md:pb-0 rounded-b-xl"
          >
            {tab.component}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
