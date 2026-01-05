import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'

export const TabbedView = () => {
  return (
    <div className="bg-blue-500/50 border p-2 h-[460px] min-h-[350px]">
      <Tabs className="w-full" defaultValue={'chart'}>
        <TabsList className="!flex !px-0 !h-8">
          <TabsTrigger
            value="chart"
            className="flex flex-1 !px-1.5 !py-.5 !text-xs"
          >
            Chart
          </TabsTrigger>
          <TabsTrigger
            value="order-book"
            className="flex flex-1 !px-1.5 !py-.5 !text-xs"
          >
            Order Book
          </TabsTrigger>
          <TabsTrigger
            value="Trades"
            className="flex flex-1 !px-1.5 !py-.5 !text-xs"
          >
            Trades
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chart">
          <div>chart</div>
        </TabsContent>
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
