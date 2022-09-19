import { Button, Link } from '@sushiswap/ui'
import { FC } from 'react'

import { KashiPair } from '../../.graphclient'
import { useTokensFromKashiPair } from '../../lib/hooks'

interface MarketButtonsProps {
  pair: KashiPair
  side: 'borrow' | 'lend'
}

export const MarketButtons: FC<MarketButtonsProps> = ({ pair, side }) => {
  const { asset, collateral } = useTokensFromKashiPair(pair)

  return (
    <div className="flex flex-col w-full gap-2">
      <Link.Internal href="/earn" passHref={true}>
        <Button as="a" size="md" color="blue" fullWidth>
          Invest
        </Button>
      </Link.Internal>
      <Link.Internal href={`/${side === 'borrow' ? 'lend' : 'borrow'}/${pair.id}`} passHref={true}>
        <Button as="a" color="blue" variant="empty" fullWidth>
          {`${side === 'borrow' ? 'Lend' : 'Borrow'} ${side === 'borrow' ? asset.symbol : collateral.symbol} Instead`}
        </Button>
      </Link.Internal>
    </div>
  )
}
