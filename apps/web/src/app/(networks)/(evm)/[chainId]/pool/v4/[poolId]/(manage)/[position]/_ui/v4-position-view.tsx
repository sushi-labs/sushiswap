'use client'

import type { SushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardItem,
  CardLabel,
  CardTitle,
  FormattedNumber,
  Message,
  Separator,
  SkeletonText,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toggle,
  classNames,
} from '@sushiswap/ui'
import { type ReactElement, useMemo, useState } from 'react'
import { Bound } from 'src/lib/constants'
import { useTokenAmountDollarValues } from 'src/lib/hooks/use-token-amount-dollar-values'
import { getTickLimits } from 'src/lib/pool/cl'
import {
  useV4PoolById,
  useV4PositionDetails,
  useV4PositionFees,
} from 'src/lib/pool/v4'
import { Amount, formatPercent, formatUSD } from 'sushi'
import { SushiSwapV4Position, getEvmChainById } from 'sushi/evm'
import { type Hex, isAddressEqual } from 'viem'
import { useConnection } from 'wagmi'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { useV4DerivedMintInfo } from '../../../../_ui/use-v4-derived-mint-info'
import {
  V4AddLiquiditySettings,
  V4LiquidityWidget,
} from '../../../../_ui/v4-liquidity-widget'
import { V4CollectFeesWidget } from './v4-collect-fees-widget'
import { V4RemoveLiquidityWidget } from './v4-remove-liquidity-widget'

function V4IncreaseLiquidity({
  chainId,
  tokenId,
  position,
}: {
  chainId: SushiSwapV4ChainId
  tokenId: bigint
  position: SushiSwapV4Position
}) {
  const derived = useV4DerivedMintInfo({
    currencyA: position.pool.currency0,
    currencyB: position.pool.currency1,
    pool: position.pool,
    isPoolLoading: false,
    poolConfig: undefined,
    existingPosition: position,
  })

  return (
    <V4LiquidityWidget
      chainId={chainId}
      currencyA={position.pool.currency0}
      currencyB={position.pool.currency1}
      derived={derived}
      tokenId={tokenId}
      withTitleAndDescription={false}
    />
  )
}

interface V4PositionViewProps {
  chainId: SushiSwapV4ChainId
  poolId: Hex
  tokenId: bigint
}

