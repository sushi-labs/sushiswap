'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkInternal,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { FormattedNumber } from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui'
import { type FC, useMemo, useState } from 'react'
import { Bound } from 'src/lib/constants'
import {
  formatTickPrice,
  getPriceOrderingFromPositionForUI,
} from 'src/lib/functions'
import { useKatanaRewardCampaigns } from 'src/lib/hooks/react-query/rewards/use-katana-reward-campaigns'
import { useRewardCampaigns } from 'src/lib/hooks/react-query/rewards/use-reward-campaigns'
import { usePriceInverter } from 'src/lib/hooks/use-price-inverter'
import { useIsTickAtLimit } from 'src/lib/pool/v3/use-is-tick-at-limit'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-position-info'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-positions-from-token-id'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/use-token-with-cache'
import { formatPercent } from 'sushi'
import {
  type EvmAddress,
  EvmChainId,
  type SushiSwapV3ChainId,
  getEvmChainById,
  isMerklChainId,
  unwrapEvmToken,
} from 'sushi/evm'
import { useConnection } from 'wagmi'
import {
  ConcentratedLiquidityProvider,
  useConcentratedDerivedMintInfo,
} from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { LiquidityAllocationCard } from '~evm/[chainId]/pool/_ui/liquidity-allocation-card'
import { DistributionDataTable } from '../../../../_ui/distribution-data-table'
import { KatanaStakingMessage } from '../../../../_ui/katana-staking-message'
import { PositionFeesCard, PositionRewardsCard } from './position-claim-cards'
import { V3PositionPriceChart } from './v3-position-price-chart'

