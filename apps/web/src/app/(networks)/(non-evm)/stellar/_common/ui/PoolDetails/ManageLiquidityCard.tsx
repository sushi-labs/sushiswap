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
import { ToggleZapCard } from 'src/ui/pool/ToggleZapCard'
import { useCalculateDependentAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-dependent-amount'
import { useMaxPairedAmount } from '~stellar/_common/lib/hooks/pool/use-max-paired-amount'
import { usePoolBalances } from '~stellar/_common/lib/hooks/pool/use-pool-balances'
import { useRemoveLiquidity } from '~stellar/_common/lib/hooks/pool/use-pool-liquidity-management'
import { usePoolPrice } from '~stellar/_common/lib/hooks/pool/use-pool-price'
import { useMyPosition } from '~stellar/_common/lib/hooks/position/use-my-position'
import { useAddLiquidity } from '~stellar/_common/lib/hooks/swap'
import { useTickRangeSelector } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import { useTokenBalanceFromToken } from '~stellar/_common/lib/hooks/token/use-token-balance'
import { useNeedsTrustline } from '~stellar/_common/lib/hooks/trustline/use-trustline'
import { useZap } from '~stellar/_common/lib/hooks/zap/use-zap'
import { calculatePriceFromTick } from '~stellar/_common/lib/soroban/pool-helpers'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { formatTokenAmount } from '~stellar/_common/lib/utils/format'
import {
  MAX_TICK_RANGE,
  alignTick,
  isTickAligned,
} from '~stellar/_common/lib/utils/ticks'
import { useStellarWallet } from '~stellar/providers'
import { ConnectWalletButton } from '../ConnectWallet/ConnectWalletButton'
import { TickRangeSelector } from '../TickRangeSelector/TickRangeSelector.tsx'
import { TrustlineWarning } from '../Trustline/TrustlineWarning'
import TokenSelector from '../token-selector/token-selector'

interface ManageLiquidityCardProps {
  pool: PoolInfo
}

// Component to display balance for zap token
const ZapTokenBalance = ({
  token,
  address,
}: {
  token: Token
  address: string | null
}) => {
  const { data: balance } = useTokenBalanceFromToken(address, token)
  if (!balance) return <span className="text-xs text-muted-foreground">-</span>
  return (
    <span className="text-xs text-muted-foreground">
      {formatTokenAmount(balance, token.decimals)}
    </span>
  )
}

// Component for Max button that handles both pool tokens and external tokens
const ZapMaxButton = ({
  token,
  pool,
  balances,
  address,
  onSetAmount,
}: {
  token: Token
  pool: PoolInfo
  balances:
    | { token0: { amount: string }; token1: { amount: string } }
    | null
    | undefined
  address: string | null
  onSetAmount: (amount: string) => void
}) => {
  const { data: balance } = useTokenBalanceFromToken(address, token)

  const handleMax = () => {
    if (!token) return

    // Check if it's a pool token first (faster)
    if (token.contract === pool.token0.contract && balances?.token0.amount) {
      onSetAmount(
        formatTokenAmount(BigInt(balances.token0.amount), token.decimals),
      )
    } else if (
      token.contract === pool.token1.contract &&
      balances?.token1.amount
    ) {
      onSetAmount(
        formatTokenAmount(BigInt(balances.token1.amount), token.decimals),
      )
    } else if (balance) {
      // External token - use balance from hook
      onSetAmount(formatTokenAmount(balance, token.decimals))
    }
  }

  return (
    <Button
      variant="ghost"
      size="xs"
      className="border-slate-200 dark:border-slate-800 border"
      onClick={handleMax}
    >
      Max
    </Button>
  )
}

export const ManageLiquidityCard: React.FC<ManageLiquidityCardProps> = ({
  pool,
}) => {
  const { isConnected, connectedAddress, signTransaction } = useStellarWallet()
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

  const { data: currentPrice } = usePoolPrice(pool.address)
  const tickRangeSelectorState = useTickRangeSelector(
    pool.fee,
    currentPrice ?? 1,
  )

  // Check trustlines for pool tokens (needed for both add liquidity and zap)
  const { needsTrustline: needsToken0Trustline } = useNeedsTrustline(
    pool.token0.code,
    pool.token0.issuer || '',
  )
  const { needsTrustline: needsToken1Trustline } = useNeedsTrustline(
    pool.token1.code,
    pool.token1.issuer || '',
  )
  const needsAnyPoolTokenTrustline =
    needsToken0Trustline || needsToken1Trustline

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
      const maxToken0FromBalance = formatTokenAmount(
        BigInt(maxPairedAmountData.maxToken0Amount),
        pool.token0.decimals,
      )
      return maxToken0FromBalance
    } else {
      // User is entering token1, dependent is token0
      const maxToken1FromBalance = formatTokenAmount(
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
  const zapMutation = useZap()
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
    !needsAnyPoolTokenTrustline

  const formatPriceBound = (tick: number, bound: 'lower' | 'upper') => {
    if (bound === 'lower' && tick <= MAX_TICK_RANGE.lower) {
      return '0'
    }
    if (bound === 'upper' && tick >= MAX_TICK_RANGE.upper) {
      return '∞'
    }

    const price = calculatePriceFromTick(tick)

    if (!Number.isFinite(price) || price <= 0) {
      return bound === 'lower' ? '0' : '∞'
    }

    if (price >= 1_000_000) {
      return price.toExponential(2)
    }

    if (price <= 0.0001) {
      return '<0.0001'
    }

    return price.toLocaleString(undefined, { maximumSignificantDigits: 6 })
  }

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
      if (liquidityBigInt === 0n) {
        console.error('Selected position has no liquidity')
        return
      }

      const percentBigInt = BigInt(removePercent)
      const liquidityToRemove =
        removePercent >= 100
          ? liquidityBigInt
          : (liquidityBigInt * percentBigInt) / 100n

      if (liquidityToRemove <= 0n) {
        console.error('Removal amount must be greater than zero')
        return
      }

      await removeLiquidityMutation.mutateAsync({
        tokenId: selectedPosition.tokenId,
        liquidity: liquidityToRemove,
        amount0Min: 0n,
        amount1Min: 0n,
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
              {!isConnected ? (
                // Show Connect Wallet when not connected
                <ConnectWalletButton className="w-full" size="lg" />
              ) : (
                // Show form when connected
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
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {zapTokenIn.code}
                            </span>
                            <ZapTokenBalance
                              token={zapTokenIn}
                              address={connectedAddress}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/40">
                              <input
                                type="number"
                                onWheel={(e) => e.currentTarget.blur()}
                                value={zapAmountIn}
                                onChange={(e) => setZapAmountIn(e.target.value)}
                                placeholder="0.0"
                                className="w-full text-lg font-semibold bg-transparent border-none outline-none"
                              />
                              <div className="flex flex-row justify-between mt-1">
                                <div className="text-sm text-muted-foreground">
                                  $ 0.00
                                </div>
                                <ZapMaxButton
                                  token={zapTokenIn}
                                  pool={pool}
                                  balances={balances}
                                  address={connectedAddress}
                                  onSetAmount={setZapAmountIn}
                                />
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {zapTokenIn.contract === pool.token0.contract ||
                            zapTokenIn.contract === pool.token1.contract
                              ? 'Zap will swap 50% to get the other pool token and add liquidity'
                              : 'Zap will swap to get both pool tokens (50/50) and add liquidity'}
                          </p>
                        </div>
                      )}
                      {/* Trustline warnings for pool tokens (needed for zap) */}
                      {needsToken0Trustline && pool.token0.issuer && (
                        <TrustlineWarning
                          assetCode={pool.token0.code}
                          assetIssuer={pool.token0.issuer}
                          direction="output"
                        />
                      )}
                      {needsToken1Trustline && pool.token1.issuer && (
                        <TrustlineWarning
                          assetCode={pool.token1.code}
                          assetIssuer={pool.token1.issuer}
                          direction="output"
                          className={needsToken0Trustline ? 'mt-2' : ''}
                        />
                      )}
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={
                          !zapTokenIn ||
                          !zapAmountIn ||
                          Number.parseFloat(zapAmountIn) <= 0 ||
                          !isTickRangeValid ||
                          needsAnyPoolTokenTrustline ||
                          zapMutation.isPending
                        }
                        onClick={async () => {
                          if (!connectedAddress || !zapAmountIn) return

                          const alignedLower = alignTick(tickLower, tickSpacing)
                          const alignedUpper = alignTick(tickUpper, tickSpacing)

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

                          if (!zapTokenIn) return

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
                        {zapMutation.isPending
                          ? 'Zapping & Adding Liquidity...'
                          : needsAnyPoolTokenTrustline
                            ? 'Create trustline first'
                            : !isTickRangeValid
                              ? 'Adjust Tick Range'
                              : 'Zap & Add Liquidity'}
                      </Button>
                    </>
                  ) : (
                    // Normal Mode: Two token input with dependent amount calculation
                    <>
                      {/* Token 0 Input */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {pool.token0.code}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {balances?.token0.formatted}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/40">
                            <input
                              type="number"
                              onWheel={(e) => e.currentTarget.blur()}
                              value={amount0}
                              onChange={(e) => {
                                setIndependentField('token0')
                                setTypedValue(e.target.value)
                              }}
                              placeholder="0.0"
                              className="w-full text-lg font-semibold bg-transparent border-none outline-none"
                            />
                            <div className="flex flex-row justify-between mt-1">
                              <div className="text-sm text-muted-foreground">
                                $ 0.00
                              </div>
                              <Button
                                variant="secondary"
                                size="xs"
                                className="border-slate-200 dark:border-slate-800 border"
                                disabled={
                                  !maxPairedAmountData ||
                                  amount0 ===
                                    formatTokenAmount(
                                      BigInt(
                                        maxPairedAmountData.maxToken0Amount,
                                      ),
                                      pool.token0.decimals,
                                    )
                                }
                                onClick={() => {
                                  if (!maxPairedAmountData) {
                                    return
                                  }
                                  setIndependentField('token0')
                                  setTypedValue(
                                    formatTokenAmount(
                                      BigInt(
                                        maxPairedAmountData.maxToken0Amount,
                                      ),
                                      pool.token0.decimals,
                                    ),
                                  )
                                }}
                              >
                                Max
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Plus Icon */}
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <span className="text-lg font-bold">+</span>
                        </div>
                      </div>

                      {/* Token 1 Input (Auto-calculated) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {pool.token1.code}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {balances?.token1.formatted}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/40">
                            <input
                              type="number"
                              onWheel={(e) => e.currentTarget.blur()}
                              value={amount1}
                              onChange={(e) => {
                                setIndependentField('token1')
                                setTypedValue(e.target.value)
                              }}
                              placeholder="0.0"
                              className="w-full text-lg font-semibold bg-transparent border-none outline-none"
                            />
                            <div className="flex flex-row justify-between mt-1">
                              <div className="text-sm text-muted-foreground">
                                $ 0.00
                              </div>
                              <Button
                                variant="secondary"
                                size="xs"
                                className="border-slate-200 dark:border-slate-800 border"
                                disabled={
                                  !maxPairedAmountData ||
                                  amount1 ===
                                    formatTokenAmount(
                                      BigInt(
                                        maxPairedAmountData.maxToken1Amount,
                                      ),
                                      pool.token1.decimals,
                                    )
                                }
                                onClick={() => {
                                  if (!maxPairedAmountData) {
                                    return
                                  }
                                  setIndependentField('token1')
                                  setTypedValue(
                                    formatTokenAmount(
                                      BigInt(
                                        maxPairedAmountData.maxToken1Amount,
                                      ),
                                      pool.token1.decimals,
                                    ),
                                  )
                                }}
                              >
                                Max
                              </Button>
                            </div>
                          </div>
                        </div>
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

                      {/* Trustline warnings for pool tokens */}
                      {needsToken0Trustline && pool.token0.issuer && (
                        <TrustlineWarning
                          assetCode={pool.token0.code}
                          assetIssuer={pool.token0.issuer}
                          direction="output"
                        />
                      )}
                      {needsToken1Trustline && pool.token1.issuer && (
                        <TrustlineWarning
                          assetCode={pool.token1.code}
                          assetIssuer={pool.token1.issuer}
                          direction="output"
                          className={needsToken0Trustline ? 'mt-2' : ''}
                        />
                      )}

                      {/* Submit Button */}
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={
                          !canAddLiquidity || addLiquidityMutation.isPending
                        }
                        onClick={handleAddLiquidity}
                      >
                        {addLiquidityMutation.isPending
                          ? 'Adding Liquidity...'
                          : needsAnyPoolTokenTrustline
                            ? 'Create trustline first'
                            : isDependentAmountError
                              ? 'Price Range Error'
                              : !isTickRangeValid
                                ? 'Adjust Tick Range'
                                : canAddLiquidity
                                  ? 'Add Liquidity'
                                  : 'Enter Amount'}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="remove">
          <CardContent>
            <div className="space-y-4">
              {!isConnected ? (
                // Show Connect Wallet when not connected
                <ConnectWalletButton className="w-full" size="lg" />
              ) : myPositions.length === 0 ? (
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
                      const isSelected = position.tokenId === selectedPositionId
                      const principal0 = formatTokenAmount(
                        position.principalToken0,
                        token0Decimals,
                      )
                      const principal1 = formatTokenAmount(
                        position.principalToken1,
                        token1Decimals,
                      )
                      const fees0 = formatTokenAmount(
                        position.feesToken0,
                        token0Decimals,
                      )
                      const fees1 = formatTokenAmount(
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
                                {formatPriceBound(position.tickLower, 'lower')}{' '}
                                →{' '}
                                {formatPriceBound(position.tickUpper, 'upper')}{' '}
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
                              {formatTokenAmount(
                                estimatedToken0,
                                token0Decimals,
                              )}{' '}
                              {pool.token0.code}
                            </div>
                            <p>Est. token0 principal</p>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {formatTokenAmount(
                                estimatedToken1,
                                token1Decimals,
                              )}{' '}
                              {pool.token1.code}
                            </div>
                            <p>Est. token1 principal</p>
                          </div>
                        </div>
                        <p className="text-[11px] leading-4 text-muted-foreground">
                          Final withdrawal amounts depend on current pool price
                          and may differ from principal estimates.
                        </p>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        variant="destructive"
                        disabled={
                          !hasRemoveAmount ||
                          removeLiquidityMutation.isPending ||
                          !selectedPosition
                        }
                        onClick={handleRemoveLiquidity}
                      >
                        {removeLiquidityMutation.isPending
                          ? 'Removing Liquidity...'
                          : hasRemoveAmount
                            ? 'Remove Liquidity'
                            : 'Select Percentage'}
                      </Button>
                    </div>
                  ) : null}
                </>
              )}
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
