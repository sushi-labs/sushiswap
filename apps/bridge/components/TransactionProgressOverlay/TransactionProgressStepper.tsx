import chain, { chains } from '@sushiswap/chain'
import { STARGATE_TOKEN } from '@sushiswap/stargate'
import { Link, NetworkIcon, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { formatBytes32String } from 'ethers/lib/utils'
import { FC, useEffect, useState } from 'react'
import { useContractEvent, useWaitForTransaction } from 'wagmi'

import { useBridgeOutput } from '../../lib/hooks'
import { useBridgeExecute } from '../BridgeExecuteProvider'
import { useBridgeState } from '../BridgeStateProvider'
import { TransactionProgressStep } from './TransactionProgressStep'

export const TransactionProgressStepper: FC = () => {
  const { id, txHash } = useBridgeExecute()
  const { amount, srcToken, dstToken } = useBridgeState()
  const { dstAmountOut } = useBridgeOutput()

  const { isError, isSuccess, isLoading } = useWaitForTransaction({
    hash: txHash,
    chainId: amount?.currency.chainId,
    enabled: Boolean(txHash) && Boolean(amount),
  })

  const [dstTxState, setDstTxState] = useState<{ txHash: string; isSuccess: boolean } | undefined>()
  const [delayed, setDelayed] = useState<boolean>(false)

  useContractEvent({
    ...getSushiXSwapContractConfig(dstAmountOut?.currency.chainId),
    chainId: dstAmountOut?.currency.chainId,
    eventName: 'StargateSushiXSwapDst',
    listener: (event) => {
      const [context, success, { transactionHash }] = event
      console.log(event, formatBytes32String(id), context === formatBytes32String(id))
      if (context === formatBytes32String(id)) {
        setDstTxState({
          txHash: transactionHash,
          isSuccess: !success,
        })
      }
    },
  })

  useEffect(() => {
    if (dstTxState?.isSuccess !== undefined) {
      setTimeout(() => {
        setDelayed(true)
      }, 750)
    }
  }, [dstTxState])

  return (
    <div className="flex flex-col">
      {amount && (
        <TransactionProgressStep
          link={chains[amount.currency.chainId].getTxUrl(txHash)}
          status={isSuccess ? 'success' : isError ? 'failed' : isLoading ? 'pending' : 'idle'}
          header={
            amount.currency.wrapped.equals(srcToken) ? (
              <TransactionProgressStep.Header>
                Transfer{' '}
                <b>
                  {amount.toSignificant(6)} {amount.currency.symbol}
                </b>{' '}
                to Stargate Router
              </TransactionProgressStep.Header>
            ) : (
              <TransactionProgressStep.Header>
                Swapping{' '}
                <b>
                  {amount.toSignificant(6)} {amount.currency.symbol}
                </b>{' '}
                for <b>{srcToken.symbol}</b>
              </TransactionProgressStep.Header>
            )
          }
          subheader={
            <TransactionProgressStep.SubHeader
              icon={<NetworkIcon chainId={amount.currency.chainId} width={16} height={16} />}
              caption={chain[amount.currency.chainId].name}
            />
          }
        />
      )}
      <TransactionProgressStep
        comingSoon
        status={dstTxState ? 'success' : isError ? 'skipped' : isSuccess ? 'pending' : 'idle'}
        header={
          <TransactionProgressStep.Header>
            Send <b>{srcToken.symbol}</b> to destination chain
          </TransactionProgressStep.Header>
        }
        subheader={
          <TransactionProgressStep.SubHeader
            icon={<Icon currency={STARGATE_TOKEN} width={16} height={16} />}
            caption={
              <Typography variant="xs">
                Powered by{' '}
                <Link.External href="https://stargate.finance" className="underline">
                  Stargate Finance
                </Link.External>
              </Typography>
            }
          />
        }
      />
      {dstAmountOut && (
        <TransactionProgressStep
          link={dstTxState ? chains[dstAmountOut.currency.chainId].getTxUrl(dstTxState.txHash) : undefined}
          lastStep={true}
          status={
            dstTxState
              ? dstTxState.isSuccess
                ? 'success'
                : 'notice'
              : isError
              ? 'skipped'
              : isSuccess
              ? delayed
                ? 'pending'
                : 'idle'
              : 'idle'
          }
          header={
            (dstTxState && !dstTxState.isSuccess) || dstAmountOut.currency.wrapped.equals(dstToken) ? (
              <TransactionProgressStep.Header>
                Transfer{' '}
                <b>
                  {dstAmountOut.toSignificant(6)} {dstAmountOut.currency.symbol}
                </b>{' '}
                to recipient
              </TransactionProgressStep.Header>
            ) : (
              <TransactionProgressStep.Header>
                Swap <b>{dstToken.symbol}</b> for{' '}
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
      )}
    </div>
  )
}
