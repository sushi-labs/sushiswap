import { Button, classNames, useBreakpoint } from '@sushiswap/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import {
  useBalances,
  useUserActiveTwap,
  useUserOpenOrders,
  useUserPositions,
} from 'src/lib/perps'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet'
import { PerpsCard } from '../_common/perps-card'
import { TradeFilter } from './filters'
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
  const pathname = usePathname()
  const isPortfolio = pathname === '/perps/portfolio'

  const TABS = useMemo(() => {
    if (isPortfolio) {
      return TRADE_TABLES_TABS
    }
    return TRADE_TABLES_TABS.filter(
      (tab) => tab.value !== 'interest' && tab.value !== 'deposits-withdrawals',
    )
  }, [isPortfolio])

  const ExtraFilter = useMemo(
    () => TABS.find((tab) => tab.value === activeTab)?.extraFilter,
    [activeTab, TABS],
  )

  const MobileChildren = useMemo(
    () => TABS.find((tab) => tab.value === activeTab)?.mobileChildren,
    [activeTab, TABS],
  )

  const ActiveContent = useMemo(() => {
    return TABS.find((t) => t.value === activeTab)?.content
  }, [activeTab, TABS])
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
    return TABS.map((tab) => {
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
  }, [balanceCount, positionCount, openOrdersCount, twapOrderCount, TABS])

  return (
    <PerpsCard className={classNames('py-2', className ?? '')}>
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TradeTablesTabValue)}
      >
        <div className="flex flex-wrap justify-between p-1 gap-2 hide-scrollbar overflow-x-auto">
          <PerpsCard className="hide-scrollbar overflow-x-auto" rounded="full">
            <TabsList
              className={classNames(
                '!px-0.5 !h-8 !bg-perps-muted/[.02] !rounded-full !border-transparent',
              )}
            >
              {tabNameRewrite?.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="!px-1.5 !text-xs"
                  asChild
                >
                  <Button
                    size="xs"
                    variant={
                      activeTab === tab.value ? 'perps-secondary' : 'ghost'
                    }
                    className="!p-0 w-full col-span-1 capitalize !text-xs !rounded-full !border-0"
                  >
                    {tab.name}
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>
          </PerpsCard>
          <div className="items-center gap-2 whitespace-nowrap flex lg:max-w-fit justify-between w-full">
            {(!isLg && activeTab === 'twap') ||
            activeTab === 'deposits-withdrawals' ? null : (
              <TradeFilter />
            )}
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
        {TABS.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="relative !mt-0"
          >
            {!address ? (
              <div className="absolute inset-0 backdrop-blur-sm z-10 select-none flex items-center justify-center rounded-md">
                <div>
                  <ConnectButton namespace="evm" variant="perps-default" />
                </div>
              </div>
            ) : null}
            <div
              className={classNames(
                'py-2 !pt-0',
                tab.value !== 'twap'
                  ? 'min-h-[250px] max-h-[380px] hide-scrollbar overflow-y-auto'
                  : '',
              )}
            >
              <div>{ActiveContent ? <ActiveContent /> : null}</div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </PerpsCard>
  )
}
