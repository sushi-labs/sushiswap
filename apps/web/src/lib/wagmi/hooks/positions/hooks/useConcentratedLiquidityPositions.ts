import { useCustomTokens } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { Amount, type Token } from 'sushi/currency'
import { Position, type SushiSwapV3Pool } from 'sushi/pool/sushiswap-v3'
import type { Address } from 'viem'
import { useConfig } from 'wagmi'
import { useMultiChainPrices } from '~evm/_common/ui/price-provider/price-provider/use-multi-chain-prices'
import { getConcentratedLiquidityPools } from '../../pools/actions/getConcentratedLiquidityPool'
import {
  getTokenWithCacheQueryFn,
  getTokenWithQueryCacheHydrate,
} from '../../tokens/useTokenWithCache'
import { getConcentratedLiquidityPositions } from '../actions/getConcentratedLiquidityPositions'
import type { ConcentratedLiquidityPosition } from '../types'

interface UseConcentratedLiquidityPositionsData
  extends Omit<ConcentratedLiquidityPosition, 'token0' | 'token1'> {
  token0: Token
  token1: Token
  pool: SushiSwapV3Pool
  position: {
    position: Position
    positionUSD: number
    unclaimedUSD: number
  }
}

interface UseConcentratedLiquidityPositionsParams {
  account: Address | undefined
  chainIds: readonly SushiSwapV3ChainId[]
  enabled?: boolean
}

const getPoolKey = ({
  chainId,
  token0,
  token1,
  fee,
}: {
  chainId: SushiSwapV3ChainId
  token0: Token
  token1: Token
  fee: number
}) =>
  `${chainId}:${token0.address.toLowerCase()}:${token1.address.toLowerCase()}:${fee}`

export const useConcentratedLiquidityPositions = ({
  account,
  chainIds,
  enabled = true,
}: UseConcentratedLiquidityPositionsParams) => {
  const { data: customTokens, hasToken } = useCustomTokens()

  const {
    data: prices,
    isError: isPriceError,
    isLoading: isPriceInitialLoading,
  } = useMultiChainPrices({
    chainIds,
    enabled: Boolean(account),
  })

  const config = useConfig()

  const {
    data: positions,
    isError: isPositionsError,
    isLoading: isPositionsInitialLoading,
  } = useQuery({
    queryKey: [
      'useConcentratedLiquidityPositions',
      { chainIds, account, prices },
    ],
    queryFn: async () => {
      const positions = await getConcentratedLiquidityPositions({
        account,
        chainIds,
        config,
      })

      if (!positions.length) return []

      const positionsWithTokens = (
        await Promise.all(
          positions.map(async (position) => {
            const [token0Data, token1Data] = await Promise.all([
              getTokenWithCacheQueryFn({
                chainId: position.chainId,
                hasToken,
                customTokens,
                address: position.token0,
                config,
              }),
              getTokenWithCacheQueryFn({
                chainId: position.chainId,
                hasToken,
                customTokens,
                address: position.token1,
                config,
              }),
            ])

            return {
              ...position,
              token0: getTokenWithQueryCacheHydrate(
                position.chainId,
                token0Data,
              ),
              token1: getTokenWithQueryCacheHydrate(
                position.chainId,
                token1Data,
              ),
            }
          }),
        )
      ).filter((position) =>
        Boolean(position.token0 && position.token1),
      ) as (Omit<ConcentratedLiquidityPosition, 'token0' | 'token1'> & {
        token0: Token
        token1: Token
      })[]

      const poolKeys = new Map(
        positionsWithTokens.map(({ chainId, token0, token1, fee }) => [
          getPoolKey({ chainId, token0, token1, fee }),
          {
            chainId: chainId,
            token0: token0,
            token1: token1,
            feeAmount: fee,
          },
        ]),
      )

      const pools = new Map(
        (
          await getConcentratedLiquidityPools({
            poolKeys: Array.from(poolKeys.values()),
            config,
          })
        )
          .filter((pool): pool is SushiSwapV3Pool => Boolean(pool))
          .map((pool) => [getPoolKey(pool), pool]),
      )

      return positionsWithTokens
        .map((_position) => {
          const {
            chainId,
            token0,
            token1,
            fee,
            liquidity,
            tickLower,
            tickUpper,
            fees,
          } = _position
          const pool = pools.get(getPoolKey({ chainId, token0, token1, fee }))
          if (!pool) return undefined

          const position = new Position({
            pool,
            liquidity,
            tickLower,
            tickUpper,
          })

          const amountToUsd = (amount: Amount<Token>) => {
            const _price = prices?.get(chainId)?.get(amount.currency.address)

            if (!amount?.greaterThan(0n) || !_price) return 0
            const price = Number(
              Number(amount.toExact()) * Number(_price.toFixed(10)),
            )
            if (Number.isNaN(price) || price < 0.000001) {
              return 0
            }

            return price
          }

          const positionUSD =
            amountToUsd(position.amount0) + amountToUsd(position.amount1)
          const unclaimedUSD =
            amountToUsd(Amount.fromRawAmount(pool.token0, fees?.[0] || 0)) +
            amountToUsd(Amount.fromRawAmount(pool.token1, fees?.[1] || 0))

          return {
            ..._position,
            pool,
            position: {
              position,
              positionUSD,
              unclaimedUSD,
            },
          }
        })
        .filter(
          (position): position is UseConcentratedLiquidityPositionsData =>
            typeof position !== 'undefined',
        )
    },
    refetchInterval: Number.POSITIVE_INFINITY,
    enabled: Boolean(
      account &&
        chainIds &&
        enabled &&
        (!isPriceInitialLoading || isPriceError),
    ),
  })

  return {
    data: positions,
    isError: isPositionsError || isPriceError,
    isInitialLoading: isPositionsInitialLoading || isPriceInitialLoading,
  }
}
