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
import { Pool } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { formatNumber } from 'utils/utilFunctions'
import { CardCurrencyAmountItem } from '../CardCurrencyAmountItem'

interface PoolCompositionProps {
  row: Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ row }) => {
  const { token0, token1 } = useTokensFromPools(row)
  const balanceX = formatNumber(
    Number(row?.data?.balance_x?.value),
    token0.decimals,
  )
  const balanceY = formatNumber(
    Number(row?.data?.balance_y?.value),
    token1.decimals,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Liquidity</CardTitle>
        <CardDescription>{'$0.00'}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardCurrencyAmountItem
            amount={balanceX}
            currency={token0}
            fiatValue={'$0.00'}
          />
          <CardCurrencyAmountItem
            amount={balanceY}
            currency={token1}
            fiatValue={'$0.00'}
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
