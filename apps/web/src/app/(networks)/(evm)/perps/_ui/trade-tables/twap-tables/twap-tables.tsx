import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  classNames,
  useBreakpoint,
} from '@sushiswap/ui'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { TradeFilter } from '../filters'
import {
  TWAP_TABLES_TABS,
  type TwapTableTabValue,
  useTradeTables,
} from '../trade-tables-provider'

export const TwapTables = () => {
  const { isLg } = useBreakpoint('lg')
  const pathname = usePathname()
  const isPortfolio = pathname === '/perps/portfolio'
  const {
    state: { activeTwapTab },
    mutate: { setActiveTwapTab },
  } = useTradeTables()
  const ActiveContent = useMemo(() => {
    return TWAP_TABLES_TABS.find((t) => t.value === activeTwapTab)?.content
  }, [activeTwapTab])
  return (
    <Tabs
      value={activeTwapTab}
      onValueChange={(val) => setActiveTwapTab(val as TwapTableTabValue)}
    >
      <div className="flex items-center justify-between">
        {!isLg ? <TradeFilter /> : null}
        <TabsList
          className={classNames(
            '!px-0.5 !h-8 !bg-[#0D1421]',
            isPortfolio && '!bg-[#18223B]',
          )}
        >
          {TWAP_TABLES_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="!px-1.5 !py-.5 !text-xs"
              asChild
            >
              <Button
                size="xs"
                variant={
                  activeTwapTab === tab.value ? 'perps-secondary' : 'ghost'
                }
                className="!p-0 w-full col-span-1 capitalize !text-xs !rounded-md"
              >
                {tab.name}
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {TWAP_TABLES_TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="p-2 !pt-0 max-h-[335px] hide-scrollbar overflow-y-auto">
            <div>{ActiveContent ? <ActiveContent /> : null}</div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
