import { Pool } from '@sushiswap/client'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from 'sushi/math'
import { LinkInternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import Link from 'next/link'
import { FC } from 'react'
import { getAddress } from 'viem'

import { usePoolPosition } from './PoolPositionProvider'
import { usePoolPositionStaked } from './PoolPositionStakedProvider'

interface PoolButtonsProps {
  pool: Pool
}

export const PoolButtons: FC<PoolButtonsProps> = ({ pool }) => {
  const { balance } = usePoolPosition()
  const { balance: stakedBalance } = usePoolPositionStaked()

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-2">
        <Button
          asChild
          disabled={Boolean(
            balance?.[FundSource.WALLET]?.equalTo(ZERO) &&
              stakedBalance?.equalTo(ZERO),
          )}
          size="lg"
          variant="secondary"
          fullWidth
        >
          <LinkInternal href={`/pool/${pool.id}/remove`}>Withdraw</LinkInternal>
        </Button>
        <Button asChild size="lg" fullWidth>
          <LinkInternal href={`/pool/${pool.id}/add`}>Deposit</LinkInternal>
        </Button>
      </div>
      <Button asChild className="col-span-2" size="lg" variant="secondary">
        <Link
          href={`/swap?token0=${getAddress(
            pool.token0.address,
          )}&token1=${getAddress(pool.token1.address)}&chainId=${pool.chainId}`}
        >
          Trade
        </Link>
      </Button>
    </div>
  )
}
