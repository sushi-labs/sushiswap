import { getAddress } from '@ethersproject/address'
import { Pool } from '@sushiswap/client'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, Link } from '@sushiswap/ui'
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
        <Link.Internal href={`/${pool.id}/remove`} passHref={true}>
          <a className="w-full">
            <Button
              disabled={Boolean(balance?.[FundSource.WALLET]?.equalTo(ZERO) && stakedBalance?.equalTo(ZERO))}
              size="md"
              color="gray"
              fullWidth
            >
              Withdraw
            </Button>
          </a>
        </Link.Internal>
        <Link.Internal href={`/${pool.id}/add`} passHref={true}>
          <Button as="a" size="md" fullWidth>
            Deposit
          </Button>
        </Link.Internal>
      </div>
      <Button
        className="col-span-2"
        size="md"
        variant="outlined"
        as="a"
        href={`https://www.sushi.com/swap?token0=${getAddress(pool.token0.address)}&token1=${getAddress(
          pool.token1.address
        )}&chainId=${pool.chainId}`}
      >
        Trade
      </Button>
    </div>
  )
}
