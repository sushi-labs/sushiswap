import { Currency } from '@sushiswap/ui/components/currency'
import { Row } from '@tanstack/react-table'
import { FC } from 'react'
import { ChainId } from 'sushi/chain'
import { SUSHI } from 'sushi/config'

export const PoolRewardsCell: FC<Row<{ chainId: ChainId }>> = ({
  original,
}) => {
  return (
    <Currency.IconList iconHeight={26} iconWidth={26}>
      <Currency.Icon currency={SUSHI[original.chainId as keyof typeof SUSHI]} />
    </Currency.IconList>
  )
}
