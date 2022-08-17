import { Button, Link } from '@sushiswap/ui'
import { useRouter } from 'next/router'
import { FC } from 'react'

import { KashiPair } from '../../.graphclient'
import { useTokensFromKashiPair } from '../../lib/hooks'

interface LendButtons {
  pair: KashiPair
}

export const LendButtons: FC<LendButtons> = ({ pair }) => {
  const router = useRouter()
  const { asset } = useTokensFromKashiPair(pair)

  return (
    <div className="flex flex-col gap-2 w-full">
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
