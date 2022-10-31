import { getAddress } from '@ethersproject/address'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, Link } from '@sushiswap/ui'
import { FC } from 'react'

import { PairWithAlias } from '../../types'
import { usePoolPosition } from '../PoolPositionProvider'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
interface PoolButtonsProps {
  pair: PairWithAlias
}

export const PoolButtons: FC<PoolButtonsProps> = ({ pair }) => {
  const { balance } = usePoolPosition()
  const { balance: stakedBalance } = usePoolPositionStaked()

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-2">
        <Link.Internal href={`/${pair.id}/remove`} passHref={true}>
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
        <Link.Internal href={`/${pair.id}/add`} passHref={true}>
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
        href={`https://www.sushi.com/swap?token0=${getAddress(pair.token0.id)}&token1=${getAddress(
          pair.token1.id
        )}&chainId=${pair.chainId}`}
      >
        Trade
      </Button>
    </div>
  )
}
