import {
  type Order,
  OrderStatus,
  buildOrder,
  getOrderFillDelayMillis,
  zeroAddress,
} from '@orbs-network/twap-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { multicall } from '@wagmi/core'
import { useCallback, useMemo } from 'react'
import type { TwapSupportedChainId } from 'src/config'
import { TwapSDK } from 'src/lib/swap/twap'
import { twapAbi_status } from 'src/lib/swap/twap/abi'
import type { Token, Type } from 'sushi/currency'
import type { Address } from 'sushi/types'
import { useConfig } from 'wagmi'

export type TwapOrder = Order & {
  status: OrderStatus
  fillDelayMs: number
}

interface TwapOrdersStoreParams {
  chainId: TwapSupportedChainId
  account: Address | undefined
}

export const usePersistedOrdersStore = ({
  chainId,
  account,
}: TwapOrdersStoreParams) => {
  const queryClient = useQueryClient()
  const ordersKey = `orders-${chainId}:${account}`
  const cancelledOrderIdsKey = `cancelled-orders-${chainId}:${account}`

  const getCreatedOrders = useCallback((): Order[] => {
    const res = localStorage.getItem(ordersKey)
    if (!res) return []
    return JSON.parse(res)
  }, [ordersKey])

  const getCancelledOrderIds = useCallback((): number[] => {
    const res = localStorage.getItem(cancelledOrderIdsKey)
    if (!res) return []
    return JSON.parse(res)
  }, [cancelledOrderIdsKey])

  const addCreatedOrder = useCallback(
    (
      orderId: number,
      txHash: string,
      params: string[],
      srcToken: Token,
      dstToken: Type,
    ) => {
      if (!account) return

      const sdk = TwapSDK.onNetwork(chainId)

      const order = buildOrder({
        srcAmount: params[3],
        srcTokenAddress: srcToken.address,
        dstTokenAddress: dstToken.isToken ? dstToken.address : zeroAddress,
        srcAmountPerChunk: params[4],
        deadline: Number(params[6]) * 1000,
        dstMinAmountPerChunk: params[5],
        tradeDollarValueIn: '',
        blockNumber: 0,
        id: orderId,
        fillDelay: Number(params[8]),
        createdAt: Date.now(),
        txHash,
        maker: account,
        exchange: sdk.config.exchangeAddress,
        twapAddress: sdk.config.twapAddress,
        chainId,
        status: OrderStatus.Open,
      })

      const orders = getCreatedOrders()
      if (orders.some((o) => o.id === order.id)) return
      orders.push(order)
      localStorage.setItem(ordersKey, JSON.stringify(orders))
      const queryKey = ['twap-orders', chainId, account]
      queryClient.setQueryData(queryKey, (orders?: TwapOrder[]) => {
        const _order = {
          ...order,
          status: OrderStatus.Open,
          fillDelayMs: getOrderFillDelayMillis(
            order,
            TwapSDK.onNetwork(chainId).config,
          ),
        }
        if (!orders) return [_order]
        return [_order, ...orders]
      })
      queryClient.invalidateQueries({ queryKey })
    },
    [getCreatedOrders, ordersKey, queryClient, chainId, account],
  )
  const addCancelledOrderId = useCallback(
    (orderId: number) => {
      const cancelledOrderIds = getCancelledOrderIds()
      if (!cancelledOrderIds.includes(orderId)) {
        cancelledOrderIds.push(orderId)
        localStorage.setItem(
          cancelledOrderIdsKey,
          JSON.stringify(cancelledOrderIds),
        )
        queryClient.setQueryData(
          ['twap-orders', chainId, account],
          (orders?: TwapOrder[]) => {
            if (!orders) return []
            return orders.map((order) => {
              if (order.id === orderId) {
                return { ...order, status: OrderStatus.Canceled }
              }
              return order
            })
          },
        )
      }
    },
    [getCancelledOrderIds, cancelledOrderIdsKey, queryClient, chainId, account],
  )
  const deleteCreatedOrder = useCallback(
    (id: number) => {
      const orders = getCreatedOrders().filter((order) => order.id !== id)
      localStorage.setItem(ordersKey, JSON.stringify(orders))
    },
    [getCreatedOrders, ordersKey],
  )
  const deleteCancelledOrderId = useCallback(
    (orderId: number) => {
      const cancelledOrderIds = getCancelledOrderIds().filter(
        (id) => id !== orderId,
      )
      localStorage.setItem(
        cancelledOrderIdsKey,
        JSON.stringify(cancelledOrderIds),
      )
    },
    [getCancelledOrderIds, cancelledOrderIdsKey],
  )

  return {
    getCreatedOrders,
    getCancelledOrderIds,
    addCreatedOrder,
    addCancelledOrderId,
    deleteCreatedOrder,
    deleteCancelledOrderId,
  }
}

