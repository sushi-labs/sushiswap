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
import { useCalculatePairedAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-paired-amount'
import { useMaxPairedAmount } from '~stellar/_common/lib/hooks/pool/use-max-paired-amount'
import { usePoolBalances } from '~stellar/_common/lib/hooks/pool/use-pool-balances'
import { useRemoveLiquidity } from '~stellar/_common/lib/hooks/pool/use-pool-liquidity-management'
import { usePoolPrice } from '~stellar/_common/lib/hooks/pool/use-pool-price'
import { useMyPosition } from '~stellar/_common/lib/hooks/position/use-my-position'
import { useAddLiquidity } from '~stellar/_common/lib/hooks/swap'
import { useTickRangeSelector } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import { calculatePriceFromTick } from '~stellar/_common/lib/soroban/pool-helpers'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { formatTokenAmount } from '~stellar/_common/lib/utils/format'
import {
  MAX_TICK_RANGE,
  alignTick,
  isTickAligned,
} from '~stellar/_common/lib/utils/ticks'
import { useStellarWallet } from '~stellar/providers'
import { ConnectWalletButton } from '../ConnectWallet/ConnectWalletButton'
import { TickRangeSelector } from '../TickRangeSelector/TickRangeSelector.tsx'

interface ManageLiquidityCardProps {
  pool: PoolInfo
}

export const ManageLiquidityCard: React.FC<ManageLiquidityCardProps> = ({
  pool,
}) => {
  const { isConnected, connectedAddress, signTransaction } = useStellarWallet()
  const { data: balances } = usePoolBalances(pool.address, connectedAddress)
  const { positions: myPositions } = useMyPosition(
    connectedAddress || undefined,
    pool.address,
  )
  const token0Decimals = pool.token0.decimals
  const token1Decimals = pool.token1.decimals
  const [tab, setTab] = useState<string>('add')
  const [amount0, setAmount0] = useState<string>('')
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(
    null,
  )
  const [removePercent, setRemovePercent] = useState<number>(100)

  const { data: currentPrice } = usePoolPrice(pool.address)
  const tickRangeSelectorState = useTickRangeSelector(
    pool.fee,
    currentPrice ?? 1,
  )

  const {
    tickLower,
    tickUpper,
    setTickLower,
    setTickUpper,
    isTickRangeValid,
    tickSpacing,
  } = tickRangeSelectorState

  // Calculate paired amount based on token0 input
  const { data: pairedAmountData } = useCalculatePairedAmount(
    pool.address,
    amount0,
    tickLower,
    tickUpper,
    pool.token0.decimals,
    pool.token0.code,
  )
  const { data: maxPairedAmountData } = useMaxPairedAmount(
    pool.address,
    balances?.token0.amount || '0',
    balances?.token1.amount || '0',
    tickLower,
    tickUpper,
    pool.token0.decimals,
    pool.token1.decimals,
  )

  const amount1 = pairedAmountData?.token1Amount ?? '0'

  // Liquidity management hooks
  const addLiquidityMutation = useAddLiquidity()
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

  // Check if any amount is entered for button state
  const hasAmount =
    amount0 !== '' && amount0 !== '0' && Number.parseFloat(amount0) > 0
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

  // Prevent adding liquidity when price is above range (can't provide token0)
  const isAboveRange = pairedAmountData?.status === 'above-range'
  const canAddLiquidity = hasAmount && !isAboveRange && isTickRangeValid
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

  // Handle add liquidity
  const handleAddLiquidity = async () => {
    if (!connectedAddress || !canAddLiquidity) return

    // Safety check: prevent adding liquidity when price is above range
    if (isAboveRange) {
      console.error('Cannot add liquidity: price is above range')
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
        token1Amount: amount1, // Auto-calculated amount
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
          setAmount0('')
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
                  Enter {pool.token0.code} amount - {pool.token1.code} amount
                  will be calculated automatically.
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
                            if (!maxPairedAmountData) {
                              return
                            }
                            if (e.target.value === '') {
                              setAmount0('')
                              return
                            }
                            const rawAmountValue = BigInt(
                              Math.floor(
                                Number.parseFloat(e.target.value) *
                                  10 ** pool.token0.decimals,
                              ),
                            )
                            if (
                              rawAmountValue >=
                              BigInt(maxPairedAmountData.maxToken0Amount)
                            ) {
                              setAmount0(
                                formatTokenAmount(
                                  BigInt(maxPairedAmountData.maxToken0Amount),
                                  pool.token0.decimals,
                                ),
                              )
                            } else {
                              setAmount0(e.target.value)
                            }
                          }}
                          placeholder="0.0"
                          className="w-full text-lg font-semibold bg-transparent border-none outline-none"
                        />
                        <div className="flex flex-row justify-between mt-1">
                          <div className="text-sm text-muted-foreground">
                            $ 0.00
                          </div>
                          <Button
                            variant={
                              maxPairedAmountData &&
                              formatTokenAmount(
                                BigInt(maxPairedAmountData.maxToken0Amount),
                                pool.token0.decimals,
                              ) === amount0
                                ? 'secondary'
                                : 'ghost'
                            }
                            size="xs"
                            className="border-slate-200 dark:border-slate-800 border"
                            disabled={!maxPairedAmountData}
                            onClick={() => {
                              if (!maxPairedAmountData) {
                                return
                              }
                              setAmount0(
                                formatTokenAmount(
                                  BigInt(maxPairedAmountData.maxToken0Amount),
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
                      <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-gray-900/50">
                        <input
                          type="text"
                          value={amount1}
                          placeholder="Auto-calculated"
                          readOnly
                          disabled
                          className="w-full text-lg font-semibold bg-transparent border-none outline-none text-muted-foreground"
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                          $ 0.00
                        </div>
                      </div>
                    </div>
                    {pairedAmountData?.error && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {pairedAmountData.error}
                      </p>
                    )}
                  </div>

                  <TickRangeSelector
                    params={tickRangeSelectorState}
                    token0={pool.token0}
                    token1={pool.token1}
                  />

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
                      : isAboveRange
                        ? 'Price Above Range'
                        : !isTickRangeValid
                          ? 'Adjust Tick Range'
                          : canAddLiquidity
                            ? 'Add Liquidity'
                            : 'Enter Amount'}
                  </Button>
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
