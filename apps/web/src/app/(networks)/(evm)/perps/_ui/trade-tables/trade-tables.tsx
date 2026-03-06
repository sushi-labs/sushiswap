import { Card, classNames, useBreakpoint } from '@sushiswap/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useUserActiveTwap } from 'src/lib/perps/subscription/use-user-active-twap'
import { useBalances } from 'src/lib/perps/use-balances'
import { useUserOpenOrders } from 'src/lib/perps/use-user-open-orders'
import { useUserPositions } from 'src/lib/perps/use-user-positions'
import { useAccount } from 'src/lib/wallet'
import { TradeFilter } from './filters/trade-filter'
import {
  TRADE_TABLES_TABS,
  type TradeTablesTabValue,
  useTradeTables,
} from './trade-tables-provider'

export const TradeTables = ({ className }: { className?: string }) => {
  const { isLg } = useBreakpoint('lg')
  const {
    state: { activeTab },
    mutate: { setActiveTab },
  } = useTradeTables()

  const ExtraFilter = useMemo(
    () => TRADE_TABLES_TABS.find((tab) => tab.value === activeTab)?.extraFilter,
    [activeTab],
  )

  const MobileChildren = useMemo(
    () =>
      TRADE_TABLES_TABS.find((tab) => tab.value === activeTab)?.mobileChildren,
    [activeTab],
  )

  const ActiveContent = useMemo(() => {
    return TRADE_TABLES_TABS.find((t) => t.value === activeTab)?.content
  }, [activeTab])
  const address = useAccount('evm')
  const { data: twapOrders } = useUserActiveTwap({ address })
  const { data: balances } = useBalances()
  const { data: userPositions } = useUserPositions()
  const { data: openOrders } = useUserOpenOrders({})
  const balanceCount = useMemo(() => balances?.length ?? 0, [balances?.length])
  const positionCount = useMemo(
    () => userPositions?.length ?? 0,
    [userPositions?.length],
  )
  const openOrdersCount = useMemo(
    () => openOrders?.length ?? 0,
    [openOrders?.length],
  )
  const twapOrderCount = useMemo(
    () => twapOrders?.states.length ?? 0,
    [twapOrders?.states.length],
  )

  const tabNameRewrite = useMemo(() => {
    return TRADE_TABLES_TABS.map((tab) => {
      if (tab.value === 'balances') {
        return {
          value: tab.value,
          name: `Balances${balanceCount ? ` (${balanceCount})` : ''}`,
        }
      }
      if (tab.value === 'positions') {
        return {
          value: tab.value,
          name: `Positions${positionCount ? ` (${positionCount})` : ''}`,
        }
      }
      if (tab.value === 'open-orders') {
        return {
          value: tab.value,
          name: `Open Orders${openOrdersCount ? ` (${openOrdersCount})` : ''}`,
        }
      }
      if (tab.value === 'twap') {
        return {
          value: tab.value,
          name: `TWAP ${twapOrderCount ? ` (${twapOrderCount})` : ''}`,
        }
      }
      return tab
    })
  }, [balanceCount, positionCount, openOrdersCount, twapOrderCount])

  return (
    <Card className={classNames('p-2', className ?? '')}>
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TradeTablesTabValue)}
      >
        <div className="flex flex-wrap justify-between p-1 gap-2 overflow-x-auto">
          <div className="hide-scrollbar overflow-x-auto">
            <TabsList className="!px-0 !h-8">
              {tabNameRewrite?.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="!px-1.5 !text-xs"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="items-center gap-2 whitespace-nowrap flex lg:max-w-fit justify-between w-full">
            {!isLg && activeTab === 'twap' ? null : <TradeFilter />}
            <div className="flex items-center justify-end gap-4 text-sm lg:text-base">
              {MobileChildren ? (
                <div className="flex lg:hidden">
                  <MobileChildren />
                </div>
              ) : null}
              {ExtraFilter ? <ExtraFilter /> : null}
            </div>
          </div>
        </div>
        {TRADE_TABLES_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div
              className={classNames(
                'p-2 !pt-0',
                tab.value !== 'twap'
                  ? 'max-h-[380px] hide-scrollbar overflow-y-auto'
                  : '',
              )}
            >
              <div>{ActiveContent ? <ActiveContent /> : null}</div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}
