'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { Button, Dots, Loader, classNames } from '@sushiswap/ui'
import { CheckMarkIcon } from '@sushiswap/ui/icons/CheckMarkIcon'
import { FailedMarkIcon } from '@sushiswap/ui/icons/FailedMarkIcon'
import type { FC, ReactNode } from 'react'
import { StepState } from 'src/lib/near-intents/hooks/use-near-intents-status'
import { ChainId, getChainById, shortenAddress } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import type { StellarAddress } from 'sushi/stellar'

interface ConfirmationDialogContentProps {
  txHash?: string
  dstTxHash?: string
  dstTxExplorerUrl?: string
  bridgeUrl?: string
  dialogState: { source: StepState; bridge: StepState; dest: StepState }
  token1?: { symbol: string; decimals: number }
  amountOut?: string
  recipient?: EvmAddress | StellarAddress
  chainId1?: ChainId
}

export function ConfirmationDialogContent({
  txHash,
  dstTxHash,
  dstTxExplorerUrl,
  bridgeUrl,
  dialogState,
  token1,
  amountOut,
  recipient,
  chainId1,
}: ConfirmationDialogContentProps) {
  const chain0 = getChainById(ChainId.STELLAR)
  const chain1 = chainId1 ? getChainById(chainId1) : undefined

  if (dialogState.source === StepState.Sign) {
    return <>Please sign the transaction with your wallet.</>
  }

  if (dialogState.source === StepState.Pending) {
    return (
      <>
        Waiting for your{' '}
        <Button asChild size="sm" variant="link">
          <a
            target="_blank"
            rel="noreferrer noopener noreferrer"
            href={txHash ? chain0.getTransactionUrl(txHash) : ''}
          >
            transaction
          </a>
        </Button>{' '}
        to be confirmed on {chain0.name}
      </>
    )
  }

  if (dialogState.source === StepState.Failed) {
    return (
      <>
        <span className="text-red">Oops!</span> Your{' '}
        <span className="text-blue hover:underline cursor-pointer">
          transaction
        </span>{' '}
        failed
      </>
    )
  }

  if (dialogState.bridge === StepState.Pending) {
    return (
      <>
        Bridging{' '}
        <Button asChild size="sm" variant="link">
          <a
            target="_blank"
            rel="noreferrer noopener noreferrer"
            href={bridgeUrl}
            className={classNames(
              !bridgeUrl ? 'cursor-wait' : '',
              'flex items-center gap-1',
            )}
          >
            <Dots>to the destination chain</Dots>
            <ArrowTopRightOnSquareIcon width={16} height={16} />
          </a>
        </Button>{' '}
      </>
    )
  }

  if (dialogState.dest === StepState.PartialSuccess) {
    return (
      <>
        We {`couldn't`} complete the swap. Your funds have been refunded to{' '}
        {recipient ? (
          <Button asChild size="sm" variant="link">
            <a
              target="_blank"
              rel="noreferrer noopener noreferrer"
              href={
                chain1 && dstTxHash ? chain1.getTransactionUrl(dstTxHash) : ''
              }
            >
              <Dots>{shortenAddress(recipient)}</Dots>
            </a>
          </Button>
        ) : (
          'your address'
        )}
      </>
    )
  }

  if (dialogState.dest === StepState.Success) {
    return (
      <>
        Sent{' '}
        <Button asChild size="sm" variant="link">
          <a
            target="_blank"
            rel="noreferrer noopener noreferrer"
            href={
              dstTxExplorerUrl ||
              (dstTxHash && chain1 ? chain1.getTransactionUrl(dstTxHash) : '')
            }
          >
            {amountOut} {token1?.symbol}
          </a>
        </Button>{' '}
        to {recipient ? shortenAddress(recipient) : 'recipient'}
      </>
    )
  }

  return <span />
}

const Completed = ({ partial }: { partial: boolean }) => {
  return (
    <div className="flex w-10 h-10 justify-center items-center">
      <CheckMarkIcon
        width={40}
        height={40}
        className={partial ? '!text-yellow' : ''}
      />
    </div>
  )
}

const Failed = () => {
  return (
    <div className="flex w-10 h-10 justify-center items-center">
      <FailedMarkIcon width={40} height={40} />
    </div>
  )
}

const Loading = () => (
  <Loader
    circleClassName="!text-blue/[0.15]"
    className="!text-blue"
    size={40}
  />
)

const Pending: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="text-lg w-10 h-10 rounded-full flex justify-center items-center bg-gray-300 text-gray-500 dark:bg-slate-800 dark:text-slate-400 font-semibold">
      {children}
    </div>
  )
}

export const Divider = () => {
  return (
    <div className="h-10 flex justify-center items-center">
      <div className="h-0.5 w-10 bg-gray-200 dark:bg-slate-800 rounded-full" />
    </div>
  )
}

export const GetStateComponent = ({
  state,
  index,
}: { state: StepState; index: number }) => {
  if (state === StepState.NotStarted) return <Pending>{index}</Pending>
  if (state === StepState.Sign) return <Loading />
  if (state === StepState.Pending) return <Loading />
  if (state === StepState.Success) return <Completed partial={false} />
  if (state === StepState.Failed) return <Failed />
  return <Completed partial={true} />
}
