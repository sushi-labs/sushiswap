import { ChainId } from '@sushiswap/chain'
import { SUSHI } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui/components/currency'
import { Row } from '@tanstack/react-table'
import { FC } from 'react'

export const PoolRewardsCell: FC<Row<{ chainId: ChainId }>> = ({ original }) => {
  return (
    <Currency.IconList iconHeight={26} iconWidth={26}>
      <Currency.Icon currency={SUSHI[original.chainId as keyof typeof SUSHI]} />
    </Currency.IconList>
  )
}
