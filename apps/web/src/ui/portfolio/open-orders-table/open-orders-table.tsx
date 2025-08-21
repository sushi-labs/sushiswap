import { OrderStatus } from '@orbs-network/twap-sdk'
import {
  Button,
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  getTwapDcaOrders,
  getTwapLimitOrders,
} from 'src/lib/hooks/react-query/twap'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { DCAOrdersTable } from 'src/ui/swap/trade/tab-tables/dca-orders-table/dca-orders-table'
import { HistoryTable } from 'src/ui/swap/trade/tab-tables/history-tables/history-table'
import { LimitOrdersTable } from 'src/ui/swap/trade/tab-tables/limit-orders-table/limit-orders-table'
import {
  TABS,
  TradeTablesProvider,
  useTradeTablesContext,
} from 'src/ui/swap/trade/tab-tables/trade-tables-context'
import { OpenOrdersTableFilters } from './open-order-table-filters'
import { OpenOrdersTableHeader } from './open-orders-table-header'

export const OpenOrdersTable = () => {
  return (
    // <InfiniteScroll
    //   dataLength={data.length}
    //   next={fetchNextPage}
    //   hasMore={data.length < (count ?? 0)}
    //   loader={
    //     <div className="flex justify-center w-full py-4">
    //       <Loader size={16} />
    //     </div>
    //   }
    // >
    <Card className="overflow-hidden dark:!bg-slate-800 !bg-slate-50">
      <OpenOrdersTableHeader />
      <TradeTableTabs />
    </Card>
    // </InfiniteScroll>
  )
}

const useTabs = () => {
  const { orders, setCurrentTab, currentTab } = useTradeTablesContext()

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

  return { tabs, setCurrentTab, currentTab }
}

const TradeTableTabs = () => {
  return (
    <TradeTablesProvider>
      <Content />
    </TradeTablesProvider>
  )
}

const Content = () => {
  const { tabs, setCurrentTab, currentTab } = useTabs()
  const { createQuery } = useCreateQuery()
  return (
    <Tabs
      id="open-orders-table"
      defaultValue={tabs[0].value}
      onValueChange={(value) => setCurrentTab(value as TABS)}
      // className="-mx-5 md:mx-0"
    >
      <div className="flex flex-col items-start border-b border-accent gap-2 px-4 pb-4 justify-between md:items-center md:flex-row flex-wrap overflow-x-auto hide-scrollbar">
        <TabsList className="border-none bg-transparent !px-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="!bg-transparent !border-none !shadow-none !px-0 !pr-2 focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent"
              onClick={() => {
                createQuery([
                  {
                    name: 'table-tab',
                    value: tab.value,
                  },
                  {
                    name: 'history-table-tab',
                    value: tab.value === 'history' ? 'market' : null,
                  },
                ])
              }}
            >
              <Button
                key={tab.value}
                asChild
                size="sm"
                variant={currentTab === tab.value ? 'networks' : 'ghost'}
                className={'select-none !gap-1'}
              >
                {tab.label}
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>

        <OpenOrdersTableFilters />
      </div>
      {tabs.map((tab) => {
        return (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
