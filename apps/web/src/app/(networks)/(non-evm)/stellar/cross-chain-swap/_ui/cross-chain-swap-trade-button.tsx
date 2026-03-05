'use client'

import { DialogTrigger } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { useMemo } from 'react'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/Checker/slippage'
import { useAccount } from 'src/lib/wallet'
import { getNamespaceForChainId } from 'src/lib/wallet/namespaces/namespace-for-chain-id'
import { Checker as StellarChecker } from '~stellar/_common/ui/checker'
import {
  useCrossChainTradeQuote,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

export function CrossChainSwapTradeButton() {
  const {
    state: { swapAmountString, token0, chainId0, chainId1, slippageTolerance },
  } = useDerivedStateCrossChainSwap()
  const { data: quote, isError } = useCrossChainTradeQuote()

  const destAccount = useAccount(chainId1)

  const showSlippageWarning = useMemo(() => {
    return !slippageTolerance.lt(SLIPPAGE_WARNING_THRESHOLD)
  }, [slippageTolerance])

  const amounts = useMemo(() => {
    if (!token0 || !swapAmountString || Number(swapAmountString) === 0) {
      return []
    }

    return [
      {
        token: token0,
        amount: Number(swapAmountString),
      },
    ]
  }, [swapAmountString, token0])

  const hasQuote = quote?.quote?.amountOut && BigInt(quote.quote.amountOut) > 0n

  return (
    <>
      <div className="mt-4">
        <Checker.Connect fullWidth namespace={getNamespaceForChainId(chainId0)}>
          <Checker.Connect
            fullWidth
            namespace={getNamespaceForChainId(chainId1)}
          >
            <StellarChecker.Amounts amounts={amounts} fullWidth size="xl">
              <Checker.Slippage
                fullWidth
                text="Swap With High Slippage"
                slippageTolerance={slippageTolerance}
              >
                {/* <DialogTrigger asChild> */}
                <Button
                  disabled={Boolean(
                    !hasQuote ||
                      isError ||
                      +swapAmountString === 0 ||
                      !destAccount,
                  )}
                  color="blue"
                  fullWidth
                  size="xl"
                  testId="swap"
                >
                  {isError ? 'No trade found' : 'Swap'}
                </Button>
                {/* </DialogTrigger> */}
              </Checker.Slippage>
            </StellarChecker.Amounts>
          </Checker.Connect>
        </Checker.Connect>
      </div>
      {showSlippageWarning && <SlippageWarning className="mt-4" />}
    </>
  )
}
