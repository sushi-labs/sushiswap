'use client'

import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import {
  useExecuteMultiHopSwap,
  useExecuteSwap,
} from '~stellar/_common/lib/hooks/swap'
import { useNeedsTrustline } from '~stellar/_common/lib/hooks/trustline/use-trustline'
import { parseSlippageTolerance } from '~stellar/_common/lib/utils/error-helpers'
import { requiresPriceImpactConfirmation } from '~stellar/_common/lib/utils/warning-severity'
import { ConnectWalletButton } from '~stellar/_common/ui/ConnectWallet/ConnectWalletButton'
import { CreateTrustlineButton } from '~stellar/_common/ui/Trustline/CreateTrustlineButton'
import { Checker } from '~stellar/_common/ui/checker'
import { useStellarWallet } from '~stellar/providers'
import { useBestRoute } from '~stellar/swap/lib/hooks'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from './simple-swap-provider/simple-swap-provider'

export const SimpleSwapExecuteButton = () => {
  const { connectedAddress, isConnected } = useStellarWallet()
  const { amount, token0, token1, outputAmount, priceImpact } =
    useSimpleSwapState()
  const { setAmount, setOutputAmount, setSlippageAmount, setPriceImpact } =
    useSimpleSwapActions()
  const executeSwap = useExecuteSwap()
  const executeMultiHopSwap = useExecuteMultiHopSwap()
  const [checked, setChecked] = useState<boolean>(false)
  const resetSwapForm = useCallback(() => {
    setAmount('')
    setOutputAmount(0n)
    setSlippageAmount(0)
    setPriceImpact(null)
    setChecked(false)
  }, [setAmount, setOutputAmount, setSlippageAmount, setPriceImpact])

  // Check if output token needs trustline (for native assets)
  // Note: Input token (token0) doesn't need trustline check - user must already have it to swap FROM it
  const { needsTrustline: needsToken1Trustline } = useNeedsTrustline(
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

  const {
    route,
    isLoading: isRouteLoading,
    isFetching: isRouteFetching,
  } = useBestRoute({
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

    // Get slippage percentage (default 0.5%, max 50%)
    // parseSlippageTolerance already caps at 50%
    const slippagePercent = parseSlippageTolerance(slippageTolerance)

    // Calculate minimum amount: amountOut * (1 - slippage/100)
    // Using basis points for precision: (10000 - slippageBps) / 10000
    const slippageBps = Math.floor(slippagePercent * 100) // Convert to basis points

    const minAmount = (outputAmount * BigInt(10000 - slippageBps)) / 10000n

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
        resetSwapForm()
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
        resetSwapForm()
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

  // Check if we have a route but output is 0 (likely due to amount being too small)
  // This happens when the amount is so small that integer division rounds the output to 0
  const hasRouteButZeroOutput = useMemo(() => {
    return (
      route !== null &&
      route !== undefined &&
      amountIn > 0n &&
      (!outputAmount || outputAmount === 0n)
    )
  }, [route, amountIn, outputAmount])

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

  // Determine button text
  const buttonText = useMemo(() => {
    if (executeSwap.isPending || executeMultiHopSwap.isPending) {
      return 'Executing Swap...'
    }
    if (needsToken1Trustline) {
      return 'Create trustline first'
    }
    if (showPriceImpactWarning && !checked) {
      return 'Price impact too high'
    }
    if (hasRouteButZeroOutput) {
      return 'Amount too small'
    }
    // Show loading state while fetching route
    if (amount && Number(amount) > 0 && (isRouteLoading || isRouteFetching)) {
      return 'Finding best route...'
    }
    if (
      amount &&
      Number(amount) > 0 &&
      (!route || !outputAmount || outputAmount === 0n)
    ) {
      return 'No route found'
    }
    return 'Swap'
  }, [
    executeSwap.isPending,
    executeMultiHopSwap.isPending,
    needsToken1Trustline,
    showPriceImpactWarning,
    checked,
    hasRouteButZeroOutput,
    amount,
    route,
    outputAmount,
    isRouteLoading,
    isRouteFetching,
  ])

  return (
    <>
      <div className="pt-4">
        {!isConnected ? (
          <ConnectWalletButton fullWidth size="xl" />
        ) : needsToken1Trustline && token1?.issuer ? (
          <CreateTrustlineButton
            tokens={needsToken1Trustline ? [token1] : []}
            size="xl"
            fullWidth
          />
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
              {buttonText}
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
