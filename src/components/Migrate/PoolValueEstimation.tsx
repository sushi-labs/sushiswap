import { JSBI, Pair } from '@sushiswap/core-sdk'
import SumUSDCValues from 'app/features/trident/SumUSDCValues'
import { classNames } from 'app/functions'
import { useTotalSupply } from 'app/hooks/useTotalSupply'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalance } from 'app/state/wallet/hooks'
import React, { FC } from 'react'

interface PoolValueProps {
  pair: Pair
  roundedBottom?: boolean
}

export const PoolValueEstimation: FC<PoolValueProps> = ({ pair, roundedBottom }) => {
  const { account } = useActiveWeb3React()

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userDefaultPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userDefaultPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userDefaultPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userDefaultPoolBalance, false),
        ]
      : [undefined, undefined]
  return (
    <div className={classNames('flex items-center justify-between p-3 bg-dark-800', roundedBottom && 'rounded-b')}>
      <div>
        <div>
          {token0Deposited?.toSignificant(6)} {pair.token0.symbol}
        </div>
        <div>
          {token1Deposited?.toSignificant(6)} {pair.token1.symbol}
        </div>
      </div>
      <SumUSDCValues amounts={[token0Deposited, token1Deposited]}>
        {({ amount }) => {
          return <div className="font-bold text-high-emphesis">≈ ${amount?.toFixed(2)}</div>
        }}
      </SumUSDCValues>
    </div>
  )
}
