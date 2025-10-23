'use client'

import { Button } from '@sushiswap/ui'
import React, { useMemo } from 'react'
import {
  useExecuteMultiHopSwap,
  useExecuteSwap,
} from '~stellar/_common/lib/hooks/swap'
import { findBestPath } from '~stellar/_common/lib/soroban/dex-router-helpers'
import { ConnectWalletButton } from '~stellar/_common/ui/ConnectWallet/ConnectWalletButton'
import { Checker } from '~stellar/_common/ui/checker'
import { useStellarWallet } from '~stellar/providers'
import { useSimpleSwapState } from './simple-swap-provider/simple-swap-provider'

export const SimpleSwapExecuteButton = () => {
  const { connectedAddress, isConnected } = useStellarWallet()
  const { amount, token0, token1, outputAmount, slippageAmount } =
    useSimpleSwapState()
  const executeSwap = useExecuteSwap()
  const executeMultiHopSwap = useExecuteMultiHopSwap()

  // Calculate amount out minimum with slippage
  const amountOutMinimum = useMemo(() => {
    if (!outputAmount) return 0n
    // Use the configured slippage amount from state
    // slippageAmount is in percentage, convert to basis points
    const slippageBps = slippageAmount ? Math.floor(slippageAmount * 100) : 50 // Default 0.5%
    const minAmount = (outputAmount * BigInt(10000 - slippageBps)) / 10000n
    return minAmount
  }, [outputAmount, slippageAmount])

  const handleSwap = async () => {
    if (
      !connectedAddress ||
      !token0 ||
      !token1 ||
      !amount ||
      Number(amount) <= 0
    ) {
      return
    }

    try {
      // Parse decimal string to bigint without precision loss
      const toScaledBigInt = (value: string, decimals: number): bigint => {
        const [integer = '0', fraction = ''] = value.split('.')
        const normalizedFraction = fraction
          .padEnd(decimals, '0')
          .slice(0, decimals)
        const digits =
          `${integer}${normalizedFraction}`.replace(/^0+(?=\d)/, '') || '0'
        return BigInt(digits)
      }

      const amountIn = toScaledBigInt(amount, token0.decimals)

      // Find the best route (direct or multi-hop)
      console.log(`🔍 Finding route: ${token0.code} → ${token1.code}`)
      const route = await findBestPath(token0, token1)

      if (!route) {
        throw new Error('No route found between tokens')
      }

      console.log(`✅ Route found: ${route.type}`, route)

      if (route.type === 'direct') {
        // Single-hop swap
        const pool = route.pools[0]
        await executeSwap.mutateAsync({
          userAddress: connectedAddress,
          tokenIn: token0,
          tokenOut: token1,
          amountIn,
          amountOutMinimum,
          recipient: connectedAddress,
          fee: pool.fee,
          deadline: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        })
      } else {
        // Multi-hop swap
        const path = route.path.map((token) => token.contract)
        const fees = route.fees

        console.log(
          `🔄 Executing multi-hop swap: ${route.path.map((t) => t.code).join(' → ')}`,
        )
        console.log(`Path: ${path.join(' → ')}`)
        console.log(`Fees: ${fees.join(', ')}`)

        await executeMultiHopSwap.mutateAsync({
          userAddress: connectedAddress,
          path,
          fees,
          amountIn,
          amountOutMinimum,
          recipient: connectedAddress,
          deadline: Math.floor(Date.now() / 1000) + 600, // 10 minutes
          tokenIn: token0,
          tokenOut: token1,
        })
      }
    } catch (error) {
      console.error('Swap failed:', error)
    }
  }

  const checkerAmount = useMemo(() => {
    if (!token0 || !amount) return []

    // Parse decimal string to bigint without precision loss
    const toScaledBigInt = (value: string, decimals: number): bigint => {
      const [integer = '0', fraction = ''] = value.split('.')
      const normalizedFraction = fraction
        .padEnd(decimals, '0')
        .slice(0, decimals)
      const digits =
        `${integer}${normalizedFraction}`.replace(/^0+(?=\d)/, '') || '0'
      return BigInt(digits)
    }

    return [
      {
        token: token0,
        amount: Number(toScaledBigInt(amount, token0.decimals)),
      },
    ]
  }, [amount, token0])

  const isDisabled =
    !connectedAddress ||
    !token0 ||
    !token1 ||
    !amount ||
    Number(amount) <= 0 ||
    executeSwap.isPending ||
    executeMultiHopSwap.isPending

  return (
    <div className="pt-4">
      {!isConnected ? (
        <ConnectWalletButton fullWidth size="xl" />
      ) : (
        <Checker.Amounts amounts={checkerAmount} disabled={isDisabled}>
          <Button
            fullWidth
            size="xl"
            onClick={handleSwap}
            disabled={isDisabled}
            loading={executeSwap.isPending || executeMultiHopSwap.isPending}
          >
            {executeSwap.isPending || executeMultiHopSwap.isPending
              ? 'Executing Swap...'
              : 'Swap'}
          </Button>
        </Checker.Amounts>
      )}
    </div>
  )
}
