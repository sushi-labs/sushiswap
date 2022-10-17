import chain, { chains } from '@sushiswap/chain'
import { Amount, Token, Type } from '@sushiswap/currency'
import { STARGATE_TOKEN } from '@sushiswap/stargate'
import { Link, NetworkIcon, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { formatBytes32String } from 'ethers/lib/utils'
import { FC, useEffect, useState } from 'react'
import { useContractEvent, useWaitForTransaction } from 'wagmi'

import { TransactionProgressStep } from './TransactionProgressStep'

interface TransactionProgressStepper {
  id: string
  inputAmount?: Amount<Type>
  outputAmount?: Amount<Type>
  srcBridgeToken: Token
  dstBridgeToken: Token
  srcTxHash: string
  crossChain: boolean
}

export const TransactionProgressStepper: FC<TransactionProgressStepper> = ({
  id,
  inputAmount,
  outputAmount,
  srcBridgeToken,
  dstBridgeToken,
  srcTxHash,
  crossChain,
}) => {
  const { isError, isSuccess, isLoading } = useWaitForTransaction({
    hash: srcTxHash,
    chainId: inputAmount?.currency.chainId,
    enabled: Boolean(srcTxHash) && Boolean(inputAmount),
  })

  const [dstTxState, setDstTxState] = useState<{ txHash: string; isSuccess: boolean } | undefined>()
  const [delayed, setDelayed] = useState<boolean>(false)

  useContractEvent({
    ...getSushiXSwapContractConfig(outputAmount?.currency.chainId),
    chainId: outputAmount?.currency.chainId,
    eventName: 'StargateSushiXSwapDst',
    listener: (event) => {
      const [context, success, { transactionHash }] = event
      // console.log(event, formatBytes32String(id), context === formatBytes32String(id))
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

  if (!crossChain) {
    return (
      <div className="flex flex-col">
        {inputAmount && outputAmount && (
          <TransactionProgressStep
            lastStep={true}
            link={chains[inputAmount.currency.chainId].getTxUrl(srcTxHash)}
            status={isSuccess ? 'success' : isError ? 'failed' : isLoading ? 'pending' : 'idle'}
            header={
              <TransactionProgressStep.Header>
                Swapping{' '}
                <b>
                  {inputAmount.toSignificant(6)} {inputAmount.currency.symbol}
                </b>{' '}
                for{' '}
                <b>
                  {outputAmount?.toSignificant(6)} {outputAmount.currency.symbol}
                </b>
              </TransactionProgressStep.Header>
            }
            subheader={
              <TransactionProgressStep.SubHeader
                icon={<NetworkIcon chainId={inputAmount.currency.chainId} width={16} height={16} />}
                caption={chain[inputAmount.currency.chainId].name}
              />
            }
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {inputAmount && (
        <TransactionProgressStep
          link={chains[inputAmount.currency.chainId].getTxUrl(srcTxHash)}
          status={isSuccess ? 'success' : isError ? 'failed' : isLoading ? 'pending' : 'idle'}
          header={
            inputAmount.currency.wrapped.equals(srcBridgeToken) ? (
              <TransactionProgressStep.Header>
                Transfer{' '}
                <b>
                  {inputAmount.toSignificant(6)} {inputAmount.currency.symbol}
                </b>{' '}
                to Stargate Router
              </TransactionProgressStep.Header>
            ) : (
              <TransactionProgressStep.Header>
                Swapping{' '}
                <b>
                  {inputAmount.toSignificant(6)} {inputAmount.currency.symbol}
                </b>{' '}
                for <b>{srcBridgeToken.symbol}</b>
              </TransactionProgressStep.Header>
            )
          }
          subheader={
            <TransactionProgressStep.SubHeader
              icon={<NetworkIcon chainId={inputAmount.currency.chainId} width={16} height={16} />}
              caption={chain[inputAmount.currency.chainId].name}
            />
          }
        />
      )}
      <TransactionProgressStep
        comingSoon
        status={dstTxState ? 'success' : isError ? 'skipped' : isSuccess ? 'pending' : 'idle'}
        header={
          <TransactionProgressStep.Header>
            Send <b>{srcBridgeToken.symbol}</b> to destination chain
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
      {outputAmount && (
        <TransactionProgressStep
          link={dstTxState ? chains[outputAmount.currency.chainId].getTxUrl(dstTxState.txHash) : undefined}
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
            (dstTxState && !dstTxState.isSuccess) || outputAmount.currency.wrapped.equals(dstBridgeToken) ? (
              <TransactionProgressStep.Header>
                Transfer{' '}
                <b>
                  {outputAmount.toSignificant(6)} {outputAmount.currency.symbol}
                </b>{' '}
                to recipient
              </TransactionProgressStep.Header>
            ) : (
              <TransactionProgressStep.Header>
                Swap <b>{dstBridgeToken.symbol}</b> for{' '}
                <b>
                  {outputAmount.toSignificant(6)} {outputAmount.currency.symbol}
                </b>
              </TransactionProgressStep.Header>
            )
          }
          subheader={
            <TransactionProgressStep.SubHeader
              icon={<NetworkIcon chainId={outputAmount.currency.chainId} width={16} height={16} />}
              caption={chain[outputAmount.currency.chainId].name}
            />
          }
        />
      )}
    </div>
  )
}
