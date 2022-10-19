import { Button, Link } from '@sushiswap/ui'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { useRouter } from 'next/router'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'

interface MarketButtonsProps {
  pair: KashiMediumRiskLendingPairV1
}

export const BorrowButtons: FC<MarketButtonsProps> = ({ pair }) => {
  const router = useRouter()
  const { asset } = useTokensFromKashiPair(pair)

  return (
    <div className="flex flex-col w-full gap-2">
      <Link.Internal href={`/borrow/${router.query.id}/deposit`} passHref={true}>
        <Button as="a" size="md" color="blue" fullWidth>
          Borrow {asset.symbol}
        </Button>
      </Link.Internal>
      <Link.Internal href={`/lend/${pair.id}`} passHref={true}>
        <Button as="a" color="blue" variant="empty" fullWidth>
          Lend {asset.symbol} Instead
        </Button>
      </Link.Internal>
    </div>
  )
}
