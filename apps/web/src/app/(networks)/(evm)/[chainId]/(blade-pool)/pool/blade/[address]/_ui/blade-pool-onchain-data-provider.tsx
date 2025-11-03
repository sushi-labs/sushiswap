'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { type BladePoolTokenAsset, getPoolAssets } from 'src/lib/pool/blade'
import { usePoolTokensBalance } from 'src/lib/pool/blade/usePoolTokensBalance'
import { Amount } from 'sushi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'

type BladePoolOnchainDataContext = {
  liquidityUSD: number
  liquidity: bigint
  refetch: () => void
}

const Context = createContext<BladePoolOnchainDataContext | undefined>(
  undefined,
)

export const BladePoolOnchainDataProvider: FC<{
  pool: BladePool
  children: ReactNode
}> = ({ pool, children }) => {
  const { data: poolTokensBalance, refetch } = usePoolTokensBalance({
    pool,
  })
  const { data: prices, isLoading: isPricesLoading } = usePrices({
    chainId: pool.chainId,
  })

  const { liquidityUSD, liquidity } = useMemo(() => {
    const poolTokens = getPoolAssets(pool, { showStableTypes: true })
    if (!poolTokensBalance || isPricesLoading)
      return { liquidityUSD: pool.liquidityUSD, liquidity: pool.liquidity }

    const [balances, tokens, liquidity] = poolTokensBalance

    let isMissingData = false
    const liquidityUSD = balances.reduce((acc, balance, index) => {
      if (isMissingData) return pool.liquidityUSD
      const poolToken = poolTokens.find(
        (poolToken): poolToken is BladePoolTokenAsset =>
          'token' in poolToken &&
          poolToken.token.wrap().address === tokens[index].toLowerCase(),
      )

      const price =
        prices?.get(tokens[index]) ?? (poolToken ? poolToken.priceUSD : null)

      if (price === null || !poolToken) {
        isMissingData = true
        return pool.liquidityUSD
      }
      const exactAmount = new Amount(poolToken.token, balance)
      const usdValue = Number(exactAmount.toString()) * price
      return acc + usdValue
    }, 0)
    return { liquidityUSD, liquidity }
  }, [poolTokensBalance, prices, pool, isPricesLoading])

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          liquidityUSD,
          liquidity,
          refetch,
        }),
        [liquidityUSD, liquidity, refetch],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const useBladePoolOnchainData = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Blade Pool Context')
  }

  return context
}
