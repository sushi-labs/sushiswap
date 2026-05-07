'use client'

import { Collapsible, Message } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { nativeFromChainId } from 'src/lib/currency-from-chain-id'
import { getChainById } from 'sushi'
import { stringify } from 'viem'
import { useLifiXSwap } from '../lifi-xswap-provider'

export function ReviewIntro<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({
  children,
  estGasError,
}: {
  children: ReactNode
  estGasError: Error | null
}) {
  const {
    state: { chainId0, swapAmountString },
  } = useLifiXSwap<TChainId0, TChainId1>()
  const showInsufficientFunds = Boolean(
    +swapAmountString > 0 &&
      stringify(estGasError).includes('insufficient funds'),
  )

  return (
    <div className="flex flex-col">
      <Collapsible open={showInsufficientFunds}>
        <div className="pt-4">
          <Message size="sm" variant="destructive">
            Insufficient {nativeFromChainId(chainId0).symbol} balance on{' '}
            {getChainById(chainId0 as LifiXSwapSupportedChainId).name} to cover
            the network fee. Please lower your input amount or{' '}
            <a
              href={`/${getChainById(chainId0 as LifiXSwapSupportedChainId).key}/swap?token1=NATIVE`}
              className="underline decoration-dotted underline-offset-2"
            >
              swap for more {nativeFromChainId(chainId0).symbol}
            </a>
            .
          </Message>
        </div>
      </Collapsible>
      <div className="mt-4">{children}</div>
    </div>
  )
}
