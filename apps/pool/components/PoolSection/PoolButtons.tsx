import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { AppearOnMount, Button, Link } from '@sushiswap/ui'
import { useBalance } from '@sushiswap/wagmi'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { useTokensFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'

interface PoolButtonsProps {
  pair: PairWithAlias
}

export const PoolButtons: FC<PoolButtonsProps> = ({ pair }) => {
  const { liquidityToken } = useTokensFromPair(pair)
  const { address } = useAccount()
  const { data: balance } = useBalance({ chainId: pair.chainId, account: address, currency: liquidityToken })

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2">
        <AppearOnMount show={Boolean(balance?.[FundSource.WALLET]?.greaterThan(ZERO))} className="w-full">
          <Link.Internal href={`/${pair.id}/remove`} passHref={true}>
            <Button as="a" size="md" color="gray" fullWidth>
              Withdraw
            </Button>
          </Link.Internal>
        </AppearOnMount>
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
        href={`/swap?srcToken=${pair.id.split(':')[1]}&srcChainId=${pair.chainId}`}
      >
        Trade
      </Button>
    </div>
  )
}
