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
import { DCAOrdersTable } from '~evm/[chainId]/[trade]/_ui/swap/trade/tab-tables/dca-orders-table/dca-orders-table'
import { HistoryTable } from '~evm/[chainId]/[trade]/_ui/swap/trade/tab-tables/history-tables/history-table'
import { LimitOrdersTable } from '~evm/[chainId]/[trade]/_ui/swap/trade/tab-tables/limit-orders-table/limit-orders-table'
import {
  TABS,
  useTradeTablesContext,
} from '~evm/[chainId]/[trade]/_ui/swap/trade/tab-tables/trade-tables-context'
import { OpenOrdersTableFilters } from './open-order-table-filters'
import { OpenOrdersTableHeader } from './open-orders-table-header'

export const OpenOrdersTable = () => {
  return (
    <Card className="overflow-hidden dark:!bg-slate-800 !bg-slate-50">
      <OpenOrdersTableHeader />
      <TradeTableTabs />
    </Card>
  )
}

const useTabs = () => {
  const { orders, setCurrentTab, currentTab } = useTradeTablesContext()

  const tabs = useMemo(() => {
    const openLimitOrdersCount =
      orders && orders.length > 0
        ? getTwapLimitOrders(orders).filter(
            (order) => order.status === OrderStatus.Open,
          ).length
        : 0
    const openDcaOrdersCount =
      orders && orders.length > 0
        ? getTwapDcaOrders(orders).filter(
            (order) => order.status === OrderStatus.Open,
          ).length
        : 0

    return [
      {
        label: `Limit Orders ${openLimitOrdersCount > 0 ? `(${openLimitOrdersCount})` : ''}`,
        value: TABS.LIMIT_ORDERS,
        component: (
          <LimitOrdersTable
            tableRowClassName="dark:!border-[#FFFFFF14] !border-[#00000014]"
            mobileCardClassName="!border-none"
          />
        ),
      },
      {
        label: `DCA Orders ${openDcaOrdersCount > 0 ? `(${openDcaOrdersCount})` : ''}`,
        value: TABS.DCA_ORDERS,
        component: (
          <DCAOrdersTable
            tableRowClassName="dark:!border-[#FFFFFF14] !border-[#00000014]"
            mobileCardClassName="!border-none"
          />
        ),
      },
      {
        label: 'History',
        value: TABS.HISTORY,
        component: (
          <HistoryTable
            tableRowClassName="dark:!border-[#FFFFFF14] !border-[#00000014]"
            tableHeaderClassName="[&]:dark:!bg-slate-800 [&]:!bg-slate-50"
            mobileCardClassName="!rounded-t-none"
          />
        ),
      },
    ]
  }, [orders])

  return { tabs, setCurrentTab, currentTab }
}

const TradeTableTabs = () => {
  return <Content />
}

const Content = () => {
  const { tabs, setCurrentTab, currentTab } = useTabs()
  const { createQuery } = useCreateQuery()
  return (
    <Tabs
      id="open-orders-table"
      value={currentTab}
      defaultValue={tabs[0].value}
      onValueChange={(value) => setCurrentTab(value as TABS)}
    >
      <div className="flex overflow-x-auto flex-col flex-wrap gap-2 justify-between items-start px-4 pb-4 border-b border-accent md:items-center md:flex-row hide-scrollbar">
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
