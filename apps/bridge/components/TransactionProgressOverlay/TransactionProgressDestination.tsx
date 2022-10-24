import chain from '@sushiswap/chain'
import chains from '@sushiswap/chain'
import { NetworkIcon } from '@sushiswap/ui'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { formatBytes32String } from 'ethers/lib/utils'
import { FC, useEffect, useState } from 'react'
import { useAccount, useContractEvent, useWaitForTransaction } from 'wagmi'

import { useBridgeOutput } from '../../lib/hooks'
import { useNotifications } from '../../lib/state/storage'
import { useBridgeExecute } from '../BridgeExecuteProvider'
import { useBridgeState } from '../BridgeStateProvider'
import { TransactionProgressStep } from './TransactionProgressStep'

interface TransactionProgressDestination {
  isPrevLoading: boolean
  isPrevError: boolean
  isPrevSuccess: boolean
  onClose(): void
}

export const TransactionProgressDestination: FC<TransactionProgressDestination> = ({
  isPrevError,
  isPrevSuccess,
  onClose,
}) => {
  const { address } = useAccount()
  const { id, timestamp, setSourceTx } = useBridgeExecute()
  const { dstToken, dstChainId, amount, srcToken } = useBridgeState()
  const { dstAmountOut } = useBridgeOutput()
  const [dstTxState, setDstTxState] = useState<{ txHash: `0x${string}`; isSuccess: boolean } | undefined>()
  const [, { createSuccessNotification, createFailedNotification }] = useNotifications(address)

  useContractEvent({
    ...getSushiXSwapContractConfig(dstAmountOut?.currency.chainId),
    chainId: dstAmountOut?.currency.chainId,
    eventName: 'StargateSushiXSwapDst',
    listener: (event) => {
      const [context, success, { transactionHash }] = event
      if (context === formatBytes32String(id)) {
        setDstTxState({
          txHash: transactionHash,
          isSuccess: !success,
        })
      }
    },
  })

  const { isError, isSuccess, isLoading } = useWaitForTransaction({
    hash: dstTxState?.txHash,
    chainId: dstChainId,
    enabled: Boolean(dstTxState?.txHash) && Boolean(amount),
  })

  useEffect(() => {
    if (dstTxState && timestamp) {
      if (isSuccess) {
        const ts = new Date().getTime()
        createSuccessNotification({
          type: 'send',
          chainId: dstChainId,
          txHash: dstTxState.txHash,
          summary: {
            pending: '',
            completed: `Send ${amount?.toSignificant(6)} ${srcToken?.symbol} to recipient`,
            failed: '',
          },
          timestamp: ts,
          groupTimestamp: timestamp,
        })

        onClose()
        setTimeout(() => setSourceTx(undefined), 1000)
      }

      if (isError) {
        const ts = new Date().getTime()
        createFailedNotification({
          type: 'send',
          chainId: dstChainId,
          txHash: dstTxState?.txHash,
          summary: {
            pending: '',
            completed: '',
            failed: 'Something went wrong when sending tokens to recipient',
          },
          timestamp: ts,
          groupTimestamp: timestamp,
        })

        onClose()
        setTimeout(() => setSourceTx(undefined), 1000)
      }
    }
  }, [isSuccess, isError])

  if (!dstAmountOut) return <></>

  return (
    <TransactionProgressStep
      link={dstTxState ? chains[dstAmountOut.currency.chainId].getTxUrl(dstTxState.txHash) : undefined}
      lastStep={true}
      status={
        isError
          ? 'failed'
          : dstTxState
          ? isSuccess
            ? 'success'
            : 'notice'
          : isPrevError
          ? 'skipped'
          : isPrevSuccess
          ? isLoading
            ? 'pending'
            : 'idle'
          : 'idle'
      }
      header={
        (dstTxState && !dstTxState.isSuccess) || (dstToken && dstAmountOut.currency.wrapped.equals(dstToken)) ? (
          <TransactionProgressStep.Header>
            Transfer{' '}
            <b>
              {dstAmountOut.toSignificant(6)} {dstAmountOut.currency.symbol}
            </b>{' '}
            to recipient
          </TransactionProgressStep.Header>
        ) : (
          <TransactionProgressStep.Header>
            Swap <b>{dstToken?.symbol}</b> for{' '}
            <b>
              {dstAmountOut.toSignificant(6)} {dstAmountOut.currency.symbol}
            </b>
          </TransactionProgressStep.Header>
        )
      }
      subheader={
        <TransactionProgressStep.SubHeader
          icon={<NetworkIcon chainId={dstAmountOut.currency.chainId} width={16} height={16} />}
          caption={chain[dstAmountOut.currency.chainId].name}
        />
      }
    />
  )
}
