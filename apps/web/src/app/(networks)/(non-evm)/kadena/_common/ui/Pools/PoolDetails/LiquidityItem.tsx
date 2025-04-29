import { CardItem } from '@sushiswap/ui'
import { formatUSD } from 'sushi/format'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import { Icon } from '~kadena/_common/ui/General/Icon'

export const LiquidityItem = ({
  isLoading,
  token,
  amount,
  usdAmount,
}: {
  isLoading: boolean
  token: KadenaToken | undefined
  amount: string
  usdAmount: string
}) => {
  if (isLoading || !token) {
    return <CardItem skeleton={true} />
  }

  const _amount = '0.234'
  return (
    <CardItem
      title={
        <div className="flex items-center gap-2 font-medium text-muted-foreground">
          <Icon currency={token} width={18} height={18} />
          {token?.tokenSymbol}
        </div>
      }
    >
      <span className="flex gap-1 font-semibold">
        {+amount > 0 ? _amount : 0}{' '}
        <span className="font-normal text-gray-400 dark:text-slate-600">
          {formatUSD(usdAmount)}
        </span>
      </span>
    </CardItem>
  )
}
