'use client'

import { Button } from '@sushiswap/ui'
import { useAccount } from 'src/lib/wallet'
import { Amount, getChainById, shortenAddress } from 'sushi'
import {
  Divider,
  GetStateComponent,
  StepState,
} from '../lifi/confirmation-dialog'
import { useNearIntentsXSwap } from './xswap-provider'

export type NearIntentsDialogState = {
  source: StepState
  execution: StepState
}

export function getNearIntentsStatusStepState({
  status,
}: {
  status?: string
}): NearIntentsDialogState {
  switch (status) {
    case 'PENDING_DEPOSIT':
    case 'KNOWN_DEPOSIT_TX':
    case undefined:
      return {
        source: StepState.Success,
        execution: StepState.Pending,
      }
    case 'PROCESSING':
      return {
        source: StepState.Success,
        execution: StepState.Pending,
      }
    case 'SUCCESS':
      return {
        source: StepState.Success,
        execution: StepState.Success,
      }
    case 'INCOMPLETE_DEPOSIT':
    case 'REFUNDED':
    case 'FAILED':
      return {
        source: StepState.Success,
        execution: StepState.Failed,
      }
    default:
      return {
        source: StepState.Success,
        execution: StepState.Pending,
      }
  }
}

export function NearIntentsConfirmationDialogContent({
  executionError,
  executionPending,
}: {
  executionError: unknown
  executionPending: boolean
}) {
  const {
    executionStatus,
    previewQuote,
    state: { chainId0, chainId1, sourceTxHash, token1 },
  } = useNearIntentsXSwap()

  const recipient = useAccount(chainId1)
  const status = executionStatus.data?.status
  const destinationTxHash = executionStatus.data?.destinationTxHashes[0]?.hash
  const chain0 = getChainById(chainId0)
  const chain1 = getChainById(chainId1)
  const amountOut =
    token1 && previewQuote.data?.quote.amountOut
      ? new Amount(token1, previewQuote.data.quote.amountOut).toSignificant(6)
      : undefined

  if (executionError) {
    return (
      <>Swap submission failed before the source transaction was accepted.</>
    )
  }

  if (executionPending && !sourceTxHash) {
    return <>Confirm the source-chain deposit in your wallet.</>
  }

  if (sourceTxHash && status !== 'SUCCESS') {
    return (
      <>
        Waiting for your{' '}
        <Button asChild size="sm" variant="link">
          <a
            target="_blank"
            rel="noreferrer noopener noreferer"
            href={chain0.getTransactionUrl(sourceTxHash)}
          >
            transaction
          </a>
        </Button>{' '}
        to be processed by NEAR Intents.
      </>
    )
  }

  if (status === 'SUCCESS') {
    return (
      <>
        Sent{' '}
        {destinationTxHash ? (
          <Button asChild size="sm" variant="link">
            <a
              target="_blank"
              rel="noreferrer noopener noreferer"
              href={chain1.getTransactionUrl(destinationTxHash)}
            >
              {amountOut ?? ''} {token1?.symbol ?? ''}
            </a>
          </Button>
        ) : (
          `${amountOut ?? ''} ${token1?.symbol ?? ''}`
        )}{' '}
        to {recipient ? shortenAddress(recipient) : 'recipient'}
      </>
    )
  }

  if (status === 'INCOMPLETE_DEPOSIT') {
    return (
      <>
        The deposit was smaller than required. 1Click marked the swap as
        incomplete.
      </>
    )
  }

  if (status === 'REFUNDED' || status === 'FAILED') {
    return (
      <>
        The swap failed after deposit submission. Check the source transaction
        and 1Click status details.
      </>
    )
  }

  return <>Preparing the swap confirmation.</>
}

export function NearIntentsConfirmationDialogSteps({
  dialogState,
}: {
  dialogState: NearIntentsDialogState
}) {
  return (
    <div className="py-5">
      <div className="relative flex gap-3">
        <GetStateComponent index={1} state={dialogState.source} />
        <Divider />
        <GetStateComponent index={2} state={dialogState.execution} />
      </div>
    </div>
  )
}

export function NearIntentsConfirmationDialogFooter({
  clearActiveExecution,
  dialogState,
}: {
  clearActiveExecution: () => void
  dialogState: NearIntentsDialogState
}) {
  const failed =
    dialogState.source === StepState.Failed ||
    dialogState.execution === StepState.Failed
  const finished = dialogState.execution === StepState.Success
  const shouldClear = failed || finished

  return (
    <Button
      size="xl"
      fullWidth
      onClick={shouldClear ? clearActiveExecution : undefined}
    >
      {failed ? 'Try again' : finished ? 'Make another swap' : 'Close'}
    </Button>
  )
}
