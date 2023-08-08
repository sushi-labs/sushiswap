'use client'

import { Chain } from '@sushiswap/chain'
import { Amount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { JSBI } from '@sushiswap/math'
import { useAngleRewards } from '@sushiswap/react-query'
import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardFooter,
  CardGroup,
  CardHeader,
  CardItem,
  CardLabel,
  CardTitle,
  classNames,
  LinkInternal,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toggle,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { SkeletonText } from '@sushiswap/ui/components/skeleton'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import {
  useConcentratedLiquidityPositionsFromTokenId,
  useConcentratedPositionInfo,
  useConcentratedPositionOwner,
  useTokenWithCache,
} from '@sushiswap/wagmi/future/hooks'
import { Checker } from '@sushiswap/wagmi/future/systems'
import useIsTickAtLimit from 'lib/hooks/useIsTickAtLimit'
import React, { FC, Fragment, useMemo, useState } from 'react'

import { isAngleEnabledChainId } from '../../config'
import { Bound } from '../../lib/constants'
import { formatTickPrice, getPriceOrderingFromPositionForUI, unwrapToken } from '../../lib/functions'
import { usePriceInverter, useTokenAmountDollarValues } from '../../lib/hooks'
import { ConcentratedLiquidityCollectButton } from './ConcentratedLiquidityCollectButton'
import { ConcentratedLiquidityHarvestButton } from './ConcentratedLiquidityHarvestButton'
import { ConcentratedLiquidityProvider, useConcentratedDerivedMintInfo } from './ConcentratedLiquidityProvider'
import { ConcentratedLiquidityRemoveWidget } from './ConcentratedLiquidityRemoveWidget'
import { ConcentratedLiquidityWidget } from './ConcentratedLiquidityWidget'
import { DistributionDataTable } from './DistributionDataTable'

const Component: FC<{ id: string }> = ({ id }) => {
  const { address } = useAccount()
  const [chainId, poolId, tokenId] = id.split('%3A') as [SushiSwapV3ChainId, string, string]
  const [invert, setInvert] = useState(false)

  const { data: positionDetails } = useConcentratedLiquidityPositionsFromTokenId({
    chainId,
    tokenId,
  })

  const { data: token0, isLoading: token0Loading } = useTokenWithCache({ chainId, address: positionDetails?.token0 })
  const { data: token1, isLoading: token1Loading } = useTokenWithCache({ chainId, address: positionDetails?.token1 })

  const { data: position, isLoading: isPositionLoading } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

  const pricesFromPosition = position ? getPriceOrderingFromPositionForUI(position) : undefined

  const { pool, outOfRange } = useConcentratedDerivedMintInfo({
    chainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount: positionDetails?.fee,
    existingPosition: position ?? undefined,
  })

  const [_token0, _token1] = useMemo(
    () => [token0 ? unwrapToken(token0) : undefined, token1 ? unwrapToken(token1) : undefined],
    [token0, token1]
  )

  const amounts = useMemo(() => {
    if (positionDetails?.fees && _token0 && _token1)
      return [
        Amount.fromRawAmount(_token0, JSBI.BigInt(positionDetails.fees[0])),
        Amount.fromRawAmount(_token1, JSBI.BigInt(positionDetails.fees[1])),
      ]

    return [undefined, undefined]
  }, [_token0, _token1, positionDetails])

  const { priceLower, priceUpper, base } = usePriceInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert,
  })

  const tickAtLimit = useIsTickAtLimit(positionDetails?.fee, position?.tickLower, position?.tickUpper)

  const inverted = token1 ? base?.equals(token1) : undefined
  const currencyQuote = inverted ? token0 : token1
  const currencyBase = inverted ? token1 : token0
  const below = pool && position && true ? pool.tickCurrent < position.tickLower : undefined
  const above = pool && position && true ? pool.tickCurrent >= position.tickUpper : undefined
  const inRange = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false
  const fullRange = Boolean(tickAtLimit[Bound.LOWER] && tickAtLimit[Bound.UPPER])

  const { data: owner } = useConcentratedPositionOwner({ chainId, tokenId })
  const { data: rewardsData, isLoading: rewardsLoading } = useAngleRewards({
    chainId,
    account: owner,
  })

  const fiatValuesAmounts = useTokenAmountDollarValues({ chainId, amounts })
  const positionAmounts = useMemo(() => [position?.amount0, position?.amount1], [position])
  const fiatValuesPosition = useTokenAmountDollarValues({ chainId, amounts: positionAmounts })
  const currentAngleRewardsPool = rewardsData?.pools[poolId]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col flex-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage</CardTitle>
            <CardDescription>Manage your position by adding/removing liquidity</CardDescription>
          </CardHeader>
          <Tabs className="w-full" defaultValue="add">
            <CardContent>
              <TabsList className="!flex">
                <TabsTrigger value="add" className="flex flex-1">
                  Add liquidity
                </TabsTrigger>
                <TabsTrigger value="remove" className="flex flex-1">
                  Remove liquidity
                </TabsTrigger>
              </TabsList>
            </CardContent>
            <TabsContent value="add">
              <CardContent>
                <ConcentratedLiquidityWidget
                  withTitleAndDescription={false}
                  chainId={chainId}
                  account={address}
                  token0={_token0}
                  token1={_token1}
                  feeAmount={positionDetails?.fee}
                  tokensLoading={token0Loading || token1Loading}
                  existingPosition={position ?? undefined}
                  tokenId={tokenId}
                />
              </CardContent>
            </TabsContent>
            <TabsContent value="remove">
              <ConcentratedLiquidityRemoveWidget
                token0={_token0}
                token1={_token1}
                account={address}
                chainId={chainId}
                position={position ?? undefined}
                positionDetails={positionDetails}
              />
            </TabsContent>
          </Tabs>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unclaimed fees</CardTitle>
            <CardDescription>{formatUSD(fiatValuesAmounts[0] + fiatValuesAmounts[1])}</CardDescription>
          </CardHeader>
          <CardContent>
            <CardGroup>
              <CardLabel>Tokens</CardLabel>
              <CardCurrencyAmountItem
                amount={amounts[0]}
                isLoading={isPositionLoading}
                fiatValue={formatUSD(fiatValuesAmounts[0])}
              />
              <CardCurrencyAmountItem
                amount={amounts[1]}
                isLoading={isPositionLoading}
                fiatValue={formatUSD(fiatValuesAmounts[1])}
              />
            </CardGroup>
          </CardContent>
          <CardFooter>
            <ConcentratedLiquidityCollectButton
              position={position ?? undefined}
              positionDetails={positionDetails}
              token0={token0}
              token1={token1}
              account={address}
              chainId={chainId}
            >
              {({ sendTransaction, isLoading }) => (
                <Checker.Connect variant="outline" fullWidth size="default">
                  <Checker.Network variant="outline" fullWidth size="default" chainId={chainId}>
                    <Button
                      variant="secondary"
                      fullWidth
                      disabled={isLoading}
                      onClick={() => sendTransaction?.()}
                      size="default"
                    >
                      Collect
                    </Button>
                  </Checker.Network>
                </Checker.Connect>
              )}
            </ConcentratedLiquidityCollectButton>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-col flex-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Position Details
              <div
                className={classNames(
                  !inRange ? 'bg-yellow/10' : 'bg-green/10',
                  'px-2 py-1 flex items-center gap-1 rounded-full'
                )}
              >
                <div className={classNames(outOfRange ? 'bg-yellow' : 'bg-green', 'w-3 h-3 rounded-full')} />
                {outOfRange ? (
                  <span className="text-xs font-medium text-yellow-900 dark:text-yellow">Out of Range</span>
                ) : (
                  <span className="text-xs font-medium text-green">In Range</span>
                )}
              </div>
            </CardTitle>
            <CardDescription>{formatUSD(fiatValuesPosition.reduce((acc, cur) => acc + cur, 0))}</CardDescription>
          </CardHeader>
          <CardContent>
            <CardGroup>
              <CardLabel>Tokens</CardLabel>
              <CardCurrencyAmountItem
                isLoading={isPositionLoading}
                amount={position?.amount0}
                fiatValue={formatUSD(fiatValuesPosition[0])}
              />
              <CardCurrencyAmountItem
                isLoading={isPositionLoading}
                amount={position?.amount1}
                fiatValue={formatUSD(fiatValuesPosition[1])}
              />
            </CardGroup>
            <CardGroup>
              <CardLabel>Current price</CardLabel>
              {pool && currencyBase && currencyQuote ? (
                <CardItem
                  title={
                    <>
                      1 {unwrapToken(currencyBase)?.symbol} ={' '}
                      {(inverted ? pool?.token1Price : pool?.token0Price)?.toSignificant(6)}{' '}
                      {unwrapToken(currencyQuote)?.symbol}
                    </>
                  }
                >
                  <div className="flex items-center gap-1">
                    <Toggle pressed={invert} onClick={() => setInvert(true)} size="xs" variant="outline">
                      {_token0?.symbol}
                    </Toggle>
                    <Toggle pressed={!invert} onClick={() => setInvert(false)} size="xs" variant="outline">
                      {_token1?.symbol}
                    </Toggle>
                  </div>
                </CardItem>
              ) : (
                <SkeletonText fontSize="sm" />
              )}
            </CardGroup>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-accent p-4 flex flex-col gap-3 rounded-xl">
                <div className="flex">
                  <div className="gap-1 px-2 py-1 text-xs font-medium rounded-full bg-pink/10 text-pink">Min Price</div>
                </div>
                <div className="flex flex-col">
                  {pool && currencyBase && currencyQuote ? (
                    <span className="font-medium">
                      {fullRange
                        ? '0'
                        : formatTickPrice({ price: priceLower, atLimit: tickAtLimit, direction: Bound.UPPER })}{' '}
                      {unwrapToken(currencyQuote)?.symbol}
                    </span>
                  ) : (
                    <SkeletonText />
                  )}
                </div>
                {currencyBase && (
                  <span className="text-xs text-slate-500">
                    Your position will be 100% {unwrapToken(currencyBase).symbol} at this price.
                  </span>
                )}
              </div>
              <div className="border border-accent p-4 flex flex-col gap-3 rounded-xl">
                <div className="flex">
                  <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue/10 text-blue">
                    Max Price
                  </div>
                </div>
                <div className="flex flex-col">
                  {priceUpper && pool && currencyQuote && currencyBase ? (
                    <span className="font-medium">
                      {fullRange
                        ? '∞'
                        : formatTickPrice({ price: priceUpper, atLimit: tickAtLimit, direction: Bound.UPPER })}{' '}
                      {unwrapToken(currencyQuote).symbol}
                    </span>
                  ) : (
                    <SkeletonText />
                  )}
                </div>
                {currencyQuote && (
                  <span className="text-xs text-slate-500">
                    Your position will be 100% {unwrapToken(currencyQuote).symbol} at this price.
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {isAngleEnabledChainId(chainId) ? (
          <Card>
            <CardHeader>
              <CardTitle>Unclaimed rewards</CardTitle>
              <CardDescription>
                This will claim your rewards for <b>every</b> V3 liquidity position on {Chain.from(chainId).name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardGroup>
                <CardLabel>Tokens (accrued over all positions)</CardLabel>
                {rewardsData && positionDetails && rewardsData.pools[positionDetails.address]?.rewardsPerToken ? (
                  Object.values(rewardsData.pools[positionDetails.address].rewardsPerToken).map((el, i) => (
                    <CardCurrencyAmountItem key={i} amount={el.unclaimed} />
                  ))
                ) : (
                  <CardItem skeleton />
                )}
              </CardGroup>
            </CardContent>
            <CardFooter>
              <ConcentratedLiquidityHarvestButton account={address} chainId={chainId}>
                {({ write, isLoading }) => (
                  <Checker.Connect fullWidth variant="outline" size="default">
                    <Checker.Network fullWidth variant="outline" size="default" chainId={chainId}>
                      <Button
                        variant="secondary"
                        fullWidth
                        disabled={isLoading}
                        onClick={() => write?.()}
                        size="default"
                      >
                        Harvest
                      </Button>
                    </Checker.Network>
                  </Checker.Connect>
                )}
              </ConcentratedLiquidityHarvestButton>
            </CardFooter>
          </Card>
        ) : null}
      </div>
      <div className="col-span-1 lg:col-span-2">
        {isAngleEnabledChainId(chainId) ? (
          <Card>
            <CardHeader>
              <CardTitle>Reward distributions</CardTitle>
              <CardDescription>
                Anyone can add distributions to this pool.{' '}
                {_token0 && _token1 ? (
                  <LinkInternal
                    href={`/pool/incentivize?chainId=${chainId}&fromCurrency=${
                      _token0.isNative ? 'NATIVE' : _token0.address
                    }&toCurrency=${_token1.isNative ? 'NATIVE' : _token1.address}&feeAmount=${positionDetails?.fee}`}
                  >
                    <Button asChild variant="link">
                      Want to add one?
                    </Button>
                  </LinkInternal>
                ) : null}
              </CardDescription>
            </CardHeader>
            <Tabs className="w-full" defaultValue="add">
              <CardContent>
                <TabsList className="!flex">
                  <TabsTrigger value="add" className="flex flex-1">
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="remove" className="flex flex-1">
                    Expired
                  </TabsTrigger>
                </TabsList>
              </CardContent>
              <TabsContent value="add">
                <DistributionDataTable
                  isLoading={rewardsLoading}
                  data={currentAngleRewardsPool?.distributionData.filter((el) => el.isLive)}
                />
              </TabsContent>
              <TabsContent value="remove">
                <DistributionDataTable
                  isLoading={rewardsLoading}
                  data={currentAngleRewardsPool?.distributionData.filter((el) => !el.isLive)}
                />
              </TabsContent>
            </Tabs>
          </Card>
        ) : null}
      </div>
    </div>
  )
}

export const PositionView = ({ params }: { params: { id: string } }) => {
  return (
    <ConcentratedLiquidityProvider>
      <Component id={params.id} />
    </ConcentratedLiquidityProvider>
  )
}
