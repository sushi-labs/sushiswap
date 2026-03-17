import {
  Button,
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { OrderBook } from '../order-book'
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
    <Card className="p-2 h-full !bg-[#0D1421] border border-[#1E2939]">
      <Tabs
        className="w-full h-full"
        value={tab}
        onValueChange={(value) => setTab(value as DesktopTab)}
      >
        <TabsList className="!flex bg-transparent !rounded-[13px] !px-[1px]">
          <TabsTrigger value="order-book" className="flex flex-1" asChild>
            <Button
              size="sm"
              variant={tab === 'order-book' ? 'perps-secondary' : 'ghost'}
              className="!p-0 w-full col-span-1 capitalize !text-xs"
            >
              Order Book
            </Button>
          </TabsTrigger>
          <TabsTrigger value="trades" className="flex flex-1" asChild>
            <Button
              size="sm"
              variant={tab === 'trades' ? 'perps-secondary' : 'ghost'}
              className="!p-0 w-full col-span-1 capitalize !text-xs"
            >
              Trades
            </Button>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="order-book" className="!mt-[6px]">
          <OrderBook />
        </TabsContent>
        <TabsContent value="trades" className="!mt-1.5">
          <Trades />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
