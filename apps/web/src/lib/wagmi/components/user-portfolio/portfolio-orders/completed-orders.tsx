import { OrderStatus, OrderType } from '@orbs-network/twap-sdk'
// import {
//   type RecentSwap,
//   type RecentSwaps,
//   isTokenListV2ChainId,
// } from '@sushiswap/graph-client/data-api'
import { SkeletonBox } from '@sushiswap/ui'
import { useMemo } from 'react'
import { SUPPORTED_CHAIN_IDS, TWAP_SUPPORTED_CHAIN_IDS } from 'src/config'
import {
  type LocalRecentSwap,
  filterLocalRecentSwapsByAccountAndChainIds,
  useLocalRecentSwaps,
} from 'src/lib/hooks/react-query/recent-swaps/useLocalRecentSwaps'
// import { useRecentSwaps } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import { type TwapOrder, useTwapOrders } from 'src/lib/hooks/react-query/twap'
import { useAccount } from 'wagmi'
import { DCA_KEYS } from '../twap-orders-badge'
import { CompletedOrderItem } from './completed-order-item'
import { CompletedOrderType } from './portfolio-orders'

export type OrderItemType = TwapOrder | LocalRecentSwap

export const CompletedOrders = ({ filter }: { filter: CompletedOrderType }) => {
  const { address } = useAccount()
  const twapChainIds = useMemo(
    () => TWAP_SUPPORTED_CHAIN_IDS.map((chainId) => chainId),
    [],
  )
  const { data: twapOrders, isLoading: isLoadingTwap } = useTwapOrders({
    account: address,
    chainIds: twapChainIds,
    enabled: Boolean(address),
  })
  // const { data: marketSwaps, isLoading: isMarketSwapsLoading } = useRecentSwaps(
  //   {
  //     walletAddress: address,
  //     chainIds: SUPPORTED_CHAIN_IDS.filter((chainId) =>
  //       isTokenListV2ChainId(chainId),
  //     ),
  //   },
  // )
  const { data: _localRecentSwaps } = useLocalRecentSwaps()

  const localRecentSwaps = useMemo(() => {
    if (!_localRecentSwaps || !address) return []
    return filterLocalRecentSwapsByAccountAndChainIds({
      account: address,
      chainIds: SUPPORTED_CHAIN_IDS,
      swaps: _localRecentSwaps,
    })
  }, [address, _localRecentSwaps])

  const isLoading = isLoadingTwap

  const allData = useMemo(() => {
    const twapOrdersData = twapOrders?.[OrderStatus.Completed] || []
    const marketSwapsData: LocalRecentSwap[] = localRecentSwaps || []
    const _data: OrderItemType[] = []
    if (filter === CompletedOrderType.All) {
      _data.push(...twapOrdersData, ...marketSwapsData)
    } else if (filter === CompletedOrderType.DCA) {
      _data.push(
        ...twapOrdersData.filter((order) => DCA_KEYS.includes(order.type)),
      )
    } else if (filter === CompletedOrderType.Market) {
      _data.push(...marketSwapsData)
    } else if (filter === CompletedOrderType.Limit) {
      _data.push(
        ...twapOrdersData.filter((order) => order.type === OrderType.LIMIT),
      )
    }
    return _data.sort((a, b) => {
      const aCreatedAt = 'createdAt' in a ? a.createdAt : a.timestamp * 1000
      const bCreatedAt = 'createdAt' in b ? b.createdAt : b.timestamp * 1000
      return bCreatedAt - aCreatedAt
    })
  }, [twapOrders, localRecentSwaps, filter])

  if (
    (filter === CompletedOrderType.All && isLoading) ||
    (filter === CompletedOrderType.DCA && isLoadingTwap) ||
    (filter === CompletedOrderType.Limit && isLoadingTwap)
  ) {
    return (
      <div className="flex flex-col gap-4">
        {new Array(3).fill(null).map((_, idx) => (
          <SkeletonBox key={idx} className="h-[264px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (allData.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center text-sm italic text-muted-foreground">
          No Completed{' '}
          {filter !== CompletedOrderType.All ? filter.toString() : ''} Orders
          Found
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {allData.map((order, idx) => (
        <CompletedOrderItem key={idx} order={order} />
      ))}
    </div>
  )
}
