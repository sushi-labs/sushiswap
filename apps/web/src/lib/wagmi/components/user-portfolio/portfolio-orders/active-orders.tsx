import { OrderStatus, OrderType } from '@orbs-network/twap-sdk'
import { LinkInternal, SkeletonBox } from '@sushiswap/ui'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import {
  type SupportedChainId,
  TWAP_SUPPORTED_CHAIN_IDS,
  isSupportedChainId,
} from 'src/config'
import { useTwapOrders } from 'src/lib/hooks/react-query/twap'
import { formatUSD, getChainById } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { useAccount } from 'wagmi'
import {
  DCA_KEYS,
  TwapOrdersBadge,
  type TwapOrdersBadgeType,
} from '../twap-orders-badge'

export const ActiveOrders = () => {
  const { chainId: _chainId } = useParams()
  const chainId =
    _chainId && isSupportedChainId(+_chainId)
      ? (+_chainId as SupportedChainId)
      : EvmChainId.ETHEREUM

  const { address } = useAccount()
  const twapChainIds = useMemo(
    () => TWAP_SUPPORTED_CHAIN_IDS.map((chainId) => chainId),
    [],
  )
  const { data: orders, isLoading } = useTwapOrders({
    account: address,
    chainIds: twapChainIds,
    enabled: Boolean(address),
  })

  const data = useMemo(() => {
    if (isLoading || !orders) return undefined

    const activeDCAOrders = orders[OrderStatus.Open]?.filter((order) =>
      DCA_KEYS.includes(order.type),
    )
    const totalValueOfDcaOrders = activeDCAOrders.reduce((acc, order) => {
      return acc + Number(order.filledDollarValueOut)
    }, 0)
    const totalValueFilledOfDcaOrders = activeDCAOrders.reduce((acc, order) => {
      return acc + Number(order.tradeDollarValueIn)
    }, 0)

    const activeLimitOrders = orders[OrderStatus.Open]?.filter(
      (order) => order.type === OrderType.LIMIT,
    )
    const totalValueFilledOfLimitOrders = activeLimitOrders.reduce(
      (acc, order) => {
        return acc + Number(order.filledDollarValueOut)
      },
      0,
    )
    const totalValueOfLimitOrders = activeLimitOrders.reduce((acc, order) => {
      return acc + Number(order.tradeDollarValueIn)
    }, 0)
    return {
      activeDCAOrders,
      totalValueOfDcaOrders,
      totalValueFilledOfDcaOrders,
      activeLimitOrders,
      totalValueFilledOfLimitOrders,
      totalValueOfLimitOrders,
    }
  }, [orders, isLoading])

  const activeLimitOrders = data?.activeLimitOrders?.length || 0
  const activeDCAOrders = data?.activeDCAOrders?.length || 0

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <SkeletonBox className="h-8 w-full rounded-lg" />
        <SkeletonBox className="h-8 w-full rounded-lg" />
      </div>
    )
  }

  if (!activeDCAOrders && !activeLimitOrders) {
    return (
      <p className="text-sm italic text-center text-muted-foreground dark:text-pink-200">
        You don&apos;t have any active Limit or DCA orders.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <OrderItem
        title="Limit Orders"
        type="limit"
        amount={activeLimitOrders}
        details={`${formatUSD(data?.totalValueFilledOfLimitOrders || 0)} / ${formatUSD(
          data?.totalValueOfLimitOrders || 0,
        )} Filled`}
        href={`/${getChainById(chainId).key}/limit/advanced#trade-table`}
      />
      <OrderItem
        title="DCA Orders"
        type="dca"
        amount={activeDCAOrders}
        details={`${formatUSD(data?.totalValueFilledOfDcaOrders || 0)} / ${formatUSD(
          data?.totalValueOfDcaOrders || 0,
        )} Filled`}
        href={`/${getChainById(chainId).key}/dca/advancede#trade-table`}
      />
    </div>
  )
}

const OrderItem = ({
  title,
  type,
  amount,
  details,
  href,
}: {
  title: string
  type: TwapOrdersBadgeType
  amount: number
  details: string
  href: string
}) => {
  if (amount === 0) return null
  return (
    <LinkInternal
      className="px-3 flex-1 text-xs py-2 rounded-lg border border-accent dark:bg-slate-800 bg-slate-100 sm:bg-white flex justify-between items-center"
      href={href}
    >
      <div className="flex gap-x-2 items-center">
        <div className="text-slate-900 dark:text-[#FFF5FA] font-medium">
          {title}
        </div>
        <TwapOrdersBadge size="sm" type={type} />
      </div>
      <div className="text-xs text-muted-foreground">{details}</div>
    </LinkInternal>
  )
}
