import { Pair } from '@sushiswap/core-sdk'
import { useV2Pairs } from 'app/hooks/useV2Pairs'
import { useActiveWeb3React } from 'app/services/web3'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'app/state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'app/state/wallet/hooks'
import { useMemo } from 'react'

interface V2PairsWithLiquidity {
  loading: boolean
  pairs: Pair[]
}

/**
 * Fetches all of the V2 pairs the user has with a balance
 * @return V2PairsWithLiquidity
 */
export const useV2PairsWithLiquidity = (): V2PairsWithLiquidity => {
  const { account } = useActiveWeb3React()
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  // 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32

  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  return { loading: v2IsLoading, pairs: allV2PairsWithLiquidity }
}