interface TwapOrdersQueryParams {
  chainId: TwapSupportedChainId
  account: Address | undefined
  enabled?: boolean
}

const useTwapOrdersQuery = ({
  chainId,
  account,
  enabled = true,
}: TwapOrdersQueryParams) => {
  const config = useConfig()

  const {
    getCreatedOrders,
    getCancelledOrderIds,
    deleteCreatedOrder,
    deleteCancelledOrderId,
  } = usePersistedOrdersStore({ chainId, account })

  return useQuery({
    queryKey: ['twap-orders', chainId, account],
    queryFn: async () => {
      if (!account || !config) throw new Error()

      const sdkOrders = await TwapSDK.onNetwork(chainId).getOrders(account)

      getCreatedOrders().forEach((localStorageOrder) => {
        if (sdkOrders.some((order) => order.id === localStorageOrder.id)) {
          // console.log(`removing order: ${localStorageOrder.id}`)
          deleteCreatedOrder(localStorageOrder.id)
        } else {
          // console.log(`adding order: ${localStorageOrder.id}`)
          sdkOrders.unshift(localStorageOrder)
        }
      })

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

      const canceledOrders = new Set(getCancelledOrderIds())

      const orders = sdkOrders.map((order) => {
        let status = order.status
        if (canceledOrders.has(order.id)) {
          if (status !== OrderStatus.Canceled) {
            // console.log(`Cancelled added: ${order.id}`)
            status = OrderStatus.Canceled
          } else {
            // console.log(`Cancelled removed: ${order.id}`)
            deleteCancelledOrderId(order.id)
          }
        }

        return {
          ...order,
          status,
          progress: status === OrderStatus.Completed ? 100 : order.progress,
          fillDelayMs: getOrderFillDelayMillis(
            order,
            TwapSDK.onNetwork(chainId).config,
          ),
        } satisfies TwapOrder
      })

      return orders
    },
    refetchInterval: 20_000,
    enabled: Boolean(enabled && account && config),
  })
}

export const useTwapOrders = ({
  chainId,
  account,
  enabled = true,
}: TwapOrdersQueryParams) => {
  const ordersQuery = useTwapOrdersQuery({ chainId, account, enabled })

  return useMemo(() => {
    const { data: orders, ...rest } = ordersQuery
    return {
      ...rest,
      data: orders
        ? {
            ALL: orders as TwapOrder[],
            [OrderStatus.Open]: filterAndSortOrders(orders, OrderStatus.Open),
            [OrderStatus.Completed]: filterAndSortOrders(
              orders,
              OrderStatus.Completed,
            ),
            [OrderStatus.Expired]: filterAndSortOrders(
              orders,
              OrderStatus.Expired,
            ),
            [OrderStatus.Canceled]: filterAndSortOrders(
              orders,
              OrderStatus.Canceled,
            ),
          }
        : undefined,
    }
  }, [ordersQuery])
}

const filterAndSortOrders = (orders: TwapOrder[], status: OrderStatus) => {
  return orders
    .filter((order) => order.status === status)
    .sort((a, b) => b.createdAt - a.createdAt)
}
