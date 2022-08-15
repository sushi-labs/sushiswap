import { Button, Link } from '@sushiswap/ui'
import { useRouter } from 'next/router'
import { FC } from 'react'

import { KashiPair } from '../../.graphclient'
import { useTokensFromKashiPair } from '../../lib/hooks'

interface MarketButtonsProps {
  pair: KashiPair
  side: 'borrow' | 'lend'
}

export const MarketButtons: FC<MarketButtonsProps> = ({ pair, side }) => {
  const router = useRouter()
  const { asset, collateral } = useTokensFromKashiPair(pair)

  return (
    <div className="flex flex-col gap-2 w-full">
      <Link.Internal href={`/lend/${router.query.id}/deposit`} passHref={true}>
        <Button as="a" size="md" color="blue" fullWidth>
          Earn
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
