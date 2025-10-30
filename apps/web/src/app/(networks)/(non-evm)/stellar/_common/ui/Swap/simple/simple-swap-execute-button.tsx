'use client'

import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { PriceImpactWarning, SlippageWarning } from 'src/ui/common'
import {
  useExecuteMultiHopSwap,
  useExecuteSwap,
} from '~stellar/_common/lib/hooks/swap'
import { findBestPath } from '~stellar/_common/lib/soroban/dex-router-helpers'
import { requiresPriceImpactConfirmation } from '~stellar/_common/lib/utils/warning-severity'
import { ConnectWalletButton } from '~stellar/_common/ui/ConnectWallet/ConnectWalletButton'
import { Checker } from '~stellar/_common/ui/checker'
import { useStellarWallet } from '~stellar/providers'
import { useSimpleSwapState } from './simple-swap-provider/simple-swap-provider'

export const SimpleSwapExecuteButton = () => {
  const { connectedAddress, isConnected } = useStellarWallet()
  const { amount, token0, token1, outputAmount, priceImpact } =
    useSimpleSwapState()
  const executeSwap = useExecuteSwap()
  const executeMultiHopSwap = useExecuteMultiHopSwap()
  const [checked, setChecked] = useState<boolean>(false)
  const [, { slippageTolerance }] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

  const showPriceImpactWarning = requiresPriceImpactConfirmation(
    priceImpact || undefined,
  )

  // Show slippage warning if slippage > 20%
  const showSlippageWarning = useMemo(() => {
    const slippage =
      slippageTolerance === 'AUTO' ? 0.5 : Number(slippageTolerance)
    return slippage > 20
  }, [slippageTolerance])

  // Reset checkbox when price impact changes
  useEffect(() => {
    if (checked && !showPriceImpactWarning) {
      setChecked(false)
    }
  }, [checked, showPriceImpactWarning])

  // Calculate amount out minimum with slippage
  const amountOutMinimum = useMemo(() => {
    if (!outputAmount) return 0n

    // Get slippage percentage (default 0.5%)
    const slippagePercent =
      slippageTolerance === 'AUTO' ? 0.5 : Number(slippageTolerance)

    // Calculate minimum amount: amountOut * (1 - slippage/100)
    // Using basis points for precision: (10000 - slippageBps) / 10000
    const slippageBps = Math.floor(slippagePercent * 100) // Convert to basis points
    const minAmount = (outputAmount * BigInt(10000 - slippageBps)) / 10000n

    return minAmount
  }, [outputAmount, slippageTolerance])

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
      const route = await findBestPath(token0, token1)

      if (!route) {
        throw new Error('No route found between tokens')
      }

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
      console.error('Error executing swap:', error)
      // Error is handled by the mutation hooks
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
    !outputAmount ||
    outputAmount === 0n ||
    executeSwap.isPending ||
    executeMultiHopSwap.isPending ||
    (showPriceImpactWarning && !checked)

  return (
    <>
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
              variant={
                showPriceImpactWarning && !checked ? 'destructive' : 'default'
              }
            >
              {executeSwap.isPending || executeMultiHopSwap.isPending
                ? 'Executing Swap...'
                : showPriceImpactWarning && !checked
                  ? 'Price impact too high'
                  : amount &&
                      Number(amount) > 0 &&
                      (!outputAmount || outputAmount === 0n)
                    ? 'No route found'
                    : 'Swap'}
            </Button>
          </Checker.Amounts>
        )}
      </div>
      {showSlippageWarning && <SlippageWarning className="mt-4" />}
      {showPriceImpactWarning && (
        <PriceImpactWarning
          className="mt-4"
          checked={checked}
          setChecked={setChecked}
        />
      )}
    </>
  )
}
