'use client'

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { NotificationBadge } from 'src/lib/wagmi/components/user-portfolio/notification-badge'
import { LPPositionsTable } from '../lp-positions-table/lp-positions-table'
import { OpenOrdersTable } from '../open-orders-table/open-orders-table'
import {
  PORTFOLIO_TABLE_VIEW,
  TablesProvider,
  useTablesContext,
} from './table-context'

export const TablesView = () => {
  return (
    <TablesProvider>
      <Content />
    </TablesProvider>
  )
}

const useTabs = () => {
  const { tableView, setTableView } = useTablesContext()

  const tabs = useMemo(() => {
    // const openLimitOrdersCount = getTwapLimitOrders(orders).filter(
    //   (order) => order.status === OrderStatus.Open,
    // ).length
    // const openDcaOrdersCount = getTwapDcaOrders(orders).filter(
    //   (order) => order.status === OrderStatus.Open,
    // ).length

    const totalLPPositionsCount = 1 // Placeholder for actual count logic
    const totalOpenOrdersCount = 10 // Placeholder for actual count logic

    return [
      {
        label: `All`,
        count: 0,
        value: PORTFOLIO_TABLE_VIEW.ALL,
        component: (
          <div className="flex flex-col gap-6">
            <LPPositionsTable />
            <OpenOrdersTable />
          </div>
        ),
      },
      {
        label: `LP Positions`,
        count: totalLPPositionsCount,
        value: PORTFOLIO_TABLE_VIEW.LP_POSITIONS,
        component: <LPPositionsTable />,
      },
      {
        label: `Open Orders`,
        count: totalOpenOrdersCount,
        value: PORTFOLIO_TABLE_VIEW.OPEN_ORDERS,
        component: <OpenOrdersTable />,
      },
    ]
  }, [])

  return { tabs, setTableView, tableView }
}

const Content = () => {
  const { tabs, setTableView, tableView } = useTabs()
  const { createQuery } = useCreateQuery()
  return (
    <Tabs
      id="trade-table"
      defaultValue={tabs[0].value}
      onValueChange={(value) => setTableView(value as PORTFOLIO_TABLE_VIEW)}
    >
      <TabsList className="border-none !px-0 gap-2">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="!bg-transparent !border-none !shadow-none !px-0  focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent"
            onClick={() => {
              createQuery([
                {
                  name: 'portfolio-table-tab',
                  value: encodeURIComponent(tab.value),
                },
              ])
            }}
          >
            <Button
              key={tab.value}
              asChild
              size="sm"
              variant={tableView === tab.value ? 'tertiary' : 'ghost'}
              className={'select-none !gap-1'}
            >
              {tab.label}
              {tab.count > 0 ? (
                <NotificationBadge notificationCount={tab.count} size="sm" />
              ) : null}
            </Button>
          </TabsTrigger>
        ))}
      </TabsList>
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
