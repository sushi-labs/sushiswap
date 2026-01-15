import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { OrderBook } from '../order-book/order-book'
import { Trades } from '../trades'

export const DESKTOP_TABS = [
  {
    title: 'Order Book',
    value: 'order-book' as const,
  },
  {
    title: 'Trades',
    value: 'trades' as const,
  },
]

export type DesktopTab = (typeof DESKTOP_TABS)[number]['value']

export const DesktopTabbedView = ({
  tab,
  setTab,
}: {
  tab: DesktopTab
  setTab: (tab: DesktopTab) => void
}) => {
  return (
    <Card className="p-2 h-full">
      <Tabs
        className="w-full h-full"
        value={tab}
        onValueChange={(value) => setTab(value as DesktopTab)}
      >
        <TabsList className="!flex">
          <TabsTrigger value="order-book" className="flex flex-1">
            Order Book
          </TabsTrigger>
          <TabsTrigger value="trades" className="flex flex-1">
            Trades
          </TabsTrigger>
        </TabsList>
        <TabsContent value="order-book" className="h-full">
          <OrderBook className="h-full" />
        </TabsContent>
        <TabsContent value="trades">
          <Trades />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
