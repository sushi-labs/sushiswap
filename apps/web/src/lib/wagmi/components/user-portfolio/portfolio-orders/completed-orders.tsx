import { CompletedOrderItem } from './completed-order-item'
import type { CompletedOrderType } from './portfolio-orders'

export const CompletedOrders = ({ filter }: { filter: CompletedOrderType }) => {
  console.log(filter)
  return (
    <div className="flex flex-col gap-4">
      {/* <div className="text-center text-sm italic text-muted-foreground">No Completed Orders Found</div> */}
      <CompletedOrderItem />
      <CompletedOrderItem />
      <CompletedOrderItem />
      <CompletedOrderItem />
      {/* <CompletedOrderItem />
			<CompletedOrderItem />
			<CompletedOrderItem />
			<CompletedOrderItem />
			<CompletedOrderItem />
			<CompletedOrderItem />
			<CompletedOrderItem />
			<CompletedOrderItem /> */}
    </div>
  )
}
