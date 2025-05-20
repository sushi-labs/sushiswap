import {
  type Order,
  OrderStatus,
  getOrderFillDelay,
  parseOrderStatus,
} from '@orbs-network/twap-sdk'
import { useQuery } from '@tanstack/react-query'
import { multicall } from '@wagmi/core'
import type { TwapSupportedChainId } from 'src/config'
import { TwapSDK } from 'src/lib/swap/twap'
import { twapAbi_status } from 'src/lib/swap/twap/abi'
import type { Address } from 'sushi/types'
import { useConfig } from 'wagmi'

interface TwapOrdersParams {
  chainId: TwapSupportedChainId
  account: Address | undefined
  enabled?: boolean
}

export type TwapOrder = Order & {
  status: OrderStatus
  fillDelayMillis: number
}

export const useTwapOrders = ({
  chainId,
  account,
  enabled = true,
}: TwapOrdersParams) => {
  const config = useConfig()

  return useQuery({
    queryKey: ['twap-orders', chainId, account],
    queryFn: async () => {
      if (!account || !config) throw new Error()

      const sdkOrders = await TwapSDK.onNetwork(chainId).getOrders(account)

      const multicallResponse = await multicall(config, {
        contracts: sdkOrders.map((order) => {
          return {
            abi: twapAbi_status,
            address: order.twapAddress as Address,
            functionName: 'status',
            args: [order.id],
          }
        }),
      })

      const statuses = multicallResponse.map((it) => {
        return it.result as number
      })

      const orders = sdkOrders.map((order, index) => {
        const status = parseOrderStatus(order.progress, statuses?.[index])

        return {
          ...order,
          status,
          fillDelayMillis: getOrderFillDelay(
            order.fillDelay,
            TwapSDK.onNetwork(chainId).config,
          ),
        }
      })

      return {
        ALL: orders ?? [],
        [OrderStatus.Open]: filterAndSortOrders(orders ?? [], OrderStatus.Open),
        [OrderStatus.Completed]: filterAndSortOrders(
          orders ?? [],
          OrderStatus.Completed,
        ),
        [OrderStatus.Expired]: filterAndSortOrders(
          orders ?? [],
          OrderStatus.Expired,
        ),
        [OrderStatus.Canceled]: filterAndSortOrders(
          orders ?? [],
          OrderStatus.Canceled,
        ),
      }
    },
    enabled: Boolean(enabled && account && config),
  })
}

const filterAndSortOrders = (orders: TwapOrder[], status: OrderStatus) => {
  return orders
    .filter((order) => order.status === status)
    .sort((a, b) => b.createdAt - a.createdAt)
}
