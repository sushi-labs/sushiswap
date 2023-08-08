import { Amount, Token } from '@sushiswap/currency'
import { AngleRewardsPool, usePrices } from '@sushiswap/react-query'

interface SimulateParams {
  amount0: Amount<Token>
  amount1: Amount<Token>
  liquidity: number
  poolData: AngleRewardsPool
  prices: ReturnType<typeof usePrices>['data']
}

export const simulate = async ({ amount0, amount1, liquidity, prices, poolData }: SimulateParams) => {
  if (!prices) return

  const distributionData = poolData?.distributionData

  // Iterate over active distributions to compute the APR
  return distributionData?.reduce((prev, curr) => {
    const active = curr.end > Date.now() && curr.start < Date.now()

    if (!active) return prev
    const yearlyRewards =
      (+prices[curr.token.address].toSignificant(6) * curr.amount * (365 * 24 * 3600)) / (curr.end - curr.start)

    return (
      prev +
      (yearlyRewards *
        ((curr.propToken0 * +amount0.toExact()) / (poolData?.token0InPool + +amount0.toExact()) +
          (curr.propToken1 * +amount1.toExact()) / (poolData?.token1InPool + +amount1.toExact()) +
          (curr.propFees * liquidity) / (poolData?.liquidity + liquidity))) /
        (+amount0.toExact() * +prices[amount0.currency.address].toSignificant(6) +
          +amount1.toExact() * +prices[amount1.currency.address].toSignificant(6))
    )
  }, 0)
}
