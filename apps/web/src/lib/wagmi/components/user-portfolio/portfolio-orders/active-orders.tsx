import { LinkInternal } from '@sushiswap/ui'
import { useParams } from 'next/navigation'
import { type SupportedChainId, isSupportedChainId } from 'src/config'
import { EvmChainId, EvmChainKey } from 'sushi/chain'
import { formatUSD } from 'sushi/format'
import { NotificationBadge } from '../notification-badge'

export const ActiveOrders = () => {
  const { chainId: _chainId } = useParams()
  const chainId =
    _chainId && isSupportedChainId(+_chainId)
      ? (+_chainId as SupportedChainId)
      : EvmChainId.ETHEREUM

  return (
    <div className="flex flex-col gap-4">
      <OrderItem
        title="Limit Orders"
        amount={2}
        details={`${formatUSD(15.87)} / ${formatUSD(34)} Filled`}
        href={`/${EvmChainKey[chainId]}/limit/advanced`}
      />
      <OrderItem
        title="DCA Orders"
        amount={1}
        details={`${formatUSD(0.93)} / ${formatUSD(34)} Filled`}
        href={`/${EvmChainKey[chainId]}/dca/advanced`}
      />
    </div>
  )
}

const OrderItem = ({
  title,
  amount,
  details,
  href,
}: {
  title: string
  amount: number
  details: string
  href: string
}) => {
  return (
    <LinkInternal
      className="px-3 flex-1 text-xs py-2 rounded-lg border border-accent dark:bg-slate-800 bg-slate-100 sm:bg-white flex justify-between items-center"
      href={href}
    >
      <div className="flex gap-x-2 items-center">
        <div className="text-slate-900 dark:text-[#FFF5FA] font-medium">
          {title}
        </div>
        <NotificationBadge size="sm" notificationCount={amount} />
      </div>
      <div className="text-xs text-muted-foreground">{details}</div>
    </LinkInternal>
  )
}
