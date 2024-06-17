import { Pool } from '@sushiswap/client'
import { CardCurrencyAmountItem, CardGroup, CardLabel } from '@sushiswap/ui'
import { FC } from 'react'
import { formatUSD } from 'sushi/format'

import { usePoolPosition } from './PoolPositionProvider'

interface PoolPositionProps {
  pool: Pool
}

export const PoolPositionDesktop: FC<PoolPositionProps> = () => {
  const { underlying1, underlying0, value1, value0, isLoading } =
    usePoolPosition()

  return (
    <CardGroup>
      <CardLabel>Unstaked</CardLabel>
      <CardCurrencyAmountItem
        isLoading={isLoading}
        amount={underlying0}
        fiatValue={formatUSD(value0)}
      />
      <CardCurrencyAmountItem
        isLoading={isLoading}
        amount={underlying1}
        fiatValue={formatUSD(value1)}
      />
    </CardGroup>
  )
}
