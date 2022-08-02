import { Native } from '@sushiswap/currency'
import { Button, Link } from '@sushiswap/ui'
import { getAddress } from 'ethers/lib/utils'
import { FC } from 'react'

import { PairWithAlias } from '../../types'

interface PoolButtonsProps {
  pair: PairWithAlias
}

export const PoolButtons: FC<PoolButtonsProps> = ({ pair }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
      <Link.Internal
        href={`/add?token0=${
          Native.onChain(pair.chainId).wrapped.address === getAddress(pair.token0.id)
            ? pair.token0.symbol
            : getAddress(pair.token0.id)
        }&token1=${
          Native.onChain(pair.chainId).wrapped.address === getAddress(pair.token1.id)
            ? pair.token1.symbol
            : getAddress(pair.token1.id)
        }&chainId=${pair.chainId}`}
        passHref={true}
      >
        <Button as="a" size="md" fullWidth>
          Deposit
        </Button>
      </Link.Internal>
      <Button size="md" variant="outlined" as="a" href={`/swap?srcToken=${pair.id}&srcChainId=${pair.chainId}`}>
        Trade
      </Button>
    </div>
  )
}
