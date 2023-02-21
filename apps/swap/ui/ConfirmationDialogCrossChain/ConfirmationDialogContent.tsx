import { FC, useEffect } from 'react'
import { Chain } from '@sushiswap/chain'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import { classNames, Currency, NetworkIcon } from '@sushiswap/ui'
import { useSwapState } from '../trade/TradeProvider'
import { isStargateBridgeToken, STARGATE_BRIDGE_TOKENS, STARGATE_TOKEN } from '@sushiswap/stargate'
import { useTrade } from '../../lib/useTrade'
import { StepState } from './StepStates'
import { shortenAddress } from '@sushiswap/format'
import { useLayerZeroScanLink } from '../../lib/useLayerZeroScanLink'

interface ConfirmationDialogContent {
  txHash?: string
  dstTxHash?: string
  dialogState: { source: StepState; bridge: StepState; dest: StepState }
}

export const ConfirmationDialogContent: FC<ConfirmationDialogContent> = ({ txHash, dstTxHash, dialogState }) => {
  const { tradeId, network0, network1, token0, token1, recipient } = useSwapState()
  const { data: trade } = useTrade({ crossChain: true })
  const { data: lzScanLink } = useLayerZeroScanLink({ tradeId, network1, network0, txHash })

  const swapOnSource = !isStargateBridgeToken(token0)
  const swapOnDest = !isStargateBridgeToken(token1)
  const srcBridgeToken = token0?.isToken && isStargateBridgeToken(token0) ? token0 : STARGATE_BRIDGE_TOKENS[network0][0]
  const dstBridgeToken = token1?.isToken && isStargateBridgeToken(token1) ? token1 : STARGATE_BRIDGE_TOKENS[network1][0]

  if (dialogState.source === StepState.Sign) {
    return (
      <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
        Please sign order with your wallet.
      </h1>
    )
  }

  if (dialogState.source === StepState.Pending) {
    if (swapOnSource) {
      return (
        <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
          Swapping
          <a
            target="_blank"
            href={txHash ? Chain.from(network0).getTxUrl(txHash) : ''}
            className="text-blue hover:underline cursor-pointer"
            rel="noreferrer"
          >
            <Dots>
              {token0?.symbol} for {srcBridgeToken.symbol}
            </Dots>
          </a>{' '}
          <span className="flex items-center gap-1">
            on <NetworkIcon chainId={network0} type="naked" width={24} height={24} /> {Chain.from(network0).name}
          </span>
        </h1>
      )
    } else {
      return (
        <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
          Waiting for your{' '}
          <a
            target="_blank"
            href={txHash ? Chain.from(network0).getTxUrl(txHash) : ''}
            className={classNames(txHash ? 'text-blue' : 'pointer-events-none', 'hover:underline cursor-pointer')}
            rel="noreferrer"
          >
            <Dots>transaction</Dots>
          </a>{' '}
          to be confirmed on <NetworkIcon chainId={network0} type="naked" width={16} height={16} />{' '}
          {Chain.from(network0).name}
        </h1>
      )
    }
  }

  if (dialogState.source === StepState.Failed) {
    return (
      <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center">
        <span className="text-red">Oops!</span> Your{' '}
        <span className="text-blue hover:underline cursor-pointer">transaction</span> failed
      </h1>
    )
  }

  if (dialogState.bridge === StepState.Pending) {
    return (
      <span className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
        Bridging{' '}
        <a
          target="_blank"
          href={lzScanLink || ''}
          className={classNames(lzScanLink ? 'text-blue' : 'pointer-events-none', 'hover:underline cursor-pointer')}
          rel="noreferrer"
        >
          <Dots>to destination chain</Dots>
        </a>{' '}
        <br />
        <span className="flex items-center gap-1">
          powered by{' '}
          <div className="min-h-4 min-w-4">
            <Currency.Icon currency={STARGATE_TOKEN} width={16} height={16} />
          </div>{' '}
          Stargate
        </span>
      </span>
    )
  }

  if (dialogState.dest === StepState.PartialSuccess) {
    return (
      <span className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal text-center">
        We {`couldn't`} swap {dstBridgeToken.symbol} into {token1?.symbol}, {dstBridgeToken.symbol} has been send to{' '}
        {recipient ? (
          <a
            target="_blank"
            href={Chain.from(network1).getAccountUrl(recipient)}
            className="text-blue hover:underline cursor-pointer"
            rel="noreferrer"
          >
            <Dots>{shortenAddress(recipient)}</Dots>
          </a>
        ) : (
          'recipient'
        )}
      </span>
    )
  }

  if (dialogState.dest === StepState.Success) {
    if (swapOnDest) {
      return (
        <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center">
          You sold
          <span className="text-red px-0.5 font-semibold">
            {trade?.amountIn?.toSignificant(6)} {token0?.symbol}
          </span>{' '}
          for
          <span className="text-blue px-0.5 font-semibold">
            {trade?.amountOut?.toSignificant(6)} {token1?.symbol}.
          </span>
          <br />
          <span className="flex items-center gap-1">
            From <NetworkIcon chainId={network0} type="naked" width={24} height={24} /> {Chain.from(network0).name} to{' '}
            <NetworkIcon chainId={network1} type="naked" width={24} height={24} /> {Chain.from(network1).name}
          </span>
        </h1>
      )
    } else {
      return (
        <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center">
          Sent
          <a
            target="_blank"
            href={dstTxHash ? Chain.from(network1).getAccountUrl(dstTxHash) : ''}
            className="text-blue hover:underline cursor-pointer"
            rel="noreferrer"
          >
            <span className="text-blue px-0.5 font-semibold">
              {trade?.amountOut?.toSignificant(6)} {token1?.symbol}{' '}
            </span>{' '}
          </a>
          to {recipient ? shortenAddress(recipient) : 'recipient'}
        </h1>
      )
    }
  }

  return <span />
}
