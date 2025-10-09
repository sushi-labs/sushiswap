'use client'

import { Button } from '@sushiswap/ui'
import React, { useMemo } from 'react'
import { useExecuteSwap } from '~stellar/_common/lib/hooks/swap'
import { Checker } from '~stellar/_common/ui/checker'
import { ConnectWalletButton } from '~stellar/_common/ui/ConnectWallet/ConnectWalletButton'
import { useStellarWallet } from '~stellar/providers'
import { useSimpleSwapState } from './simple-swap-provider/simple-swap-provider'

export const SimpleSwapExecuteButton = () => {
  const { connectedAddress, isConnected } = useStellarWallet()
  const { amount, token0, token1, outputAmount, slippageAmount } =
    useSimpleSwapState()
  const executeSwap = useExecuteSwap()

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

      // For now, assume single-hop swap with 0.3% fee
      // In production, this should be determined by the route finder
      const result = await executeSwap.mutateAsync({
        userAddress: connectedAddress,
        tokenIn: token0,
        tokenOut: token1,
        amountIn,
        amountOutMinimum,
        recipient: connectedAddress,
        fee: 3000, // 0.3% fee
        deadline: Math.floor(Date.now() / 1000) + 600, // 10 minutes
      })

      console.log('Swap executed:', result)
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
    executeSwap.isPending

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
            loading={executeSwap.isPending}
          >
            {executeSwap.isPending ? 'Executing Swap...' : 'Swap'}
          </Button>
        </Checker.Amounts>
      )}
    </div>
  )
}
