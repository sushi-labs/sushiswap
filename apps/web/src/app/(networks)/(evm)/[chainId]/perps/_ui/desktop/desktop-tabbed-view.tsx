import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'

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
    <div className="bg-blue-500/50 border p-2 h-full">
      <Tabs
        className="w-full"
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
        <TabsContent value="order-book">
          <div>order book</div>
        </TabsContent>
        <TabsContent value="trades">
          <div>trades</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
