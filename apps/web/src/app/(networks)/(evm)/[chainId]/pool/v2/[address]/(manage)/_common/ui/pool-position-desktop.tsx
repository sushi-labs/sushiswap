import { CardCurrencyAmountItem, CardGroup, CardLabel } from '@sushiswap/ui'
import type { FC } from 'react'
import { formatUSD } from 'sushi'

import { usePoolPosition } from '../../../_common/ui/pool-position-provider'

export const PoolPositionDesktop: FC = () => {
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
