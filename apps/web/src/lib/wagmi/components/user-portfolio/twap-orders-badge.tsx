import { OrderStatus, OrderType } from '@orbs-network/twap-sdk'
import { classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { TWAP_SUPPORTED_CHAIN_IDS } from 'src/config'
import { useTwapOrders } from 'src/lib/hooks/react-query/twap'
import { useAccount } from 'wagmi'
import {
  NotificationBadge,
  type NotificationBadgeSize,
} from './notification-badge'

export type TwapOrdersBadgeType = 'dca' | 'limit' | 'all-active'

export const DCA_KEYS = [OrderType.TWAP_MARKET, OrderType.TWAP_LIMIT]

export const TwapOrdersBadge = ({
  type,
  className,
  size = 'default',
}: {
  type: TwapOrdersBadgeType
  size?: NotificationBadgeSize
  className?: string
}) => {
  const { address } = useAccount()
  const { data, isLoading } = useTwapOrders({
    account: address,
    chainIds: TWAP_SUPPORTED_CHAIN_IDS.map((chainId) => chainId),
    enabled: Boolean(address),
  })

  const notificationCount = useMemo(() => {
    if (isLoading || !data) return 0

    if (type === 'all-active') {
      return data[OrderStatus.Open]?.length || 0
    }
    if (type === 'dca') {
      return (
        data[OrderStatus.Open]?.filter((order) => DCA_KEYS.includes(order.type))
          .length || 0
      )
    }
    if (type === 'limit') {
      return (
        data[OrderStatus.Open]?.filter(
          (order) => order.type === OrderType.LIMIT,
        ).length || 0
      )
    }
    return 0
  }, [data, isLoading, type])

  return (
    <NotificationBadge
      notificationCount={notificationCount}
      className={classNames(className)}
      size={size}
    />
  )
}
