'use client'

import { Button, DialogTrigger, Dots } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { APPROVE_TAG_XSWAP } from 'src/lib/constants'
import {
  LAYERZERO_USDT0_EVM_DEPLOYMENTS,
  isLayerZeroEvmChainId,
} from 'src/lib/swap/layerzero/config'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { ApproveERC20 } from 'src/lib/wagmi/systems/checker/approve-erc20'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Guard } from 'src/lib/wagmi/systems/checker/guard'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { Success } from 'src/lib/wagmi/systems/checker/success'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { getNamespaceForChainId } from 'src/lib/wallet/namespaces/namespace-for-chain-id'
import { Amount } from 'sushi'
import { EvmToken } from 'sushi/evm'
import { STELLAR_USDT0, StellarChainId } from 'sushi/stellar'
import { Checker as StellarChecker } from '~stellar/_common/ui/checker'
import { useIsLayerZeroXSwapMaintenance } from './hooks/use-is-layerzero-xswap-maintenance'
import { LayerZeroTradeReviewDialog } from './trade-review-dialog'
import { useLayerZeroXSwap } from './xswap-provider'

export function LayerZeroTradeButton(): ReactNode {
  const {
    state: { chainId0, chainId1, swapAmount, isSubmitting },
    previewQuote,
  } = useLayerZeroXSwap()
  const sourceAccount = useAccount(chainId0)
  const destinationAccount = useAccount(chainId1)
  const { data: maintenance } = useIsLayerZeroXSwapMaintenance()
  const isLoading = previewQuote.isPending || previewQuote.isFetching
  const ready =
    !maintenance &&
    !isSubmitting &&
    !isLoading &&
    Boolean(
      sourceAccount &&
        destinationAccount &&
        swapAmount?.gt(0n) &&
        previewQuote.data &&
        !previewQuote.error,
    )
  const deployment = isLayerZeroEvmChainId(chainId0)
    ? LAYERZERO_USDT0_EVM_DEPLOYMENTS[chainId0]
    : undefined
  const approvalAmount =
    swapAmount?.currency instanceof EvmToken
      ? new Amount(swapAmount.currency, swapAmount.amount)
      : undefined

  return (
    <LayerZeroTradeReviewDialog>
      <Guard guardWhen={maintenance} guardText="Maintenance in progress">
        <Connect fullWidth namespace={getNamespaceForChainId(chainId0)}>
          <Connect fullWidth namespace={getNamespaceForChainId(chainId1)}>
            <Network fullWidth chainId={chainId0}>
              <Amounts fullWidth chainId={chainId0} amount={swapAmount}>
                <StellarChecker.Trustline
                  token={
                    chainId1 === StellarChainId.STELLAR
                      ? STELLAR_USDT0[StellarChainId.STELLAR]
                      : undefined
                  }
                >
                  <ApproveERC20
                    id="approve-erc20"
                    fullWidth
                    amount={approvalAmount}
                    contract={
                      deployment?.approvalRequired
                        ? deployment.oftAddress
                        : undefined
                    }
                    enabled={ready && Boolean(deployment?.approvalRequired)}
                  >
                    <Success tag={APPROVE_TAG_XSWAP}>
                      <DialogTrigger asChild>
                        <Button
                          fullWidth
                          size="xl"
                          disabled={!ready}
                          testId="swap"
                        >
                          {isSubmitting ? (
                            <Dots>Submitting swap</Dots>
                          ) : !swapAmount?.gt(0n) ? (
                            'Enter amount'
                          ) : isLoading ? (
                            <Dots>Loading quote</Dots>
                          ) : previewQuote.error ? (
                            'Quote unavailable'
                          ) : (
                            'Swap'
                          )}
                        </Button>
                      </DialogTrigger>
                    </Success>
                  </ApproveERC20>
                </StellarChecker.Trustline>
              </Amounts>
            </Network>
          </Connect>
        </Connect>
      </Guard>
    </LayerZeroTradeReviewDialog>
  )
}
