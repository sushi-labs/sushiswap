'use client'

import { Button, DialogTrigger, Dots } from '@sushiswap/ui'
import { useMemo } from 'react'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { getNamespaceForChainId } from 'src/lib/wallet/namespaces/namespace-for-chain-id'
import { type StellarToken, isStellarChainId } from 'sushi/stellar'
import { Checker as StellarChecker } from '~stellar/_common/ui/checker'
import { useIsNearIntentsXSwapMaintenance } from './hooks/use-is-near-intents-xswap-maintenance'
import { NearIntentsTradeReviewDialog } from './trade-review-dialog'
import { useNearIntentsXSwap } from './xswap-provider'

export function NearIntentsCrossChainSwapTradeButton() {
  const {
    state: { chainId0, chainId1, swapAmount, token0, token1 },
    previewQuote,
  } = useNearIntentsXSwap()

  const token1Stellar = useMemo<StellarToken | undefined>(
    () =>
      token1 && isStellarChainId(token1.chainId)
        ? (token1 as StellarToken)
        : undefined,
    [token1],
  )
  const sourceAccount = useAccount(chainId0)
  const destinationAccount = useAccount(chainId1)
  const { data: isMaintenance } = useIsNearIntentsXSwapMaintenance()

  const hasInputs = Boolean(swapAmount?.gt(0n) && token0 && token1)
  const hasValidQuote = !!previewQuote.data && !previewQuote.error
  const isLoading = previewQuote.isLoading || previewQuote.isFetching

  const buttonState = useMemo(() => {
    if (isMaintenance) return 'maintenance'
    if (!hasInputs) return 'enter-amount'
    if (!sourceAccount) return 'connect-source'
    if (!destinationAccount) return 'connect-destination'
    if (isLoading) return 'loading'
    if (previewQuote.error) return 'quote-error'
    if (!hasValidQuote) return 'no-quote'
    return 'ready'
  }, [
    destinationAccount,
    hasInputs,
    hasValidQuote,
    isMaintenance,
    isLoading,
    previewQuote.error,
    sourceAccount,
  ])

  const getButtonText = () => {
    switch (buttonState) {
      case 'enter-amount':
        return 'Enter amount'
      case 'maintenance':
        return 'Maintenance in progress'
      case 'connect-source':
        return 'Connect source wallet'
      case 'connect-destination':
        return 'Connect destination wallet'
      case 'loading':
        return <Dots>Loading quote</Dots>
      case 'quote-error':
        return 'Quote unavailable'
      case 'no-quote':
        return 'No quote available'
      case 'ready':
        return 'Swap'
      default:
        return 'Connect Wallet'
    }
  }

  const isDisabled = buttonState !== 'ready'

  return (
    <NearIntentsTradeReviewDialog>
      <div>
        <Connect fullWidth namespace={getNamespaceForChainId(chainId0)}>
          <Connect fullWidth namespace={getNamespaceForChainId(chainId1)}>
            <Network fullWidth chainId={chainId0}>
              <Amounts fullWidth chainId={chainId0} amount={swapAmount}>
                <StellarChecker.Trustline token={token1Stellar}>
                  <DialogTrigger asChild>
                    <Button
                      size="xl"
                      disabled={isDisabled}
                      fullWidth
                      testId="swap"
                    >
                      {getButtonText()}
                    </Button>
                  </DialogTrigger>
                </StellarChecker.Trustline>
              </Amounts>
            </Network>
          </Connect>
        </Connect>
      </div>
    </NearIntentsTradeReviewDialog>
  )
}
