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
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { useStellarWallet } from '~stellar/providers'
import { ConnectWalletButton } from '../ConnectWallet/ConnectWalletButton'

interface ManageLiquidityCardProps {
  pool: PoolInfo
}

export const ManageLiquidityCard: React.FC<ManageLiquidityCardProps> = ({
  pool,
}) => {
  const [tab, setTab] = useState<string>('add')
  const [amount0, setAmount0] = useState<string>('')
  const [amount1, setAmount1] = useState<string>('')
  const { isConnected } = useStellarWallet()

  // Check if any amount is entered for button state
  const hasAmount =
    amount0 !== '' && amount0 !== '0' && Number.parseFloat(amount0) > 0

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
            <TabsTrigger disabled value="stake" className="flex flex-1">
              Stake
            </TabsTrigger>
            <TabsTrigger disabled value="unstake" className="flex flex-1">
              Unstake
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
                  Provide liquidity to receive SLP tokens.
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
                        0.00
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 p-3 border rounded-lg">
                        <input
                          type="number"
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

                  {/* Token 1 Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {pool.token1.code}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        0.00
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 p-3 border rounded-lg">
                        <input
                          type="number"
                          value={amount1}
                          onChange={(e) => setAmount1(e.target.value)}
                          placeholder="0.0"
                          className="w-full text-lg font-semibold bg-transparent border-none outline-none"
                        />
                        <div className="text-sm text-muted-foreground">
                          $ 0.00
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button className="w-full" size="lg" disabled={!hasAmount}>
                    {hasAmount ? 'Add Liquidity' : 'Enter Amount'}
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
                        0.00
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 p-3 border rounded-lg">
                        <input
                          type="number"
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

                  {/* Remove Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    variant="destructive"
                    disabled={!hasAmount}
                  >
                    {hasAmount ? 'Remove Liquidity' : 'Enter Amount'}
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
