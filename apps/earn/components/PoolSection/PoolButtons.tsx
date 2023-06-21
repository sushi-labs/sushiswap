import { getAddress } from '@ethersproject/address'
import { Pool } from '@sushiswap/client'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Link } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { FC } from 'react'

import { usePoolPosition } from '../PoolPositionProvider'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
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
          disabled={Boolean(balance?.[FundSource.WALLET]?.equalTo(ZERO) && stakedBalance?.equalTo(ZERO))}
          size="lg"
          variant="secondary"
          fullWidth
        >
          <a href={`/${pool.id}/remove`}>Withdraw</a>
        </Button>
        <Button asChild size="lg" fullWidth>
          <a href={`/${pool.id}/add`}>Deposit</a>
        </Button>
      </div>
      <Button asChild className="col-span-2" size="lg" variant="secondary">
        <a
          href={`https://www.sushi.com/swap?token0=${getAddress(pool.token0.address)}&token1=${getAddress(
            pool.token1.address
          )}&chainId=${pool.chainId}`}
        >
          Trade
        </a>
      </Button>
    </div>
  )
}
