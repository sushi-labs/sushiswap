'use client'

import { Button } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useAccount } from 'src/lib/wallet'
import { Amount, getChainById, shortenAddress } from 'sushi'
import {
  Divider,
  GetStateComponent,
  StepState,
  failedState,
  finishedState,
} from '../lifi/confirmation-dialog'
import { useNearIntentsXSwap } from './xswap-provider'

export function getNearIntentsDialogState({
  executionError,
  executionPending,
  sourceTxHash,
  status,
}: {
  executionError: unknown
  executionPending: boolean
  sourceTxHash?: string
  status?: string
}) {
  if (executionError) {
    return {
      source: StepState.Failed,
      bridge: StepState.NotStarted,
      dest: StepState.NotStarted,
    }
  }

  if (executionPending && !sourceTxHash) {
    return {
      source: StepState.Pending,
      bridge: StepState.NotStarted,
      dest: StepState.NotStarted,
    }
  }

  if (!sourceTxHash) {
    return {
      source: StepState.NotStarted,
      bridge: StepState.NotStarted,
      dest: StepState.NotStarted,
    }
  }

  switch (status) {
    case 'PENDING_DEPOSIT':
    case 'KNOWN_DEPOSIT_TX':
    case undefined:
      return {
        source: StepState.Success,
        bridge: StepState.Pending,
        dest: StepState.NotStarted,
      }
    case 'PROCESSING':
      return {
        source: StepState.Success,
        bridge: StepState.Pending,
        dest: StepState.Pending,
      }
    case 'SUCCESS':
      return {
        source: StepState.Success,
        bridge: StepState.Success,
        dest: StepState.Success,
      }
    case 'INCOMPLETE_DEPOSIT':
    case 'REFUNDED':
    case 'FAILED':
      return {
        source: StepState.Success,
        bridge: StepState.Failed,
        dest: StepState.Failed,
      }
    default:
      return {
        source: StepState.Success,
        bridge: StepState.Pending,
        dest: StepState.NotStarted,
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
  executionError,
  executionPending,
}: {
  executionError: unknown
  executionPending: boolean
}) {
  const {
    executionStatus,
    state: { sourceTxHash },
  } = useNearIntentsXSwap()

  const status = executionStatus.data?.status

  const dialogState = useMemo(
    () =>
      getNearIntentsDialogState({
        executionError,
        executionPending,
        sourceTxHash,
        status,
      }),
    [executionError, executionPending, sourceTxHash, status],
  )

  return (
    <div className="py-5">
      <div className="relative flex gap-3">
        <GetStateComponent index={1} state={dialogState.source} />
        <Divider />
        <GetStateComponent index={2} state={dialogState.bridge} />
        <Divider />
        <GetStateComponent index={3} state={dialogState.dest} />
      </div>
    </div>
  )
}

export function NearIntentsConfirmationDialogFooter({
  clearActiveExecution,
  executionError,
  executionPending,
}: {
  clearActiveExecution: () => void
  executionError: unknown
  executionPending: boolean
}) {
  const {
    executionStatus,
    state: { sourceTxHash },
  } = useNearIntentsXSwap()

  const status = executionStatus.data?.status

  const dialogState = getNearIntentsDialogState({
    executionError,
    executionPending,
    sourceTxHash,
    status,
  })

  const shouldClear = failedState(dialogState) || finishedState(dialogState)

  return (
    <Button
      size="xl"
      fullWidth
      onClick={shouldClear ? clearActiveExecution : undefined}
    >
      {failedState(dialogState)
        ? 'Try again'
        : finishedState(dialogState)
          ? 'Make another swap'
          : 'Close'}
    </Button>
  )
}