const Component: FC<{
  chainId: SushiSwapV3ChainId
  address: EvmAddress
  position: string
}> = ({ chainId, address: poolAddress, position: tokenId }) => {
  const { address } = useConnection()
  const [invert, setInvert] = useState(false)

  const {
    data: positionDetails,
    isLoading: isPositionDetailsLoading,
    isPlaceholderData: isPreviousPosition,
    refetch: refetchPositionDetails,
  } = useConcentratedLiquidityPositionsFromTokenId({
    chainId,
    tokenId,
  })

  const { data: token0, isLoading: token0Loading } = useTokenWithCache({
    chainId,
    address: positionDetails?.token0,
  })
  const { data: token1, isLoading: token1Loading } = useTokenWithCache({
    chainId,
    address: positionDetails?.token1,
  })

  const { data: position, isInitialLoading: isPositionLoading } =
    useConcentratedPositionInfo({
      chainId,
      token0,
      tokenId,
      token1,
    })

  const pricesFromPosition = position
    ? getPriceOrderingFromPositionForUI(position)
    : undefined

  const { pool } = useConcentratedDerivedMintInfo({
    chainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount: positionDetails?.fee,
    existingPosition: position ?? undefined,
  })

  const [_token0, _token1] = useMemo(
    () => [
      token0 ? unwrapEvmToken(token0) : undefined,
      token1 ? unwrapEvmToken(token1) : undefined,
    ],
    [token0, token1],
  )

  const { priceLower, priceUpper, base } = usePriceInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert,
  })

  const tickAtLimit = useIsTickAtLimit(
    positionDetails?.fee,
    position?.tickLower,
    position?.tickUpper,
  )

  const inverted = Boolean(token1 && base?.isSame(token1))
  const currencyQuote = inverted ? token0 : token1
  const currencyBase = inverted ? token1 : token0
  const baseSymbol = (inverted ? _token1 : _token0)?.symbol
  const quoteSymbol = (inverted ? _token0 : _token1)?.symbol
  const currentPrice = inverted ? pool?.token1Price : pool?.token0Price
  const displayTickAtLimit = inverted
    ? {
        [Bound.LOWER]: tickAtLimit[Bound.UPPER],
        [Bound.UPPER]: tickAtLimit[Bound.LOWER],
      }
    : tickAtLimit
  const fullRange = Boolean(
    tickAtLimit[Bound.LOWER] && tickAtLimit[Bound.UPPER],
  )

  const { data: campaignsData, isLoading: isCampaignsLoading } =
    useRewardCampaigns({
      pool: poolAddress,
      chainId,
      enabled: isMerklChainId(chainId),
    })
  const {
    data: katanaRewardCampaigns,
    isLoading: isKatanaRewardCampaignsLoading,
  } = useKatanaRewardCampaigns({
    pool: poolAddress,
    chainId,
    enabled: chainId === EvmChainId.KATANA,
  })

  const mergedCampaignsData = useMemo(() => {
    return [...(campaignsData ?? []), ...(katanaRewardCampaigns ?? [])]
  }, [campaignsData, katanaRewardCampaigns])

  const [activeCampaigns, inactiveCampaigns] = useMemo(() => {
    const activeCampaigns: typeof mergedCampaignsData = []
    const inactiveCampaigns: typeof mergedCampaignsData = []

    mergedCampaignsData?.forEach((campaign) => {
      if (campaign.isLive) activeCampaigns.push(campaign)
      else inactiveCampaigns.push(campaign)
    })

    return [activeCampaigns, inactiveCampaigns]
  }, [mergedCampaignsData])

  const isRewardsDistributionLoading =
    isCampaignsLoading ||
    (chainId === EvmChainId.KATANA && isKatanaRewardCampaignsLoading)

  const isLoading =
    isPositionDetailsLoading ||
    token0Loading ||
    token1Loading ||
    isPositionLoading

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
          <div className="flex min-w-0 flex-col items-start">
            {currentPrice && currencyBase && currencyQuote ? (
              <button
                type="button"
                title="Invert price"
                className="text-left text-xl font-medium sm:text-2xl"
                onClick={() => setInvert((previous) => !previous)}
              >
                1 {baseSymbol} ={' '}
                <FormattedNumber number={currentPrice.toSignificant(6)} />{' '}
                {quoteSymbol}
              </button>
            ) : (
              <SkeletonText fontSize="xl" className="max-w-48" />
            )}
            <V3PositionPriceChart
              chainId={chainId}
              address={positionDetails?.address ?? poolAddress}
              liquidity={
                isPreviousPosition ? undefined : positionDetails?.liquidity
              }
              isPositionLoading={isPositionDetailsLoading || isPreviousPosition}
              inverted={inverted}
              baseSymbol={baseSymbol}
              quoteSymbol={quoteSymbol}
              currentPrice={currentPrice?.toNumber()}
              priceLower={
                displayTickAtLimit[Bound.LOWER] ? 0 : priceLower?.toNumber()
              }
              priceUpper={
                displayTickAtLimit[Bound.UPPER]
                  ? Number.POSITIVE_INFINITY
                  : priceUpper?.toNumber()
              }
            />
            <div className="grid w-full grid-cols-2 gap-3 mt-6">
              <Card>
                <CardContent className="!gap-2 !pt-4 !p-4 ">
                  <div className="text-sm">Min Price</div>

                  <div className="flex flex-col">
                    {pool && currencyBase && currencyQuote ? (
                      <span className="font-medium">
                        {fullRange ? (
                          '0'
                        ) : (
                          <>
                            <FormattedNumber
                              number={formatTickPrice({
                                price: priceLower,
                                atLimit: displayTickAtLimit,
                                direction: Bound.LOWER,
                              })}
                            />{' '}
                            {unwrapEvmToken(currencyQuote)?.symbol}{' '}
                            <HoverCard closeDelay={0} openDelay={0}>
                              <HoverCardTrigger asChild>
                                <span className="text-sm underline decoration-dotted underline-offset-2 text-muted-foreground font-normal">
                                  (
                                  {formatPercent(
                                    priceLower
                                      ?.sub(
                                        inverted
                                          ? pool.token1Price
                                          : pool.token0Price,
                                      )
                                      .div(
                                        inverted
                                          ? pool.token1Price
                                          : pool.token0Price,
                                      )
                                      .toSignificant(4),
                                  )}
                                  )
                                </span>
                              </HoverCardTrigger>
                              <HoverCardContent className="!p-0 max-w-[320px]">
                                <CardHeader>
                                  <CardTitle>Min. Price</CardTitle>
                                  <CardDescription>
                                    If the current price moves down{' '}
                                    {formatPercent(
                                      priceLower
                                        ?.sub(
                                          inverted
                                            ? pool.token1Price
                                            : pool.token0Price,
                                        )
                                        .div(
                                          inverted
                                            ? pool.token1Price
                                            : pool.token0Price,
                                        )
                                        .toSignificant(4),
                                    )}{' '}
                                    from the current price, your position will
                                    be 100%{' '}
                                    {unwrapEvmToken(currencyBase).symbol}
                                  </CardDescription>
                                </CardHeader>
                              </HoverCardContent>
                            </HoverCard>
                          </>
                        )}
                      </span>
                    ) : (
                      <SkeletonText />
                    )}
                  </div>
                  {currencyBase && (
                    <span className="text-xs text-muted-foreground">
                      Your position will be 100%{' '}
                      {unwrapEvmToken(currencyBase).symbol} at this price.
                    </span>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="!gap-2 !pt-4 !p-4 ">
                  <div className="text-sm">Max Price</div>
                  <div className="flex flex-col">
                    {priceUpper && pool && currencyQuote && currencyBase ? (
                      <span className="font-medium">
                        {fullRange ? (
                          '∞'
                        ) : (
                          <>
                            <FormattedNumber
                              number={formatTickPrice({
                                price: priceUpper,
                                atLimit: displayTickAtLimit,
                                direction: Bound.UPPER,
                              })}
                            />{' '}
                            {unwrapEvmToken(currencyQuote)?.symbol}{' '}
                            <HoverCard closeDelay={0} openDelay={0}>
                              <HoverCardTrigger asChild>
                                <span className="text-sm underline decoration-dotted underline-offset-2 text-muted-foreground font-normal">
                                  (
                                  {formatPercent(
                                    priceUpper
                                      ?.sub(
                                        inverted
                                          ? pool.token1Price
                                          : pool.token0Price,
                                      )
                                      .div(
                                        inverted
                                          ? pool.token1Price
                                          : pool.token0Price,
                                      )
                                      .toSignificant(4),
                                  )}
                                  )
                                </span>
                              </HoverCardTrigger>
                              <HoverCardContent className="!p-0 max-w-[320px]">
                                <CardHeader>
                                  <CardTitle>Max. Price</CardTitle>
                                  <CardDescription>
                                    If the current price moves up +
                                    {formatPercent(
                                      priceUpper
                                        ?.sub(
                                          inverted
                                            ? pool.token1Price
                                            : pool.token0Price,
                                        )
                                        .div(
                                          inverted
                                            ? pool.token1Price
                                            : pool.token0Price,
                                        )
                                        .toSignificant(4),
                                    )}{' '}
                                    from the current price, your position will
                                    be 100%{' '}
                                    {unwrapEvmToken(currencyQuote).symbol}
                                  </CardDescription>
                                </CardHeader>
                              </HoverCardContent>
                            </HoverCard>
                          </>
                        )}
                      </span>
                    ) : (
                      <SkeletonText />
                    )}
                  </div>
                  {currencyQuote && (
                    <span className="text-xs text-muted-foreground">
                      Your position will be 100%{' '}
                      {unwrapEvmToken(currencyQuote).symbol} at this price.
                    </span>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-6">
            <LiquidityAllocationCard
              title="Position Value"
              amount0={position?.amount0}
              amount1={position?.amount1}
              isLoading={isLoading}
            />
            <PositionFeesCard
              chainId={chainId}
              address={address}
              position={position ?? undefined}
              positionDetails={positionDetails}
              token0={token0}
              token1={token1}
              isLoading={isLoading}
              onFeesClaimed={() => void refetchPositionDetails()}
            />
            {isMerklChainId(chainId) && (
              <PositionRewardsCard chainId={chainId} tokenId={tokenId} />
            )}
          </div>
        </div>
        {isMerklChainId(chainId) ? (
          <>
            <div className="py-4">
              <Separator />
            </div>
            <KatanaStakingMessage pool={poolAddress} chainId={chainId} />
            <Card>
              <CardHeader>
                <CardTitle>Reward distributions</CardTitle>
                <CardDescription>
                  Anyone can add distributions to this pool.{' '}
                  {_token0 && _token1 ? (
                    <LinkInternal
                      href={`/${
                        getEvmChainById(chainId).key
                      }/pool/incentivize?fromCurrency=${
                        _token0.type === 'native' ? 'NATIVE' : _token0.address
                      }&toCurrency=${
                        _token1.type === 'native' ? 'NATIVE' : _token1.address
                      }&feeAmount=${positionDetails?.fee}`}
                    >
                      <Button asChild variant="link">
                        Want to add one?
                      </Button>
                    </LinkInternal>
                  ) : null}
                </CardDescription>
              </CardHeader>
              <Tabs className="w-full" defaultValue="active">
                <CardContent>
                  <TabsList className="!flex">
                    <TabsTrigger value="active" className="flex-1">
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="inactive" className="flex-1">
                      Upcoming & Expired
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
                <TabsContent value="active">
                  <DistributionDataTable
                    chainId={chainId}
                    isLoading={isRewardsDistributionLoading}
                    data={activeCampaigns}
                  />
                </TabsContent>
                <TabsContent value="inactive">
                  <DistributionDataTable
                    chainId={chainId}
                    isLoading={isRewardsDistributionLoading}
                    data={inactiveCampaigns}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </>
        ) : null}
      </div>
    </>
  )
}

export const V3PositionView = ({
  chainId,
  address,
  position,
}: { chainId: SushiSwapV3ChainId; address: EvmAddress; position: string }) => {
  return (
    <ConcentratedLiquidityProvider>
      <Component chainId={chainId} address={address} position={position} />
    </ConcentratedLiquidityProvider>
  )
}
