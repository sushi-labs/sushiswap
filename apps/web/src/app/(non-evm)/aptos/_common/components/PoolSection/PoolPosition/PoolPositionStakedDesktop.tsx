import { CardGroup, CardLabel } from '@sushiswap/ui'
import { FC } from 'react'
import { formatUSD } from 'sushi/format'
import { Pool } from '~aptos/pool/lib/convert-pool-to-sushi-pool'
import { useTokensFromPool } from '~aptos/pool/lib/use-tokens-from-pool'
import { CardCurrencyAmountItem } from '../../CardCurrencyAmountItem'

interface PoolPositionStakedDesktopProps {
  row?: Pool
  isLoading: boolean
  underlying0: string | undefined
  underlying1: string | undefined
  value0: number
  value1: number
}

export const PoolPositionStakedDesktop: FC<PoolPositionStakedDesktopProps> = ({
  row,
  isLoading,
  underlying0,
  underlying1,
  value0,
  value1,
}) => {
  const { token0, token1 } = useTokensFromPool(row)

  return (
    <CardGroup>
      <CardLabel>Staked</CardLabel>
      <CardCurrencyAmountItem
        currency={token0}
        isLoading={isLoading}
        amount={underlying0 ? Number(underlying0) : undefined}
        fiatValue={formatUSD(value0)}
      />
      <CardCurrencyAmountItem
        isLoading={isLoading}
        currency={token1}
        amount={underlying1 ? Number(underlying1) : undefined}
        fiatValue={formatUSD(value1)}
      />
    </CardGroup>
  )
}
