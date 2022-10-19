import { Button, Link } from '@sushiswap/ui'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { useRouter } from 'next/router'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'

interface LendButtons {
  pair: KashiMediumRiskLendingPairV1
}

export const LendButtons: FC<LendButtons> = ({ pair }) => {
  const router = useRouter()
  const { asset } = useTokensFromKashiPair(pair)

  return (
    <div className="flex flex-col w-full gap-2">
      <Link.Internal href={`/lend/${router.query.id}/deposit`} passHref={true}>
        <Button as="a" size="md" color="blue" fullWidth>
          Lend {asset.symbol}
        </Button>
      </Link.Internal>
      <Link.Internal href={`/borrow/${pair.id}`} passHref={true}>
        <Button as="a" color="blue" variant="empty" fullWidth>
          Borrow {asset.symbol} Instead
        </Button>
      </Link.Internal>
    </div>
  )
}
