import { CardItem, Currency } from '@sushiswap/ui'
import { formatUSD } from 'sushi'
import type { StellarToken } from 'sushi/stellar'

interface LiquidityItemProps {
  isLoading: boolean
  token: StellarToken
  amount: string
  usdAmount?: string
}

export const LiquidityItem = ({
  isLoading,
  token,
  amount,
  usdAmount,
}: LiquidityItemProps) => {
  if (isLoading) {
    return <CardItem skeleton={true} />
  }

  return (
    <CardItem
      title={
        <div className="font-medium flex items-center gap-2 text-muted-foreground">
          <Currency.Icon disableLink currency={token} width={18} height={18} />
          {token.symbol}
        </div>
      }
    >
      <span className="flex gap-1 font-semibold">
        {amount}{' '}
        {usdAmount && (
          <span className="font-normal text-gray-400 dark:text-slate-600">
            {formatUSD(Number(usdAmount))}
          </span>
        )}
      </span>
    </CardItem>
  )
}
