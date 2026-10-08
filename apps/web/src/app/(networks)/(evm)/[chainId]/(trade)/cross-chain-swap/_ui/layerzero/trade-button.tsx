'use client'

import { Button, DialogTrigger, Dots } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { APPROVE_TAG_XSWAP } from 'src/lib/constants'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Guard } from 'src/lib/wagmi/systems/checker/guard'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { StockTokenRegion } from 'src/lib/wagmi/systems/checker/stock-token-region'
import { Success } from 'src/lib/wagmi/systems/checker/success'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { getNamespaceForChainId } from 'src/lib/wallet/namespaces/namespace-for-chain-id'
import { StellarToken } from 'sushi/stellar'
import { Checker as StellarChecker } from '~stellar/_common/ui/checker'
import { useIsLayerZeroXSwapMaintenance } from './hooks/use-is-layerzero-xswap-maintenance'
import { LayerZeroTradeApproval } from './trade-approval'
import { useLayerZeroXSwap } from './xswap-provider'

export function LayerZeroTradeButton(): ReactNode {
  const {
    state: {
      chainId0,
      chainId1,
      swapAmount,
      isSubmitting,
      token0,
      token1,
      isUnsupportedPair,
    },
    previewQuote,
    sourceNetworkFee,
  } = useLayerZeroXSwap()
  const sourceAccount = useAccount(chainId0)
  const destinationAccount = useAccount(chainId1)
  const { data: maintenance } = useIsLayerZeroXSwapMaintenance()
  const isLoading = previewQuote.isLoading || previewQuote.isFetching
  const checksReady =
    !maintenance &&
    !isSubmitting &&
    Boolean(
      sourceAccount &&
        destinationAccount &&
        swapAmount?.gt(0n) &&
        previewQuote.data &&
        !previewQuote.error,
    )

  const ready = checksReady && !isLoading

  const swapButton = (
    <DialogTrigger asChild>
      <Button fullWidth size="xl" disabled={!ready} testId="swap">
        {isSubmitting ? (
          <Dots>Submitting swap</Dots>
        ) : !swapAmount?.gt(0n) ? (
          'Enter amount'
        ) : isLoading ? (
          <Dots>Loading quote</Dots>
        ) : isUnsupportedPair || previewQuote.data === null ? (
          'No route found'
        ) : previewQuote.error ? (
          'Quote unavailable'
        ) : (
          'Swap'
        )}
      </Button>
    </DialogTrigger>
  )

  return (
    <div className="mt-4">
      <Guard guardWhen={maintenance} guardText="Maintenance in progress">
        <Connect fullWidth namespace={getNamespaceForChainId(chainId0)}>
          <Connect fullWidth namespace={getNamespaceForChainId(chainId1)}>
            <Network fullWidth chainId={chainId0}>
              <StockTokenRegion token0={token0} token1={token1}>
                <Amounts fullWidth chainId={chainId0} amount={swapAmount}>
                  <StellarChecker.Trustline
                    token={token1 instanceof StellarToken ? token1 : undefined}
                  >
                    <LayerZeroTradeApproval
                      quote={previewQuote.data}
                      sourceNetworkFee={sourceNetworkFee}
                      enabled={checksReady}
                      fallback={swapButton}
                    >
                      <Success tag={APPROVE_TAG_XSWAP}>{swapButton}</Success>
                    </LayerZeroTradeApproval>
                  </StellarChecker.Trustline>
                </Amounts>
              </StockTokenRegion>
            </Network>
          </Connect>
        </Connect>
      </Guard>
    </div>
  )
}
