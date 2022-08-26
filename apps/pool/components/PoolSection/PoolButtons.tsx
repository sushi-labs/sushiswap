import { Button, Link } from '@sushiswap/ui'
import { FC } from 'react'

import { PairWithAlias } from '../../types'

interface PoolButtonsProps {
  pair: PairWithAlias
}

export const PoolButtons: FC<PoolButtonsProps> = ({ pair }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
      <Link.Internal href={`/${pair.id}/remove`} passHref={true}>
        <Button as="a" size="md" color="gray" fullWidth>
          Withdraw
        </Button>
      </Link.Internal>
      <Link.Internal href={`/${pair.id}/add`} passHref={true}>
        <Button as="a" size="md" fullWidth>
          Deposit
        </Button>
      </Link.Internal>
      <Button
        className="col-span-2"
        size="md"
        variant="outlined"
        as="a"
        href={`/swap?srcToken=${pair.id}&srcChainId=${pair.chainId}`}
      >
        Trade
      </Button>
    </div>
  )
}