export function V4PositionView({
  chainId,
  poolId,
  tokenId,
}: V4PositionViewProps): ReactElement {
  const { address } = useConnection()
  const [invert, setInvert] = useState(false)

  const {
    data: details,
    isLoading: isDetailsLoading,
    error: detailsError,
    refetch: refetchDetails,
  } = useV4PositionDetails({ chainId, tokenId })
  const { data: pool, isLoading: isPoolLoading } = useV4PoolById({
    chainId,
    poolId,
  })
  const { data: pendingFees, isLoading: isFeesLoading } = useV4PositionFees({
    chainId,
    details,
  })

  const position = useMemo(() => {
    // A token of another pool may not fit this pool's tick spacing
    if (
      !details ||
      !pool ||
      details.poolId.toLowerCase() !== pool.poolId.toLowerCase()
    )
      return undefined
    return new SushiSwapV4Position({
      pool,
      tickLower: details.tickLower,
      tickUpper: details.tickUpper,
      liquidity: details.liquidity,
    })
  }, [details, pool])

  const fees = useMemo(() => {
    if (!pool || !pendingFees) return undefined
    return [
      new Amount(pool.currency0, pendingFees.amount0),
      new Amount(pool.currency1, pendingFees.amount1),
    ] as const
  }, [pool, pendingFees])

  const positionAmounts = useMemo(
    () => [position?.amount0, position?.amount1],
    [position],
  )
  const positionUSD = useTokenAmountDollarValues({
    chainId,
    amounts: positionAmounts,
  })
  const feeAmounts = useMemo(() => [fees?.[0], fees?.[1]], [fees])
  const feesUSD = useTokenAmountDollarValues({ chainId, amounts: feeAmounts })

  const isOwner = Boolean(
    address && details && isAddressEqual(details.owner, address),
  )
  const isLoading = isDetailsLoading || isPoolLoading
  // Burned positions have no details; a full removal burns, so stay mounted
  const closed = details === null || details?.liquidity === 0n
  const pair = pool ? `${pool.currency0.symbol}/${pool.currency1.symbol}` : ''
  // Loaded, but the index has no fees for the position or failed to read them
  const feesUnavailable = Boolean(details && pool && !isFeesLoading && !fees)

  if (details === undefined && detailsError) {
    return (
      <Message
        variant="destructive"
        className="flex flex-col items-center gap-3 text-center"
      >
        Position #{tokenId.toString()} could not be loaded.
        <Button size="sm" variant="secondary" onClick={() => refetchDetails()}>
          Try again
        </Button>
      </Message>
    )
  }
  if (details && details.poolId.toLowerCase() !== poolId.toLowerCase()) {
    return (
      <Message variant="destructive" className="text-center">
        Position #{tokenId.toString()} is not in this pool.
      </Message>
    )
  }

  const inRange = Boolean(
    position &&
      position.pool.tickCurrent >= position.tickLower &&
      position.pool.tickCurrent < position.tickUpper,
  )
  const limits = getTickLimits(pool?.tickSpacing)
  const [base, quote] = pool
    ? invert
      ? [pool.currency1, pool.currency0]
      : [pool.currency0, pool.currency1]
    : [undefined, undefined]
  // Ticks price currency0, so inverting swaps and inverts the bounds
  const minPrice = position
    ? invert
      ? position.currency0PriceUpper.invert()
      : position.currency0PriceLower
    : undefined
  const maxPrice = position
    ? invert
      ? position.currency0PriceLower.invert()
      : position.currency0PriceUpper
    : undefined
  const minAtLimit =
    position?.[invert ? 'tickUpper' : 'tickLower'] ===
    limits[invert ? Bound.UPPER : Bound.LOWER]
  const maxAtLimit =
    position?.[invert ? 'tickLower' : 'tickUpper'] ===
    limits[invert ? Bound.LOWER : Bound.UPPER]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Manage</CardTitle>
            <CardDescription>
              Manage your concentrated liquidity position.
            </CardDescription>
          </CardHeader>
          {details === null ? (
            <CardContent>
              <Message size="sm" variant="muted">
                This position has been closed and its token burned.
              </Message>
            </CardContent>
          ) : null}
          {!isOwner && details && address ? (
            <CardContent>
              <Message size="sm" variant="destructive">
                You are not the owner of this position, so you cannot change it.
                Its owner is {details.owner}.
              </Message>
            </CardContent>
          ) : null}
          <Tabs className="w-full" defaultValue="add">
            <CardContent>
              <TabsList className="!flex">
                <TabsTrigger
                  testdata-id="add-tab"
                  value="add"
                  className="flex-1"
                >
                  Add
                </TabsTrigger>
                <TabsTrigger
                  testdata-id="remove-tab"
                  value="remove"
                  className="flex-1"
                >
                  Remove
                </TabsTrigger>
                <TabsTrigger
                  testdata-id="fees-tab"
                  value="fees"
                  className="flex-1"
                >
                  Fees
                </TabsTrigger>
              </TabsList>
            </CardContent>
            <div className="px-6">
              <Separator />
            </div>
            <TabsContent value="add">
              <CardContent>
                <CardHeader className="px-0 pb-0">
                  <CardTitle className="flex justify-between items-center">
                    Add liquidity
                    <V4AddLiquiditySettings />
                  </CardTitle>
                  <CardDescription>
                    Add liquidity to this position.
                  </CardDescription>
                </CardHeader>
                {/* Without a wallet, the widget asks to connect one */}
                {position && (isOwner || !address) ? (
                  <ConcentratedLiquidityProvider>
                    <V4IncreaseLiquidity
                      chainId={chainId}
                      tokenId={tokenId}
                      position={position}
                    />
                  </ConcentratedLiquidityProvider>
                ) : isLoading ? (
                  <SkeletonText />
                ) : null}
              </CardContent>
            </TabsContent>
            <TabsContent value="remove">
              <CardHeader>
                <CardTitle>Remove liquidity</CardTitle>
                <CardDescription>
                  Please enter how much of the position you want to remove.
                </CardDescription>
              </CardHeader>
              <V4RemoveLiquidityWidget
                chainId={chainId}
                tokenId={tokenId}
                position={position}
                closed={closed}
                pair={pair}
                fees={fees}
                feesUnavailable={feesUnavailable}
                isOwner={isOwner}
              />
            </TabsContent>
            <TabsContent value="fees">
              <CardHeader>
                <CardTitle>Unclaimed fees</CardTitle>
                <CardDescription>
                  {formatUSD((feesUSD[0] ?? 0) + (feesUSD[1] ?? 0))}
                </CardDescription>
              </CardHeader>
              <V4CollectFeesWidget
                chainId={chainId}
                tokenId={tokenId}
                poolKey={details?.poolKey}
                pair={pair}
                fees={fees}
                feesUnavailable={feesUnavailable}
                feesUSD={feesUSD}
                isLoading={isLoading || isFeesLoading}
                isOwner={isOwner}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Position #{tokenId.toString()}
              {position ? (
                <div
                  className={classNames(
                    inRange ? 'bg-green/10' : 'bg-yellow/10',
                    'px-2 py-1 flex items-center gap-1 rounded-full',
                  )}
                >
                  <div
                    className={classNames(
                      inRange ? 'bg-green' : 'bg-yellow',
                      'w-3 h-3 rounded-full',
                    )}
                  />
                  <span
                    className={classNames(
                      inRange
                        ? 'text-green'
                        : 'text-yellow-900 dark:text-yellow',
                      'text-xs font-medium',
                    )}
                  >
                    {inRange ? 'In Range' : 'Out of Range'}
                  </span>
                </div>
              ) : null}
            </CardTitle>
            <CardDescription>
              {formatUSD((positionUSD[0] ?? 0) + (positionUSD[1] ?? 0))}
              {pool
                ? ` · ${pool.isDynamicFee ? 'Dynamic' : formatPercent(pool.fee / 1_000_000)} fee on ${getEvmChainById(chainId).name}`
                : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardGroup>
              <CardLabel>Tokens</CardLabel>
              <CardCurrencyAmountItem
                unwrap={false}
                isLoading={isLoading}
                amount={position?.amount0}
                fiatValue={formatUSD(positionUSD[0] ?? 0)}
              />
              <CardCurrencyAmountItem
                unwrap={false}
                isLoading={isLoading}
                amount={position?.amount1}
                fiatValue={formatUSD(positionUSD[1] ?? 0)}
              />
            </CardGroup>
            <CardGroup>
              <CardLabel>Current price</CardLabel>
              {pool && base && quote ? (
                <CardItem
                  title={
                    <>
                      1 {base.symbol} ={' '}
                      <FormattedNumber
                        number={pool.priceOf(base).toSignificant(6)}
                      />{' '}
                      {quote.symbol}
                    </>
                  }
                >
                  <div className="flex items-center gap-1">
                    <Toggle
                      pressed={!invert}
                      onClick={() => setInvert(false)}
                      size="xs"
                      variant="outline"
                    >
                      {pool.currency0.symbol}
                    </Toggle>
                    <Toggle
                      pressed={invert}
                      onClick={() => setInvert(true)}
                      size="xs"
                      variant="outline"
                    >
                      {pool.currency1.symbol}
                    </Toggle>
                  </div>
                </CardItem>
              ) : (
                <SkeletonText fontSize="sm" />
              )}
            </CardGroup>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ['Min Price', minPrice, minAtLimit ? '0' : undefined],
                  ['Max Price', maxPrice, maxAtLimit ? '∞' : undefined],
                ] as const
              ).map(([label, price, atLimit]) => (
                <div
                  key={label}
                  className="border border-accent p-4 flex flex-col gap-3 rounded-xl"
                >
                  <div className="flex">
                    <div className="gap-1 px-2 py-1 text-xs font-medium rounded-full bg-pink/10 text-pink">
                      {label}
                    </div>
                  </div>
                  {price && quote && base ? (
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {atLimit ?? (
                          <FormattedNumber number={price.toSignificant(6)} />
                        )}{' '}
                        {quote.symbol}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        per {base.symbol}
                      </span>
                    </div>
                  ) : (
                    <SkeletonText />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
