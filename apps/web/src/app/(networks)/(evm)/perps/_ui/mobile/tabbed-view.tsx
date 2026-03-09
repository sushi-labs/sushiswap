import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { Chart } from '../chart'
import { OrderBook } from '../order-book'
import { Trades } from '../trades'

export const TabbedView = () => {
  return (
    <Card className="p-2 h-[463px] min-h-[350px]">
      <Tabs className="w-full" defaultValue={'chart'}>
        <TabsList className="!flex !px-0 !h-8">
          <TabsTrigger value="chart" className="flex flex-1 !px-1.5 !text-xs">
            Chart
          </TabsTrigger>
          <TabsTrigger
            value="order-book"
            className="flex flex-1 !px-1.5 !text-xs"
          >
            Order Book
          </TabsTrigger>
          <TabsTrigger value="trades" className="flex flex-1 !px-1.5 !text-xs">
            Trades
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="h-[370px]">
          <Chart />
        </TabsContent>
        <TabsContent value="order-book">
          <OrderBook />
        </TabsContent>
        <TabsContent value="trades">
          <Trades />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
