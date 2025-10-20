import type { PortfolioV2PositionV3PoolType } from '@sushiswap/graph-client/data-api-portfolio'
import { useMemo, useState } from 'react'
import { Bound } from 'src/lib/constants'
import { getPriceOrderingFromPositionForUI } from 'src/lib/functions'
import { useIsTickAtLimit, usePriceInverter } from 'src/lib/hooks'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionsFromTokenId'
import { Amount } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  EvmToken,
  type SushiSwapProtocol,
  type SushiSwapV3ChainId,
  unwrapEvmToken,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useConcentratedDerivedMintInfo } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { PriceRangeSparklineCLMM } from '../../price-range-sparkline-clmm'
import { Positions } from '../positions'
import { CurrentPrice } from './current-price'
import { Fees } from './fees'
import { MinMaxPrices } from './min-max-prices'
import { Rewards } from './rewards'

export const V3PositionDetail = ({
  position,
}: { position: PortfolioV2PositionV3PoolType }) => {
  //@dev
  //@todo make this data into a resuable hook to avoid duplication
  const chainId = position.pool.chainId as SushiSwapV3ChainId
  const tokenId = position.position?.tokenId
  const { address } = useAccount()
  const [invert, setInvert] = useState(false)

  const { data: positionDetails, isLoading: _isPositionDetailsLoading } =
    useConcentratedLiquidityPositionsFromTokenId({
      chainId: chainId,
      tokenId: tokenId,
    })

  const [token0, token1] = useMemo(() => {
    return [
      unwrapEvmToken(
        new EvmToken({
          chainId: position.position.token0.chainId as EvmChainId,
          address: position.position.token0.address as EvmAddress,
          decimals: position.position.token0.decimals,
          symbol: position.position.token0.symbol,
          name: position.position.token0.name,
        }),
      ),
      unwrapEvmToken(
        new EvmToken({
          chainId: position.position.token1.chainId as EvmChainId,
          address: position.position.token1.address as EvmAddress,
          decimals: position.position.token1.decimals,
          symbol: position.position.token1.symbol,
          name: position.position.token1.name,
        }),
      ),
    ]
  }, [position])
  const { data: v3Position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

  const { pool, isLoading, outOfRange } = useConcentratedDerivedMintInfo({
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
        new Amount(token0, BigInt(positionDetails.fees[0])),
        new Amount(token1, BigInt(positionDetails.fees[1])),
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
    pool && position && v3Position?.tickLower
      ? pool.tickCurrent < v3Position?.tickLower
      : undefined
  const above =
    pool && position && v3Position?.tickUpper
      ? pool.tickCurrent >= v3Position?.tickUpper
      : undefined
  const inRange =
    typeof below === 'boolean' && typeof above === 'boolean'
      ? !below && !above
      : false

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground dark:text-pink-200">
          Price Range
        </p>
        <PriceRangeSparklineCLMM
          strokeWidth={1.5}
          poolAddress={position.pool.address as EvmAddress}
          chainId={position.pool.chainId as SushiSwapV3ChainId}
          protocol={position.pool.protocol as SushiSwapProtocol}
          invert={invert}
          priceLower={priceLower}
          priceUpper={priceUpper}
          outOfRange={outOfRange}
          range={
            below
              ? 'below'
              : above
                ? 'above'
                : inRange
                  ? 'in-range'
                  : 'in-range'
          }
        />
      </div>
      <CurrentPrice
        token0Price={pool?.token0Price}
        token1Price={pool?.token1Price}
        token0={token0}
        token1={token1}
        invert={invert}
        setInvert={setInvert}
        isLoading={isLoading}
      />
      <MinMaxPrices
        token0={token0}
        token1={token1}
        token0Price={pool?.token0Price}
        token1Price={pool?.token1Price}
        priceLower={priceLower}
        priceUpper={priceUpper}
        tickAtLimit={tickAtLimit}
        invert={invert}
        fullRange={fullRange}
      />
      <Positions position={position} />
      <Fees
        position={v3Position}
        chainId={chainId}
        token0={token0}
        token1={token1}
        amounts={amounts}
        positionDetails={positionDetails}
        account={address}
      />
      <Rewards position={position} />
    </div>
  )
}
