import type { CompletedOrderType } from './portfolio-orders'

export const CompletedOrders = ({ filter }: { filter: CompletedOrderType }) => {
  return <div className="flex flex-col gap-4">Order items here {filter}</div>
}
