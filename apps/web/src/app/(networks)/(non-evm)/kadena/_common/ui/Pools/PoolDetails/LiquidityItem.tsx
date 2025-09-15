import { CardItem } from '@sushiswap/ui'
import { formatUSD } from 'sushi'
import type { KvmToken } from 'sushi/kvm'
import { Icon } from '~kadena/_common/ui/General/Icon'

export const LiquidityItem = ({
  isLoading,
  token,
  amount,
  usdAmount,
}: {
  isLoading: boolean
  token: KvmToken | undefined
  amount: string | number
  usdAmount: string
}) => {
  if (isLoading || !token) {
    return <CardItem skeleton={true} />
  }

  return (
    <CardItem
      title={
        <div className="flex items-center gap-2 font-medium text-muted-foreground">
          <Icon currency={token} width={18} height={18} />
          {token?.symbol}
        </div>
      }
    >
      <span className="flex gap-1 font-semibold">
        {amount}{' '}
        <span className="font-normal text-gray-400 dark:text-slate-600">
          {formatUSD(usdAmount)}
        </span>
      </span>
    </CardItem>
  )
}
