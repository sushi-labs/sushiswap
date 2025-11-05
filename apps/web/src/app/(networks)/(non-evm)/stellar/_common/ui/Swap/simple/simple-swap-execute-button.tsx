'use client'

import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { createErrorToast } from '@sushiswap/notifications'
import { Button } from '@sushiswap/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { PriceImpactWarning, SlippageWarning } from 'src/ui/common'
import {
  useExecuteMultiHopSwap,
  useExecuteSwap,
} from '~stellar/_common/lib/hooks/swap'
import { useNeedsTrustline } from '~stellar/_common/lib/hooks/trustline/use-trustline'
import { parseSlippageTolerance } from '~stellar/_common/lib/utils/error-helpers'
import { requiresPriceImpactConfirmation } from '~stellar/_common/lib/utils/warning-severity'
import { ConnectWalletButton } from '~stellar/_common/ui/ConnectWallet/ConnectWalletButton'
import { TrustlineWarning } from '~stellar/_common/ui/Trustline/TrustlineWarning'
import { Checker } from '~stellar/_common/ui/checker'
import { useStellarWallet } from '~stellar/providers'
import { useBestRoute } from '~stellar/swap/lib/hooks'
import { useSimpleSwapState } from './simple-swap-provider/simple-swap-provider'

export const SimpleSwapExecuteButton = () => {
  const { connectedAddress, isConnected } = useStellarWallet()
  const { amount, token0, token1, outputAmount, priceImpact } =
    useSimpleSwapState()
  const executeSwap = useExecuteSwap()
  const executeMultiHopSwap = useExecuteMultiHopSwap()
  const [checked, setChecked] = useState<boolean>(false)

  // Check if output token needs a trustline (for native assets)
  const { needsTrustline: needsToken1Trustline } = useNeedsTrustline(
    token1?.contract || '',
    token1?.code || '',
    token1?.issuer || '',
  )
  const [, { slippageTolerance }] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

  // Get the same route that was used for price calculation
  const amountIn = useMemo(() => {
    if (!amount || Number(amount) <= 0 || !token0) return 0n
    try {
      const [integer = '0', fraction = ''] = amount.split('.')
      const normalizedFraction = fraction
        .padEnd(token0.decimals, '0')
        .slice(0, token0.decimals)
      const digits =
        `${integer}${normalizedFraction}`.replace(/^0+(?=\d)/, '') || '0'
      return BigInt(digits)
    } catch {
      return 0n
    }
  }, [amount, token0])

  const { route } = useBestRoute({
    tokenIn: token0,
    tokenOut: token1,
    amountIn,
    enabled: amountIn > 0n,
  })

  const showPriceImpactWarning = requiresPriceImpactConfirmation(
    priceImpact || undefined,
  )

  // Show slippage warning if slippage > 20%
  const showSlippageWarning = useMemo(() => {
    const slippage = parseSlippageTolerance(slippageTolerance)
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
    if (!outputAmount || outputAmount === 0n) return 0n

    // Get slippage percentage (default 0.5%)
    const slippagePercent = parseSlippageTolerance(slippageTolerance)

    // Validate slippage is not 100% or more
    if (slippagePercent >= 100) {
      return (outputAmount * 5000n) / 10000n // Cap at 50%
    }

    // Calculate minimum amount: amountOut * (1 - slippage/100)
    // Using basis points for precision: (10000 - slippageBps) / 10000
    const slippageBps = Math.floor(slippagePercent * 100) // Convert to basis points

    // Ensure slippageBps doesn't exceed 10000 (100%)
    const validSlippageBps = Math.min(slippageBps, 9999)

    const minAmount = (outputAmount * BigInt(10000 - validSlippageBps)) / 10000n

    // Ensure minAmount is positive
    if (minAmount <= 0n) {
      return 1n // Minimum 1 unit
    }

    return minAmount
  }, [outputAmount, slippageTolerance])

  const handleSwap = async () => {
    if (
      !connectedAddress ||
      !token0 ||
      !token1 ||
      !amount ||
      Number(amount) <= 0 ||
      !route
    ) {
      return
    }

    try {
      // Route was calculated by useBestRoute hook
      // Direct swap: 2 tokens in path (A → B)
      // Multi-hop: 3+ tokens in path (A → B → C)
      const isDirect = route.route.length === 2

      if (isDirect) {
        // Direct swap through single pool
        await executeSwap.mutateAsync({
          userAddress: connectedAddress,
          tokenIn: token0,
          tokenOut: token1,
          amountIn,
          amountOutMinimum,
          recipient: connectedAddress,
          fee: route.fees[0],
          deadline: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        })
      } else {
        // Multi-hop swap
        await executeMultiHopSwap.mutateAsync({
          userAddress: connectedAddress,
          path: route.route, // Use the exact route from graph-based routing
          fees: route.fees,
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
    }
  }

  const checkerAmount = useMemo(() => {
    if (!token0 || !amountIn || amountIn === 0n) return []

    return [
      {
        token: token0,
        amount: Number(amountIn),
      },
    ]
  }, [amountIn, token0])

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
    needsToken1Trustline ||
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
                : needsToken1Trustline
                  ? 'Create trustline first'
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
      {needsToken1Trustline && token1?.issuer && (
        <TrustlineWarning
          assetCode={token1.code}
          assetIssuer={token1.issuer}
          className="mt-4"
        />
      )}
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
