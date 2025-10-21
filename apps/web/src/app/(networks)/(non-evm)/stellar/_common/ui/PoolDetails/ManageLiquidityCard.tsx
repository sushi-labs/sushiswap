'use client'

import { Cog6ToothIcon } from '@heroicons/react/20/solid'
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
import { useState } from 'react'
import { useCalculatePairedAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-paired-amount'
import { usePoolBalances } from '~stellar/_common/lib/hooks/pool/use-pool-balances'
import { useRemoveLiquidity } from '~stellar/_common/lib/hooks/pool/use-pool-liquidity-management'
import { useAddLiquidity } from '~stellar/_common/lib/hooks/swap'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { useStellarWallet } from '~stellar/providers'
import { ConnectWalletButton } from '../ConnectWallet/ConnectWalletButton'

interface ManageLiquidityCardProps {
  pool: PoolInfo
}

export const ManageLiquidityCard: React.FC<ManageLiquidityCardProps> = ({
  pool,
}) => {
  const { isConnected, connectedAddress, signTransaction } = useStellarWallet()
  const { data: balances } = usePoolBalances(pool.address, connectedAddress)
  const [tab, setTab] = useState<string>('add')
  const [amount0, setAmount0] = useState<string>('')
  const [lpAmount, setLpAmount] = useState<string>('')

  // Calculate paired amount based on token0 input
  const { data: pairedAmountData } = useCalculatePairedAmount(
    pool.address,
    amount0,
    -60000, // Default full range
    60000,
    pool.token0.decimals || 7,
  )

  const amount1 = pairedAmountData?.token1Amount
    ? Number.parseFloat(pairedAmountData.token1Amount).toFixed(4)
    : '0'

  // Liquidity management hooks
  const addLiquidityMutation = useAddLiquidity()
  const removeLiquidityMutation = useRemoveLiquidity()

  // Check if any amount is entered for button state
  const hasAmount =
    amount0 !== '' && amount0 !== '0' && Number.parseFloat(amount0) > 0
  const hasLpAmount =
    lpAmount !== '' && lpAmount !== '0' && Number.parseFloat(lpAmount) > 0

  // Prevent adding liquidity when price is above range (can't provide token0)
  const isAboveRange = pairedAmountData?.status === 'above-range'
  const canAddLiquidity = hasAmount && !isAboveRange

  // Handle add liquidity
  const handleAddLiquidity = async () => {
    if (!connectedAddress || !canAddLiquidity) return

    // Safety check: prevent adding liquidity when price is above range
    if (isAboveRange) {
      console.error('Cannot add liquidity: price is above range')
      return
    }

    try {
      await addLiquidityMutation.mutateAsync({
        userAddress: connectedAddress,
        poolAddress: pool.address,
        token0Amount: amount0,
        token1Amount: amount1, // Auto-calculated amount
        tickLower: -60000,
        tickUpper: 60000,
        recipient: connectedAddress,
        signTransaction,
      })

      // Reset form
      setAmount0('')
    } catch (error) {
      console.error('Failed to add liquidity:', error)
    }
  }

  // Handle remove liquidity
  const handleRemoveLiquidity = async () => {
    if (!connectedAddress || !hasLpAmount) return

    try {
      const lpAmountBigInt = BigInt(
        Math.floor(Number.parseFloat(lpAmount) * 10 ** 7),
      ) // Assuming 7 decimals for LP tokens

      await removeLiquidityMutation.mutateAsync({
        address: pool.address,
        liquidity: lpAmountBigInt,
        amount0Min: 0n,
        amount1Min: 0n,
        recipient: connectedAddress,
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
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Manage</CardTitle>
            <CardDescription>Manage your position</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <Cog6ToothIcon className="w-4 h-4" />
          </Button>
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
              <Button variant="ghost" size="sm">
                <Cog6ToothIcon className="w-4 h-4" />
              </Button>
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
                          onChange={(e) => setAmount0(e.target.value)}
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
                    {pairedAmountData?.status === 'below-range' && amount0 && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Price below range - only {pool.token0.code} needed
                      </p>
                    )}
                    {isAboveRange && amount0 && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Price above range - cannot provide {pool.token0.code}{' '}
                        liquidity
                      </p>
                    )}
                    {pairedAmountData?.error && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {pairedAmountData.error}
                      </p>
                    )}
                  </div>

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
              ) : (
                // Show form when connected
                <>
                  {/* LP Token Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">LP Tokens</span>
                      <span className="text-xs text-muted-foreground">
                        {balances?.token0.formatted}
                      </span>
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
                    disabled={!hasLpAmount || removeLiquidityMutation.isPending}
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
