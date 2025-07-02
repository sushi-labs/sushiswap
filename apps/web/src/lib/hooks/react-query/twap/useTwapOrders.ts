import {
  type Order,
  OrderStatus,
  buildOrder,
  getOrderFillDelayMillis,
  zeroAddress,
} from '@orbs-network/twap-sdk'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import type { TwapSupportedChainId } from 'src/config'
import { TwapSDK } from 'src/lib/swap/twap'
import type { Token, Type } from 'sushi/currency'
import type { Address } from 'sushi/types'
import { formatUnits } from 'viem'
import { useConfig } from 'wagmi'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'

export type TwapOrder = Order & {
  fillDelayMs: number
}

interface TwapOrdersStoreParams {
  account: Address | undefined
}

export const usePersistedOrdersStore = ({ account }: TwapOrdersStoreParams) => {
  const queryClient = useQueryClient()

  const getKeys = useCallback(
    (chainId: TwapSupportedChainId) => {
      return {
        ordersKey: `orders-${chainId}:${account}`,
        cancelledOrderIdsKey: `cancelled-orders-${chainId}:${account}`,
      }
    },
    [account],
  )

  const getCreatedOrders = useCallback(
    (chainId: TwapSupportedChainId): Order[] => {
      const { ordersKey } = getKeys(chainId)
      const res = localStorage.getItem(ordersKey)
      if (!res) return []
      return JSON.parse(res)
    },
    [getKeys],
  )

  const getCancelledOrderIds = useCallback(
    (chainId: TwapSupportedChainId): number[] => {
      const { cancelledOrderIdsKey } = getKeys(chainId)
      const res = localStorage.getItem(cancelledOrderIdsKey)
      if (!res) return []
      return JSON.parse(res)
    },
    [getKeys],
  )

  const addCreatedOrder = useCallback(
    (
      chainId: TwapSupportedChainId,
      orderId: number,
      txHash: string,
      params: string[],
      srcToken: Token,
      dstToken: Type,
      srcTokenUsdPrice: number,
    ) => {
      if (!account) return

      const sdk = TwapSDK.onNetwork(chainId)

      let tradeDollarValueIn = 0
      try {
        tradeDollarValueIn = srcTokenUsdPrice
          ? Number(formatUnits(BigInt(params[3]), srcToken.decimals)) *
            srcTokenUsdPrice
          : 0
      } catch (_error) {
        tradeDollarValueIn = 0
      }

      const order = buildOrder({
        srcAmount: params[3],
        srcTokenAddress: srcToken.address,
        dstTokenAddress: dstToken.isToken ? dstToken.address : zeroAddress,
        srcAmountPerChunk: params[4],
        deadline: Number(params[6]) * 1000,
        dstMinAmountPerChunk: params[5],
        tradeDollarValueIn: tradeDollarValueIn.toString(),
        blockNumber: 0,
        id: orderId,
        fillDelay: Number(params[8]),
        createdAt: Date.now(),
        txHash,
        maker: account,
        exchange: sdk.config.exchangeAddress,
        twapAddress: sdk.config.twapAddress,
        // srcTok: srcToken.symbol || "",
        // dstTokenSymbol: dstToken.isToken ? dstToken.symbol || "" : "",
        chainId,
      })

      const orders = getCreatedOrders(chainId)
      if (orders.some((o) => o.id === order.id)) return
      orders.push(order)
      localStorage.setItem(getKeys(chainId).ordersKey, JSON.stringify(orders))
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
    [getCreatedOrders, queryClient, account, getKeys],
  )
  const addCancelledOrderId = useCallback(
    (chainId: TwapSupportedChainId, orderId: number) => {
      const cancelledOrderIds = getCancelledOrderIds(chainId)
      const { cancelledOrderIdsKey } = getKeys(chainId)
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
    [getCancelledOrderIds, queryClient, account, getKeys],
  )
  const deleteCreatedOrder = useCallback(
    (chainId: TwapSupportedChainId, id: number) => {
      const { ordersKey } = getKeys(chainId)
      const orders = getCreatedOrders(chainId).filter(
        (order) => order.id !== id,
      )
      localStorage.setItem(ordersKey, JSON.stringify(orders))
    },
    [getCreatedOrders, getKeys],
  )
  const deleteCancelledOrderId = useCallback(
    (chainId: TwapSupportedChainId, orderId: number) => {
      const { cancelledOrderIdsKey } = getKeys(chainId)
      const cancelledOrderIds = getCancelledOrderIds(chainId).filter(
        (id) => id !== orderId,
      )
      localStorage.setItem(
        cancelledOrderIdsKey,
        JSON.stringify(cancelledOrderIds),
      )
    },
    [getCancelledOrderIds, getKeys],
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
  chainIds: TwapSupportedChainId[]
  account: Address | undefined
  enabled?: boolean
}

const useTwapOrdersQuery = ({
  chainIds,
  account,
  enabled = true,
}: TwapOrdersQueryParams) => {
  const config = useConfig()

  const {
    getCreatedOrders,
    getCancelledOrderIds,
    deleteCreatedOrder,
    deleteCancelledOrderId,
  } = usePersistedOrdersStore({ account })

  return useQueries({
    queries: chainIds.map((chainId) => ({
      queryKey: ['twap-orders', chainId, account],
      queryFn: async ({ signal }: { signal: AbortSignal }) => {
        if (!account || !config) throw new Error()

        const sdkOrders = await TwapSDK.onNetwork(chainId).getOrders(
          account,
          signal,
        )

        getCreatedOrders(chainId).forEach((localStorageOrder) => {
          if (sdkOrders.some((order) => order.id === localStorageOrder.id)) {
            // console.log(`removing order: ${localStorageOrder.id}`)
            deleteCreatedOrder(chainId, localStorageOrder.id)
          } else {
            // console.log(`adding order: ${localStorageOrder.id}`)
            sdkOrders.unshift(localStorageOrder)
          }
        })

        const canceledOrders = new Set(getCancelledOrderIds(chainId))

        const orders = sdkOrders.map((order) => {
          let status = order.status
          if (canceledOrders.has(order.id)) {
            if (status !== OrderStatus.Canceled) {
              // console.log(`Cancelled added: ${order.id}`)
              status = OrderStatus.Canceled
            } else {
              // console.log(`Cancelled removed: ${order.id}`)
              deleteCancelledOrderId(chainId, order.id)
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
        console.log({ orders })
        return orders.sort((a, b) => b.createdAt - a.createdAt)
      },
      refetchInterval: 20_000,
      enabled: Boolean(enabled && account && config),
    })),
  })
}

export const useTwapOrders = ({
  chainIds,
  account,
  enabled = true,
}: TwapOrdersQueryParams) => {
  const combinedOrdersQuery = useTwapOrdersQuery({
    chainIds,
    account,
    enabled,
  })

  // console.log({ combinedOrdersQuery });
  return useMemo(() => {
    const orders = combinedOrdersQuery
      .map((it) => it.data)
      .filter((it) => it)
      .flat() as TwapOrder[]

    const sortedOrders = orders.sort((a, b) => b.createdAt - a.createdAt)

    return {
      // show loading state if there are no orders
      // isLoading: Boolean(combinedOrdersQuery.find((it) => it.data?.length === 0)),
      isLoading: combinedOrdersQuery?.[0]?.isLoading,
      loadingChains: combinedOrdersQuery
        .map((q, i) => (q.isLoading ? chainIds[i] : null))
        .filter((it) => it !== null),
      data: sortedOrders
        ? {
            ALL: sortedOrders,
            [OrderStatus.Open]: filterOrders(sortedOrders, OrderStatus.Open),
            [OrderStatus.Completed]: filterOrders(
              sortedOrders,
              OrderStatus.Completed,
            ),
            [OrderStatus.Expired]: filterOrders(
              sortedOrders,
              OrderStatus.Expired,
            ),
            [OrderStatus.Canceled]: filterOrders(
              sortedOrders,
              OrderStatus.Canceled,
            ),
          }
        : undefined,
    }
  }, [combinedOrdersQuery, chainIds])
}

const filterOrders = (orders: TwapOrder[], status: OrderStatus) => {
  return orders.filter((order) => order.status === status)
}
