import { AngleRewardsPool, usePrices } from '@sushiswap/react-query'
import { Amount, Token } from 'sushi/currency'

interface SimulateParams {
  amount0: Amount<Token>
  amount1: Amount<Token>
  liquidity: number
  poolData: AngleRewardsPool
  prices: ReturnType<typeof usePrices>['data']
}

export const simulate = async ({
  amount0,
  amount1,
  liquidity,
  prices,
  poolData,
}: SimulateParams) => {
  if (!prices) return

  const distributionData = poolData?.distributionData

  // Iterate over active distributions to compute the APR
  return distributionData?.reduce((prev, curr) => {
    const active =
      curr.endTimestamp > Date.now() && curr.startTimestamp < Date.now()

    if (!active) return prev
    const yearlyRewards =
      (+prices.get(curr.token.address)!.toSignificant(6) *
        curr.amount *
        (365 * 24 * 3600)) /
      (curr.endTimestamp - curr.startTimestamp)

    return (
      prev +
      (yearlyRewards *
        ((curr.propToken0 * +amount0.toExact()) /
          (poolData?.poolBalanceToken0 + +amount0.toExact()) +
          (curr.propToken1 * +amount1.toExact()) /
            (poolData?.poolBalanceToken1 + +amount1.toExact()) +
          (curr.propFees * liquidity) /
            (poolData?.poolTotalLiquidity + liquidity))) /
        (+amount0.toExact() *
          +prices.get(amount0.currency.address)!.toSignificant(6) +
          +amount1.toExact() *
            +prices.get(amount1.currency.address)!.toSignificant(6))
    )
  }, 0)
}
