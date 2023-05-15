import { FC } from 'react'
import { Chain } from '@sushiswap/chain'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import { classNames, Currency, NetworkIcon } from '@sushiswap/ui'
import { useSwapState } from '../trade/TradeProvider'
import { isStargateBridgeToken, STARGATE_BRIDGE_TOKENS, STARGATE_TOKEN } from '@sushiswap/stargate'
import { useTrade } from '../../../lib/swap/useTrade'
import { StepState } from './StepStates'
import { shortenAddress } from '@sushiswap/format'
import { ArrowLongRightIcon } from '@heroicons/react/20/solid'

interface ConfirmationDialogContent {
  txHash?: string
  dstTxHash?: string
  lzUrl?: string
  dialogState: { source: StepState; bridge: StepState; dest: StepState }
}

export const ConfirmationDialogContent: FC<ConfirmationDialogContent> = ({ txHash, lzUrl, dstTxHash, dialogState }) => {
  const { network0, network1, token0, token1, recipient } = useSwapState()
  const { data: trade } = useTrade({ crossChain: true })

  const swapOnDest = !isStargateBridgeToken(token1)
  const dstBridgeToken = token1?.isToken && isStargateBridgeToken(token1) ? token1 : STARGATE_BRIDGE_TOKENS[network1][0]

  if (dialogState.source === StepState.Sign) {
    return (
      <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
        Please sign order with your wallet.
      </h1>
    )
  }

  if (dialogState.source === StepState.Pending) {
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
        to be confirmed on{' '}
        <div className="min-w-4 min-h-4">
          <NetworkIcon chainId={network0} type="naked" width={16} height={16} />
        </div>{' '}
        {Chain.from(network0).name}
      </h1>
    )
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
          href={lzUrl || ''}
          className={classNames(lzUrl ? 'text-blue' : 'pointer-events-none', 'hover:underline cursor-pointer')}
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
        <div className="flex flex-col justify-center gap-3">
          <span className="flex flex-wrap whitespace-nowrap justify-center gap-1 font-medium text-lg items-center">
            You sold
            <a
              target="_blank"
              href={txHash ? Chain.from(network0).getTxUrl(txHash) : ''}
              className="text-red px-0.5 font-semibold"
              rel="noreferrer"
            >
              {trade?.amountIn?.toSignificant(6)} {token0?.symbol}
            </a>{' '}
            for
            <a
              target="_blank"
              href={dstTxHash ? Chain.from(network1).getTxUrl(dstTxHash) : ''}
              className="text-blue px-0.5 font-semibold"
              rel="noreferrer"
            >
              {trade?.amountOut?.toSignificant(6)} {token1?.symbol}.
            </a>
          </span>
          <span className="text-lg text-center justify-center flex items-center gap-3">
            <NetworkIcon chainId={network0} width={24} height={24} />{' '}
            <ArrowLongRightIcon width={24} height={24} className="text-gray-300 dark:text-slate-500" />
            <NetworkIcon chainId={network1} width={24} height={24} />
          </span>
        </div>
      )
    } else {
      return (
        <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center">
          Sent
          <a
            target="_blank"
            href={dstTxHash ? Chain.from(network1).getTxUrl(dstTxHash) : ''}
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
