'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { formatUnits } from 'viem'
import { ToggleZapCard } from '~evm/[chainId]/pool/_ui/toggle-zap-card'
import { useRemoveLiquidity } from '~stellar/_common/lib/hooks/liquidity/use-remove-liquidity'
import { useCalculateDependentAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-dependent-amount'
import { useMaxPairedAmount } from '~stellar/_common/lib/hooks/pool/use-max-paired-amount'
import { usePoolBalances } from '~stellar/_common/lib/hooks/pool/use-pool-balances'
import { useMyPosition } from '~stellar/_common/lib/hooks/position/use-my-position'
import { useAddLiquidity } from '~stellar/_common/lib/hooks/swap'
import { useTickRangeSelector } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import { useNeedsTrustline } from '~stellar/_common/lib/hooks/trustline/use-trustline'
import { useZap } from '~stellar/_common/lib/hooks/zap/use-zap'
import {
  calculatePriceFromSqrtPrice,
  formatPriceBound,
} from '~stellar/_common/lib/soroban/pool-helpers'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { alignTick, isTickAligned } from '~stellar/_common/lib/utils/ticks'
import { useStellarWallet } from '~stellar/providers'
import { useBestRoute } from '~stellar/swap/lib/hooks/use-best-route'
import { TickRangeSelector } from '../TickRangeSelector/TickRangeSelector'
import { CreateTrustlineButton } from '../Trustline/CreateTrustlineButton'
import { CurrencyInput } from '../currency/currency-input/currency-input'
import TokenSelector from '../token-selector/token-selector'
import { LiquidityDepthWidget } from './LiquidityDepthWidget'

interface ManageLiquidityCardProps {
  pool: PoolInfo
}

export const ManageLiquidityCard: React.FC<ManageLiquidityCardProps> = ({
  pool,
}) => {
  const { signTransaction, signAuthEntry } = useStellarWallet()
  const connectedAddress = useAccount('stellar')
  const { data: balances } = usePoolBalances(pool.address, connectedAddress)
  const { positions: myPositions } = useMyPosition({
    userAddress: connectedAddress || undefined,
    poolAddress: pool.address,
    excludeDust: true,
  })

  const token0Decimals = pool.token0.decimals
  const token1Decimals = pool.token1.decimals
  const [tab, setTab] = useState<string>('add')
  const [independentField, setIndependentField] = useState<'token0' | 'token1'>(
    'token0',
  )
  const [typedValue, setTypedValue] = useState<string>('')
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(
    null,
  )
  const [removePercent, setRemovePercent] = useState<number>(100)
  const [isZapModeEnabled, setIsZapModeEnabled] = useState<boolean>(false)
  const [zapTokenIn, setZapTokenIn] = useState<Token | null>(null)
  const [zapAmountIn, setZapAmountIn] = useState<string>('')

  const currentPrice = calculatePriceFromSqrtPrice(pool.sqrtPriceX96)
  const tickRangeSelectorState = useTickRangeSelector(
    pool.fee,
    currentPrice ?? 1,
  )

  // Check trustlines for pool tokens (needed for both add liquidity and zap)
  const {
    needsTrustline: needsToken0Trustline,
    isLoading: isLoadingToken0Trustline,
    issuer: token0ResolvedIssuer,
  } = useNeedsTrustline(
    pool.token0.code,
    pool.token0.contract,
    pool.token0.issuer,
  )
  const {
    needsTrustline: needsToken1Trustline,
    isLoading: isLoadingToken1Trustline,
    issuer: token1ResolvedIssuer,
  } = useNeedsTrustline(
    pool.token1.code,
    pool.token1.contract,
    pool.token1.issuer,
  )
  const isLoadingTrustlines =
    isLoadingToken0Trustline || isLoadingToken1Trustline
  // Use the resolved issuers from the trustline check (looked up from Horizon if not already known)
  const tokensNeedingTrustline = useMemo(() => {
    const tokens: Array<{ code: string; issuer: string }> = []
    if (needsToken0Trustline && token0ResolvedIssuer) {
      tokens.push({ code: pool.token0.code, issuer: token0ResolvedIssuer })
    }
    if (needsToken1Trustline && token1ResolvedIssuer) {
      tokens.push({ code: pool.token1.code, issuer: token1ResolvedIssuer })
    }
    return tokens
  }, [
    needsToken0Trustline,
    needsToken1Trustline,
    token0ResolvedIssuer,
    token1ResolvedIssuer,
    pool.token0.code,
    pool.token1.code,
  ])

  const {
    tickLower,
    tickUpper,
    setTickLower,
    setTickUpper,
    isTickRangeValid,
    tickSpacing,
    defaultLower,
    defaultUpper,
  } = tickRangeSelectorState

  // Reset tick range to defaults when Zap Mode is enabled
  useEffect(() => {
    if (isZapModeEnabled) {
      setTickLower(defaultLower)
      setTickUpper(defaultUpper)
    }
  }, [isZapModeEnabled, defaultLower, defaultUpper, setTickLower, setTickUpper])

  // Calculate dependent amount based on input
  const independentToken =
    independentField === 'token0' ? pool.token0 : pool.token1
  const dependentToken =
    independentField === 'token0' ? pool.token1 : pool.token0

  const { data: maxPairedAmountData } = useMaxPairedAmount(
    pool.address,
    balances?.token0.amount ?? '0',
    balances?.token1.amount ?? '0',
    tickLower,
    tickUpper,
    pool.token0.decimals,
    pool.token1.decimals,
  )

  // Calculate max amount that can be entered based on balances
  // This clamps the input to prevent exceeding independent balance or dependent balance
  const maxInputAmount = useMemo(() => {
    if (!balances || !maxPairedAmountData) return undefined

    if (independentField === 'token0') {
      // User is entering token0, dependent is token1
      const maxToken0FromBalance = formatUnits(
        BigInt(maxPairedAmountData.maxToken0Amount),
        pool.token0.decimals,
      )
      return maxToken0FromBalance
    } else {
      // User is entering token1, dependent is token0
      const maxToken1FromBalance = formatUnits(
        BigInt(maxPairedAmountData.maxToken1Amount),
        pool.token1.decimals,
      )
      return maxToken1FromBalance
    }
  }, [
    balances,
    maxPairedAmountData,
    independentField,
    pool.token0.decimals,
    pool.token1.decimals,
  ])

  // Auto-clamp typedValue to maxInputAmount if it exceeds (only in normal mode)
  useEffect(() => {
    if (isZapModeEnabled || !maxInputAmount || !typedValue) return

    const typedNum = Number.parseFloat(typedValue)
    const maxNum = Number.parseFloat(maxInputAmount)

    if (!Number.isNaN(typedNum) && !Number.isNaN(maxNum) && typedNum > maxNum) {
      setTypedValue(maxInputAmount)
    }
  }, [typedValue, maxInputAmount, isZapModeEnabled])

  // Use typedValue for calculations (will be auto-clamped by useEffect)
  const effectiveTypedValue = typedValue

  const { data: dependentAmountData } = useCalculateDependentAmount(
    pool.address,
    effectiveTypedValue,
    independentField,
    tickLower,
    tickUpper,
    independentToken.decimals,
    dependentToken.decimals,
    independentToken.code,
    dependentToken.code,
  )

  // Calculate dependent amount (only used in normal mode, not zap mode)
  const parsedAmount = dependentAmountData?.amount ?? '0'

  const amount0 =
    independentField === 'token0' ? effectiveTypedValue : parsedAmount
  const amount1 =
    independentField === 'token1' ? effectiveTypedValue : parsedAmount

  // Liquidity management hooks
  const addLiquidityMutation = useAddLiquidity()
  const halfZapAmountInBigInt =
    BigInt(
      Math.round(
        Number.parseFloat(zapAmountIn || '0') *
          10 ** (zapTokenIn?.decimals || 0),
      ),
    ) / 2n // Use half amount for estimating token0 route
  const zapMutation = useZap()
  // Only run route queries when in zap mode and zap inputs are valid
  const { route: routeToken0, isPending: _isPendingRouteToken0 } = useBestRoute(
    {
      tokenIn: zapTokenIn,
      tokenOut: pool.token0,
      amountIn: isZapModeEnabled ? halfZapAmountInBigInt : 0n,
    },
  )
  const { route: routeToken1, isPending: _isPendingRouteToken1 } = useBestRoute(
    {
      tokenIn: zapTokenIn,
      tokenOut: pool.token1,
      amountIn: isZapModeEnabled ? halfZapAmountInBigInt : 0n,
    },
  )
  const removeLiquidityMutation = useRemoveLiquidity()
  const selectedPosition = useMemo(
    () =>
      selectedPositionId == null
        ? undefined
        : myPositions.find((pos) => pos.tokenId === selectedPositionId),
    [myPositions, selectedPositionId],
  )

  useEffect(() => {
    if (!myPositions.length) {
      setSelectedPositionId(null)
      return
    }

    setSelectedPositionId((prev) => {
      if (prev && myPositions.some((pos) => pos.tokenId === prev)) {
        return prev
      }
      return myPositions[0]?.tokenId ?? null
    })
  }, [myPositions])

  useEffect(() => {
    if (selectedPositionId !== null) {
      setRemovePercent(100)
    }
  }, [selectedPositionId])

  useEffect(() => {
    if (dependentAmountData?.status === 'below-range') {
      setIndependentField('token0')
    }
    if (dependentAmountData?.status === 'above-range') {
      setIndependentField('token1')
    }
  }, [dependentAmountData?.status])

  // Check if any amount is entered for button state (use effectiveTypedValue)
  const hasAmount =
    effectiveTypedValue !== '' &&
    effectiveTypedValue !== '0' &&
    Number.parseFloat(effectiveTypedValue) > 0
  const hasRemoveAmount = removePercent > 0
  const percentBigInt = BigInt(Math.round(removePercent))
  const estimatedToken0 =
    selectedPosition != null
      ? (selectedPosition.principalToken0 * percentBigInt) / 100n
      : 0n
  const estimatedToken1 =
    selectedPosition != null
      ? (selectedPosition.principalToken1 * percentBigInt) / 100n
      : 0n

  // Prevent adding liquidity when dependent amount calculation errors occur
  const isDependentAmountError = dependentAmountData?.status === 'error'

  const canAddLiquidity =
    hasAmount &&
    isTickRangeValid &&
    !isDependentAmountError &&
    !isLoadingTrustlines &&
    tokensNeedingTrustline.length === 0

  // Handle add liquidity (normal mode only - zap mode has its own handler)
  const handleAddLiquidity = async () => {
    if (!connectedAddress || !canAddLiquidity) return

    // Safety check: prevent adding liquidity when price is above/below range
    if (isDependentAmountError) {
      console.error('Cannot add liquidity: price is above/below range')
      return
    }

    const alignedLower = alignTick(tickLower, tickSpacing)
    const alignedUpper = alignTick(tickUpper, tickSpacing)

    if (!isTickAligned(alignedLower, tickSpacing)) {
      console.error(`Tick lower must be a multiple of ${tickSpacing}`)
      setTickLower(alignedLower)
      return
    }

    if (!isTickAligned(alignedUpper, tickSpacing)) {
      console.error(`Tick upper must be a multiple of ${tickSpacing}`)
      setTickUpper(alignedUpper)
      return
    }

    if (alignedLower >= alignedUpper) {
      console.error('Tick lower must be less than tick upper')
      return
    }

    setTickLower(alignedLower)
    setTickUpper(alignedUpper)

    addLiquidityMutation.mutate(
      {
        userAddress: connectedAddress,
        poolAddress: pool.address,
        token0Amount: amount0,
        token1Amount: amount1,
        token0Decimals: pool.token0.decimals,
        token1Decimals: pool.token1.decimals,
        tickLower: alignedLower,
        tickUpper: alignedUpper,
        recipient: connectedAddress,
        signTransaction,
        signAuthEntry,
      },
      {
        onSuccess: () => {
          // Reset form on success
          setTypedValue('')
        },
        onError: (error) => {
          console.error('Failed to add liquidity:', error)
          // The mutation will automatically reset its pending state
        },
      },
    )
  }

  // Handle remove liquidity
  const handleRemoveLiquidity = async () => {
    if (!connectedAddress || !selectedPosition || !hasRemoveAmount) {
      if (!selectedPosition) {
        console.error('No position selected for this pool')
      }
      return
    }

    try {
      const liquidityBigInt = BigInt(selectedPosition.liquidity || '0')

      const percentBigInt = BigInt(removePercent)
      const liquidityToRemove =
        removePercent >= 100
          ? liquidityBigInt
          : (liquidityBigInt * percentBigInt) / 100n

      await removeLiquidityMutation.mutateAsync({
        tokenId: selectedPosition.tokenId,
        liquidity: liquidityToRemove,
        amount0Min: 0n,
        amount1Min: 0n,
        token0: pool.token0,
        token1: pool.token1,
        poolAddress: pool.address,
      })

      // Reset form
      setRemovePercent(100)
    } catch (error) {
      console.error('Failed to remove liquidity:', error)
    }
  }

  return (
    <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
      <CardHeader>
        <div>
          <CardTitle>Manage</CardTitle>
          <CardDescription>Manage your position</CardDescription>
        </div>
      </CardHeader>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <CardContent>
          <TabsList className="!flex">
            <TabsTrigger value="add" className="flex flex-1">
              Add
            </TabsTrigger>
            <TabsTrigger value="remove" className="flex flex-1">
              Remove
            </TabsTrigger>
          </TabsList>
        </CardContent>

        <div className="px-6 pb-4">
          <Separator />
        </div>

        <TabsContent value="add">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Add Liquidity</CardTitle>
                <CardDescription>
                  {isZapModeEnabled
                    ? 'Deposit with any token of your choice. Zap mode will handle the swap and token ratio split.'
                    : `Enter ${pool.token0.code} amount - ${pool.token1.code} amount will be calculated automatically.`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Checker.Connect namespace="stellar" fullWidth size="lg">
                <>
                  {/* Zap Mode Toggle */}
                  <ToggleZapCard
                    checked={isZapModeEnabled}
                    onCheckedChange={(checked) => {
                      setIsZapModeEnabled(checked)
                      // Reset amounts when toggling zap mode
                      setTypedValue('')
                      setZapAmountIn('')
                      setZapTokenIn(null)
                    }}
                  />

                  {isZapModeEnabled ? (
                    // Zap Mode: Single token input
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Select Token
                          </span>
                        </div>
                        <TokenSelector
                          id="zap-token-selector"
                          selected={zapTokenIn ?? undefined}
                          onSelect={(token) => {
                            setZapTokenIn(token)
                            setZapAmountIn('')
                          }}
                        >
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {zapTokenIn ? (
                                <>
                                  <span>{zapTokenIn.code}</span>
                                </>
                              ) : (
                                <span>Select a token</span>
                              )}
                            </div>
                          </Button>
                        </TokenSelector>
                      </div>
                      {zapTokenIn && (
                        <div className="space-y-2">
                          <CurrencyInput
                            id="zap-amount-input"
                            type="INPUT"
                            className="p-3 bg-white border border-accent dark:bg-slate-800 rounded-xl"
                            token={zapTokenIn}
                            value={zapAmountIn}
                            onChange={setZapAmountIn}
                          />
                          <p className="text-xs text-muted-foreground">
                            {zapTokenIn.contract === pool.token0.contract ||
                            zapTokenIn.contract === pool.token1.contract
                              ? 'Zap will swap 50% to get the other pool token and add liquidity'
                              : 'Zap will swap to get both pool tokens (50/50) and add liquidity'}
                          </p>
                        </div>
                      )}
                      {/* Trustline warnings for pool tokens (needed for zap) */}
                      {tokensNeedingTrustline.length > 0 && (
                        <CreateTrustlineButton
                          size="lg"
                          className="w-full"
                          tokens={tokensNeedingTrustline}
                        />
                      )}
                      {tokensNeedingTrustline.length === 0 &&
                        !isLoadingTrustlines && (
                          <Button
                            className="w-full"
                            size="lg"
                            disabled={
                              true
                              // !zapTokenIn ||
                              // !zapAmountIn ||
                              // Number.parseFloat(zapAmountIn) <= 0 ||
                              // !isTickRangeValid ||
                              // isLoadingTrustlines ||
                              // tokensNeedingTrustline.length > 0 ||
                              // zapMutation.isPending ||
                              // (isPendingRouteToken0 &&
                              //   zapTokenIn.contract.toUpperCase() !==
                              //     pool.token0.contract.toUpperCase()) ||
                              // (isPendingRouteToken1 &&
                              //   zapTokenIn.contract.toUpperCase() !==
                              //     pool.token1.contract.toUpperCase())
                            }
                            onClick={async () => {
                              if (
                                !connectedAddress ||
                                !zapTokenIn ||
                                !zapAmountIn
                              )
                                return

                              const alignedLower = alignTick(
                                tickLower,
                                tickSpacing,
                              )
                              const alignedUpper = alignTick(
                                tickUpper,
                                tickSpacing,
                              )

                              if (!isTickAligned(alignedLower, tickSpacing)) {
                                console.error(
                                  `Tick lower must be a multiple of ${tickSpacing}`,
                                )
                                setTickLower(alignedLower)
                                return
                              }

                              if (!isTickAligned(alignedUpper, tickSpacing)) {
                                console.error(
                                  `Tick upper must be a multiple of ${tickSpacing}`,
                                )
                                setTickUpper(alignedUpper)
                                return
                              }

                              if (alignedLower >= alignedUpper) {
                                console.error(
                                  'Tick lower must be less than tick upper',
                                )
                                return
                              }

                              setTickLower(alignedLower)
                              setTickUpper(alignedUpper)

                              zapMutation.mutate(
                                {
                                  userAddress: connectedAddress,
                                  poolAddress: pool.address,
                                  tokenIn: zapTokenIn,
                                  amountIn: zapAmountIn,
                                  tokenInDecimals: zapTokenIn.decimals,
                                  token0: pool.token0,
                                  token1: pool.token1,
                                  tickLower: alignedLower,
                                  tickUpper: alignedUpper,
                                  signTransaction,
                                  signAuthEntry,
                                  routeToken0: routeToken0 ?? null,
                                  routeToken1: routeToken1 ?? null,
                                },
                                {
                                  onSuccess: () => {
                                    setZapAmountIn('')
                                  },
                                  onError: (error) => {
                                    console.error('Failed to zap:', error)
                                  },
                                },
                              )
                            }}
                          >
                            Under Maintence
                            {/* {zapMutation.isPending
                              ? 'Zapping & Adding Liquidity...'
                              : !isTickRangeValid
                                ? 'Adjust Tick Range'
                                : 'Zap & Add Liquidity'} */}
                          </Button>
                        )}
                    </>
                  ) : (
                    // Normal Mode: Two token input with dependent amount calculation
                    <>
                      {/* Token 0 Input */}
                      <div className="space-y-2">
                        <CurrencyInput
                          id="add-token0-liquidity-amount-input"
                          type={
                            independentField === 'token0' ? 'INPUT' : 'OUTPUT'
                          }
                          className="p-3 bg-white border border-accent dark:bg-slate-800 rounded-xl"
                          token={pool.token0}
                          value={amount0}
                          onChange={(value) => {
                            setIndependentField('token0')
                            setTypedValue(value)
                          }}
                        />
                      </div>

                      {/* Plus Icon */}
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <span className="text-lg font-bold">+</span>
                        </div>
                      </div>

                      {/* Token 1 Input (Auto-calculated) */}
                      <div className="space-y-2">
                        <CurrencyInput
                          id="add-token1-liquidity-amount-input"
                          type={
                            independentField === 'token1' ? 'INPUT' : 'OUTPUT'
                          }
                          className="p-3 bg-white border border-accent dark:bg-slate-800 rounded-xl"
                          token={pool.token1}
                          value={amount1}
                          onChange={(value) => {
                            setIndependentField('token1')
                            setTypedValue(value)
                          }}
                        />
                        {dependentAmountData?.error &&
                          ((dependentAmountData?.status === 'error' && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {dependentAmountData.error}
                            </p>
                          )) || (
                            <p className="text-xs text-muted-foreground">
                              {dependentAmountData.error}
                            </p>
                          ))}
                      </div>

                      <TickRangeSelector
                        params={tickRangeSelectorState}
                        token0={pool.token0}
                        token1={pool.token1}
                      />

                      <LiquidityDepthWidget
                        pool={pool}
                        tickRangeSelectorState={tickRangeSelectorState}
                      />

                      {/* Trustline check for pool tokens */}
                      {tokensNeedingTrustline.length > 0 ? (
                        <CreateTrustlineButton
                          size="lg"
                          className="w-full"
                          tokens={tokensNeedingTrustline}
                        />
                      ) : (
                        /* Submit Button */
                        <Button
                          className="w-full"
                          size="lg"
                          disabled={
                            true
                            // !canAddLiquidity ||
                            // addLiquidityMutation.isPending ||
                            // isLoadingTrustlines
                          }
                          onClick={handleAddLiquidity}
                        >
                          Under Maintence
                          {/* {addLiquidityMutation.isPending
                            ? 'Adding Liquidity...'
                            : isLoadingTrustlines
                              ? 'Checking trustlines...'
                              : isDependentAmountError
                                ? 'Price Range Error'
                                : !isTickRangeValid
                                  ? 'Adjust Tick Range'
                                  : canAddLiquidity
                                    ? 'Add Liquidity'
                                    : 'Enter Amount'} */}
                        </Button>
                      )}
                    </>
                  )}
                </>
              </Checker.Connect>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="remove">
          <CardContent>
            <div className="space-y-4">
              <Checker.Connect namespace="stellar" fullWidth size="lg">
                {myPositions.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <p className="text-muted-foreground">
                      No positions found for this pool.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Provide liquidity to create a position first.
                    </p>
                  </div>
                ) : (
                  // Show form when connected and has position
                  <>
                    <div className="space-y-3">
                      {myPositions.map((position) => {
                        const isSelected =
                          position.tokenId === selectedPositionId
                        const principal0 = formatUnits(
                          position.principalToken0,
                          token0Decimals,
                        )
                        const principal1 = formatUnits(
                          position.principalToken1,
                          token1Decimals,
                        )
                        const fees0 = formatUnits(
                          position.feesToken0,
                          token0Decimals,
                        )
                        const fees1 = formatUnits(
                          position.feesToken1,
                          token1Decimals,
                        )

                        return (
                          <button
                            key={position.tokenId}
                            type="button"
                            onClick={() =>
                              setSelectedPositionId(position.tokenId)
                            }
                            className={`w-full rounded-lg border p-4 text-left transition-colors ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/10'
                                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-800/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  Range #{position.tokenId}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Ticks {position.tickLower} →{' '}
                                  {position.tickUpper}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Price{' '}
                                  {formatPriceBound(
                                    position.tickLower,
                                    'lower',
                                  )}{' '}
                                  →{' '}
                                  {formatPriceBound(
                                    position.tickUpper,
                                    'upper',
                                  )}{' '}
                                  {pool.token1.code}/{pool.token0.code}
                                </div>
                              </div>
                              <div className="text-right text-xs text-muted-foreground space-y-2">
                                <div>
                                  Principal:{' '}
                                  <span className="text-slate-900 dark:text-slate-100">
                                    {principal0} {pool.token0.code}
                                  </span>
                                </div>
                                <div>
                                  Principal:{' '}
                                  <span className="text-slate-900 dark:text-slate-100">
                                    {principal1} {pool.token1.code}
                                  </span>
                                </div>
                                <div className="text-[11px]">
                                  Fees:{' '}
                                  <span className="text-slate-900 dark:text-slate-100">
                                    {fees0} {pool.token0.code}
                                  </span>{' '}
                                  /{' '}
                                  <span className="text-slate-900 dark:text-slate-100">
                                    {fees1} {pool.token1.code}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {selectedPosition ? (
                      <div className="space-y-4">
                        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              Remove percentage
                            </span>
                            <div className="flex flex-row gap-4 items-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                step={1}
                                value={removePercent}
                                onChange={(event) => {
                                  const value = Number.parseInt(
                                    event.target.value,
                                    10,
                                  )
                                  if (Number.isNaN(value)) {
                                    setRemovePercent(0)
                                    return
                                  }
                                  const clamped = Math.min(
                                    100,
                                    Math.max(0, Math.round(value)),
                                  )
                                  setRemovePercent(clamped)
                                }}
                                className="w-16 rounded-md border border-slate-300 bg-white px-2 py-1 text-right text-sm font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100"
                              />
                              <Button
                                disabled={removePercent === 100}
                                onClick={() => setRemovePercent(100)}
                                size="xs"
                                variant="ghost"
                                className="border border-slate-300"
                              >
                                Max
                              </Button>
                            </div>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={removePercent}
                            onChange={(event) => {
                              const value = Number(event.target.value)
                              if (Number.isNaN(value)) {
                                setRemovePercent(0)
                                return
                              }
                              const clamped = Math.min(
                                100,
                                Math.max(0, Math.round(value)),
                              )
                              setRemovePercent(clamped)
                            }}
                            className="w-full accent-blue-500"
                          />
                          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                            <div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {formatUnits(estimatedToken0, token0Decimals)}{' '}
                                {pool.token0.code}
                              </div>
                              <p>Est. {pool.token0.code} principal</p>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {formatUnits(estimatedToken1, token1Decimals)}{' '}
                                {pool.token1.code}
                              </div>
                              <p>Est. {pool.token1.code} principal</p>
                            </div>
                          </div>
                          <p className="text-[11px] leading-4 text-muted-foreground">
                            Final withdrawal amounts depend on current pool
                            price and may differ from principal estimates.
                          </p>
                        </div>

                        <Button
                          className="w-full"
                          size="lg"
                          disabled={
                            !hasRemoveAmount ||
                            removeLiquidityMutation.isPending ||
                            !selectedPosition
                          }
                          onClick={handleRemoveLiquidity}
                        >
                          {removeLiquidityMutation.isPending
                            ? 'Removing and Collecting Liquidity...'
                            : hasRemoveAmount
                              ? 'Remove Liquidity'
                              : 'Select Percentage'}
                        </Button>
                      </div>
                    ) : null}
                  </>
                )}
              </Checker.Connect>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="stake">
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Staking not available</p>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="unstake">
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Unstaking not available</p>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
