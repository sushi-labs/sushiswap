import chain, { chains } from '@sushiswap/chain'
import { STARGATE_TOKEN } from '@sushiswap/stargate'
import { Link, NetworkIcon, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { formatBytes32String } from 'ethers/lib/utils'
import { FC, useEffect, useState } from 'react'
import { useContractEvent, useWaitForTransaction } from 'wagmi'

import { UseTradeOutput } from '../../lib/hooks'
import { TransactionProgressStep } from './TransactionProgressStep'

interface TransactionProgressStepper {
  id: string
  srcTrade: UseTradeOutput
  dstTrade: UseTradeOutput
  srcTxHash: string
}

export const TransactionProgressStepper: FC<TransactionProgressStepper> = ({ id, srcTrade, dstTrade, srcTxHash }) => {
  const { isError, isSuccess, isLoading } = useWaitForTransaction({
    hash: srcTxHash,
    chainId: srcTrade?.inputAmount.currency.chainId,
    enabled: Boolean(srcTxHash) && Boolean(srcTrade),
  })

  const [dstTxState, setDstTxState] = useState<{ txHash: string; isSuccess: boolean } | undefined>()
  const [delayed, setDelayed] = useState<boolean>()

  useContractEvent({
    ...getSushiXSwapContractConfig(dstTrade?.outputAmount.currency.chainId),
    chainId: dstTrade?.outputAmount.currency.chainId,
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
    if (dstTxState) {
      setTimeout(() => {
        setDelayed(true)
      }, 750)
    }
  }, [dstTxState])

  return (
    <div className="flex flex-col">
      {srcTrade && (
        <TransactionProgressStep
          lastStep={!dstTrade}
          link={chains[srcTrade.inputAmount.currency.chainId].getTxUrl(srcTxHash)}
          status={isSuccess ? 'success' : isError ? 'failed' : isLoading ? 'pending' : 'idle'}
          // status="success"
          header={
            <TransactionProgressStep.Header>
              Swapping{' '}
              <b>
                {srcTrade.inputAmount.toSignificant(6)} {srcTrade.inputAmount.currency.symbol}
              </b>{' '}
              for <b>{srcTrade.outputAmount.currency.symbol}</b>
            </TransactionProgressStep.Header>
          }
          subheader={
            <TransactionProgressStep.SubHeader
              icon={<NetworkIcon chainId={srcTrade.inputAmount.currency.chainId} width={16} height={16} />}
              caption={chain[srcTrade.inputAmount.currency.chainId].name}
            />
          }
        />
      )}
      {srcTrade && dstTrade && (
        <TransactionProgressStep
          status={
            dstTxState
              ? dstTxState.isSuccess
                ? 'success'
                : 'notice'
              : isError
              ? 'skipped'
              : isSuccess
              ? 'pending'
              : 'idle'
          }
          header={
            <TransactionProgressStep.Header>
              Send <b>{srcTrade.outputAmount.currency.symbol}</b> to destination chain
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
      )}
      {dstTrade && (
        <TransactionProgressStep
          link={dstTxState ? chains[dstTrade.inputAmount.currency.chainId].getTxUrl(dstTxState.txHash) : undefined}
          lastStep={true}
          status={
            dstTxState && delayed
              ? dstTxState.isSuccess
                ? 'success'
                : 'notice'
              : isError
              ? 'skipped'
              : isSuccess
              ? 'pending'
              : 'idle'
          }
          header={
            dstTxState && !dstTxState.isSuccess ? (
              <TransactionProgressStep.Header>
                Send <b>{dstTrade.inputAmount.currency.symbol}</b> to recipient
              </TransactionProgressStep.Header>
            ) : (
              <TransactionProgressStep.Header>
                Swap <b>{dstTrade.inputAmount.currency.symbol}</b> for{' '}
                <b>
                  {dstTrade.outputAmount.toSignificant(6)} {dstTrade.outputAmount.currency.symbol}
                </b>
              </TransactionProgressStep.Header>
            )
          }
          subheader={
            <TransactionProgressStep.SubHeader
              icon={<NetworkIcon chainId={dstTrade.outputAmount.currency.chainId} width={16} height={16} />}
              caption={chain[dstTrade.outputAmount.currency.chainId].name}
            />
          }
        />
      )}
    </div>
  )
}
