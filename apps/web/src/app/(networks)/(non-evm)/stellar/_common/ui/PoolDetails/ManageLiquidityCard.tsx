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
import { useMemo, useState } from 'react'
import { useCalculatePairedAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-paired-amount'
import { useMaxPairedAmount } from '~stellar/_common/lib/hooks/pool/use-max-paired-amount'
import { usePoolBalances } from '~stellar/_common/lib/hooks/pool/use-pool-balances'
import { useRemoveLiquidity } from '~stellar/_common/lib/hooks/pool/use-pool-liquidity-management'
import { usePoolPrice } from '~stellar/_common/lib/hooks/pool/use-pool-price'
import { useMyPosition } from '~stellar/_common/lib/hooks/position/use-my-position'
import { useAddLiquidity } from '~stellar/_common/lib/hooks/swap'
import { useTickRangeSelector } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { formatTokenAmount } from '~stellar/_common/lib/utils/format'
import { alignTick, isTickAligned } from '~stellar/_common/lib/utils/ticks'
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
  const [tab, setTab] = useState<string>('add')
  const [amount0, setAmount0] = useState<string>('')
  const [lpAmount, setLpAmount] = useState<string>('')

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
    pool.token0.decimals || 7,
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

  // Find user's position for this pool (using full range -60000 to 60000)
  const userPosition = useMemo(() => {
    // myPositions are already filtered by the current pool address
    // pick the default full-range position if present
    return (
      myPositions.find((pos) => {
        const ticksMatch =
          pos.principalToken0 !== undefined && pos.principalToken1 !== undefined
        // Prefer the conventional full range if present
        // We don't have explicit ticks in PositionSummary, so fall back to first
        return ticksMatch
      }) || myPositions[0]
    )
  }, [myPositions])

  // Check if any amount is entered for button state
  const hasAmount =
    amount0 !== '' && amount0 !== '0' && Number.parseFloat(amount0) > 0
  const hasLpAmount =
    lpAmount !== '' && lpAmount !== '0' && Number.parseFloat(lpAmount) > 0

  // Prevent adding liquidity when price is above range (can't provide token0)
  const isAboveRange = pairedAmountData?.status === 'above-range'
  const canAddLiquidity = hasAmount && !isAboveRange && isTickRangeValid

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
    if (!connectedAddress || !hasLpAmount || !userPosition) {
      if (!userPosition) {
        console.error('No position found for this pool')
      }
      return
    }

    try {
      const lpAmountBigInt = BigInt(
        Math.floor(Number.parseFloat(lpAmount) * 10 ** 7),
      )

      await removeLiquidityMutation.mutateAsync({
        tokenId: userPosition.tokenId,
        liquidity: lpAmountBigInt,
        amount0Min: 0n,
        amount1Min: 0n,
      })

      // Reset form
      setLpAmount('')
    } catch (error) {
      console.error('Failed to remove liquidity:', error)
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
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
                      <div className="flex-1 p-3 border rounded-lg">
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
                        <div className="text-sm text-muted-foreground">
                          $ 0.00
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
                      <div className="flex-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                        <input
                          type="text"
                          value={amount1}
                          placeholder="Auto-calculated"
                          readOnly
                          disabled
                          className="w-full text-lg font-semibold bg-transparent border-none outline-none text-muted-foreground"
                        />
                        <div className="text-sm text-muted-foreground">
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
              ) : !userPosition ? (
                // Show message when no position exists
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No position found for this pool.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add liquidity first to create a position.
                  </p>
                </div>
              ) : (
                // Show form when connected and has position
                <>
                  {/* LP Token Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Liquidity Amount
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const liq = BigInt(userPosition.liquidity || '0')
                          setLpAmount((Number(liq) / 1e7).toString())
                        }}
                        className="text-xs text-blue-500 hover:text-blue-400"
                      >
                        Max
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 p-3 border rounded-lg">
                        <input
                          type="number"
                          value={lpAmount}
                          onChange={(e) => setLpAmount(e.target.value)}
                          placeholder="0.0"
                          className="w-full text-lg font-semibold bg-transparent border-none outline-none"
                        />
                        <div className="text-sm text-muted-foreground">
                          $ 0.00
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    variant="destructive"
                    disabled={
                      !hasLpAmount ||
                      !userPosition ||
                      removeLiquidityMutation.isPending
                    }
                    onClick={handleRemoveLiquidity}
                  >
                    {removeLiquidityMutation.isPending
                      ? 'Removing Liquidity...'
                      : hasLpAmount
                        ? 'Remove Liquidity'
                        : 'Enter Amount'}
                  </Button>
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
