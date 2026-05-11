import { useLocalStorage } from '@sushiswap/hooks'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  classNames,
} from '@sushiswap/ui'
import { PerpsCard } from './_common/perps-card'
import { OrderBook } from './order-book/order-book'
import { OrderBookSideToggle } from './order-book/order-book-side-toggle'
import { Trades } from './trades'

const TABS = [
  {
    title: 'Order Book',
    value: 'order-book' as const,
  },
  {
    title: 'Trades',
    value: 'trades' as const,
  },
]

type OBTTab = (typeof TABS)[number]['value']

export const OrderBookTradesTabbedView = () => {
  const [tab, setTab] = useLocalStorage<OBTTab>(
    'sushi.perps.obt-layout-tab',
    'order-book',
  )
  return (
    <PerpsCard className="p-0 !overflow-hidden" fullHeight>
      <Tabs
        className="w-full h-full"
        value={tab}
        onValueChange={(value) => setTab(value as OBTTab)}
      >
        <div className="flex items-center justify-between px-2">
          <TabsList className="!flex !bg-transparent border-0 gap-2 !pt-0 !h-8">
            <TabsTrigger
              value="order-book"
              className="flex flex-1 !bg-transparent border-0"
              asChild
            >
              <button
                className={classNames(
                  '!p-0 w-full col-span-1 capitalize !text-xs',
                  tab === 'order-book' ? 'text-[#EDF0F3]' : 'text-[#EDF0F380]',
                )}
                type="button"
              >
                Order Book
              </button>
            </TabsTrigger>
            <TabsTrigger
              value="trades"
              className="flex flex-1 !bg-transparent border-0"
              asChild
            >
              <button
                className={classNames(
                  '!p-0 w-full col-span-1 capitalize !text-xs',
                  tab === 'trades' ? 'text-[#EDF0F3]' : 'text-[#EDF0F380]',
                )}
                type="button"
              >
                Trades
              </button>
            </TabsTrigger>
          </TabsList>
          {tab === 'order-book' ? <OrderBookSideToggle /> : <div />}
        </div>
        <TabsContent value="order-book" className="!mt-0">
          <OrderBook />
        </TabsContent>
        <TabsContent value="trades" className="!mt-0 px-1.5">
          <Trades />
        </TabsContent>
      </Tabs>
    </PerpsCard>
  )
}
