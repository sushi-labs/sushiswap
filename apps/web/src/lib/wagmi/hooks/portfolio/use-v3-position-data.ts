import type { PortfolioV2PositionV3PoolType } from '@sushiswap/graph-client/data-api-portfolio'
import { useMemo } from 'react'
import { Bound } from 'src/lib/constants'
import { getPriceOrderingFromPositionForUI } from 'src/lib/functions'
import { useIsTickAtLimit, usePriceInverter } from 'src/lib/hooks'
import { Amount } from 'sushi'
import type { EvmAddress, SushiSwapV3ChainId } from 'sushi/evm'
import { useConcentratedDerivedMintInfo } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { useConcentratedPositionInfo } from '../positions/hooks/useConcentratedPositionInfo'
import { useConcentratedLiquidityPositionsFromTokenId } from '../positions/hooks/useConcentratedPositionsFromTokenId'
import { useTokensFromPosition } from './use-tokens-from-position'

export const useV3PositionData = ({
  data,
  invert,
  address,
}: {
  data: PortfolioV2PositionV3PoolType
  invert: boolean
  address: EvmAddress | undefined
}) => {
  const chainId = data.pool.chainId as SushiSwapV3ChainId
  const tokenId = data.position?.tokenId
  const { token0, token1 } = useTokensFromPosition({ data })

  const { data: positionDetails, isLoading: isPositionDetailsLoading } =
    useConcentratedLiquidityPositionsFromTokenId({
      chainId: chainId,
      tokenId: tokenId,
    })

  const { data: v3Position, isLoading: isConcentratedPositionInfoLoading } =
    useConcentratedPositionInfo({
      chainId,
      token0,
      tokenId,
      token1,
    })

  const {
    pool,
    isLoading: isConcentratedDerivedMintInfoLoading,
    outOfRange,
  } = useConcentratedDerivedMintInfo({
    chainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount: positionDetails?.fee,
    existingPosition: v3Position ?? undefined,
  })

  const amounts = useMemo(() => {
    if (positionDetails?.fees && token0 && token1)
      return [
        new Amount(token0, BigInt(positionDetails?.fees?.[0])),
        new Amount(token1, BigInt(positionDetails?.fees?.[1])),
      ]

    return [undefined, undefined]
  }, [token0, token1, positionDetails])

  const pricesFromPosition = v3Position
    ? getPriceOrderingFromPositionForUI(v3Position)
    : undefined
  const { priceLower, priceUpper } = usePriceInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert,
  })

  const tickAtLimit = useIsTickAtLimit(
    positionDetails?.fee,
    v3Position?.tickLower,
    v3Position?.tickUpper,
  )
  const fullRange = Boolean(
    tickAtLimit[Bound.LOWER] && tickAtLimit[Bound.UPPER],
  )

  const below =
    pool && data && v3Position?.tickLower
      ? pool.tickCurrent < v3Position?.tickLower
      : undefined
  const above =
    pool && data && v3Position?.tickUpper
      ? pool.tickCurrent >= v3Position?.tickUpper
      : undefined
  const inRange =
    typeof below === 'boolean' && typeof above === 'boolean'
      ? !below && !above
      : false

  const range = useMemo(() => {
    if (below) return 'below' as const
    if (above) return 'above' as const
    if (inRange) return 'in-range' as const
    return 'unknown' as const
  }, [below, above, inRange])

  const isLoading =
    isPositionDetailsLoading ||
    isConcentratedPositionInfoLoading ||
    isConcentratedDerivedMintInfoLoading

  return useMemo(
    () => ({
      priceLower,
      priceUpper,
      amounts,
      token0,
      token1,
      token0Price: pool?.token0Price,
      token1Price: pool?.token1Price,
      fullRange,
      positionDetails,
      v3Position,
      range,
      isLoading,
      outOfRange,
      tickAtLimit,
    }),
    [
      priceLower,
      priceUpper,
      amounts,
      token0,
      token1,
      pool?.token0Price,
      pool?.token1Price,
      fullRange,
      positionDetails,
      v3Position,
      range,
      isLoading,
      outOfRange,
      tickAtLimit,
    ],
  )
}
