import { OrderStatus } from '@orbs-network/twap-sdk'
import { useMemo } from 'react'
import {
  getTwapDcaOrders,
  getTwapLimitOrders,
} from 'src/lib/hooks/react-query/twap'
import { useTradeTablesContext } from '~evm/[chainId]/[trade]/_ui/swap/trade/tab-tables/trade-tables-context'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const OpenOrdersTotal = () => {
  const { orders } = useTradeTablesContext()
  const totalOpenOrders = useMemo(() => {
    let totalOpenOrdersCount = 0
    if (orders && orders.length > 0) {
      const openLimitOrdersCount = getTwapLimitOrders(orders)
        ?.filter((order) => order.status === OrderStatus.Open)
        .reduce(
          (acc, curr) => acc + Number.parseFloat(curr.tradeDollarValueIn),
          0,
        )
      const openDcaOrdersCount = getTwapDcaOrders(orders)
        ?.filter((order) => order.status === OrderStatus.Open)
        .reduce(
          (acc, curr) => acc + Number.parseFloat(curr.tradeDollarValueIn),
          0,
        )
      totalOpenOrdersCount =
        (openLimitOrdersCount ?? 0) + (openDcaOrdersCount ?? 0)
    }
    return totalOpenOrdersCount
  }, [orders])

  return (
    <div className="font-semibold">
      Open Orders: {formatter.format(totalOpenOrders)}
    </div>
  )
}
