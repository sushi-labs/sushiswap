import {
  Card,
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
} from '@sushiswap/ui'
import { FC } from 'react'
import { formatUSD } from 'sushi/format'
import { formatNumber } from 'utils/format-number'
import { Pool } from 'utils/hooks/usePools'
import { useStablePrice } from 'utils/hooks/useStablePrice'
import { useTokensFromPool } from 'utils/hooks/useTokensFromPool'
import { CardCurrencyAmountItem } from '../CardCurrencyAmountItem'

interface PoolCompositionProps {
  row: Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ row }) => {
  const { token0, token1 } = useTokensFromPool(row)

  const token0Price = useStablePrice({ currency: token0 })
  const token1Price = useStablePrice({ currency: token1 })

  const balanceX = formatNumber(
    Number(row?.data?.balance_x?.value),
    token0.decimals,
  )
  const balanceY = formatNumber(
    Number(row?.data?.balance_y?.value),
    token1.decimals,
  )
  const token0PoolPrice = token0Price ? token0Price * Number(balanceX) : 0
  const token1PoolPrice = token1Price ? token1Price * Number(balanceY) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Liquidity</CardTitle>
        <CardDescription>
          {formatUSD(token0PoolPrice + token1PoolPrice)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardCurrencyAmountItem
            amount={Number(balanceX)}
            currency={token0}
            fiatValue={formatUSD(token0PoolPrice)}
          />
          <CardCurrencyAmountItem
            amount={Number(balanceY)}
            currency={token1}
            fiatValue={formatUSD(token1PoolPrice)}
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
