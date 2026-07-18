import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { Button, Dots, Loader, classNames } from '@sushiswap/ui'
import { CheckMarkIcon } from '@sushiswap/ui/icons/CheckMarkIcon'
import { FailedMarkIcon } from '@sushiswap/ui/icons/FailedMarkIcon'
import { type FC, type ReactNode, useMemo } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { getChainById, shortenAddress } from 'sushi'
import { getEvmChainById } from 'sushi/evm'
import type { Hex } from 'viem'
import { StepState } from './trade-review-dialog/cross-chain-swap-execution'
import {
  type UseLifiXSwapSelectedTradeRouteReturn,
  useLifiXSwap,
} from './xswap-provider'

interface SourceTransactionLinkProps {
  href: string | undefined
  state: 'pending' | 'failed'
  chainName: string
}

function SourceTransactionLink({
  href,
  state,
  chainName,
}: SourceTransactionLinkProps) {
  if (!href) return <>transaction</>

  return (
    <Button asChild size="sm" variant="link">
      <a
        target="_blank"
        rel="noreferrer noopener"
        href={href}
        aria-label={`View ${state} source transaction on ${chainName}`}
      >
        transaction
      </a>
    </Button>
  )
}

interface ConfirmationDialogContent<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> {
  txHash?: TxHashFor<TChainId0>
  dstTxHash?: TxHashFor<TChainId1>
  bridgeUrl?: string
  onRetrySourceReceipt?: () => void
  dialogState: { source: StepState; bridge: StepState; dest: StepState }
  route: UseLifiXSwapSelectedTradeRouteReturn<TChainId0, TChainId1> | undefined
}

export function ConfirmationDialogContent<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({
  txHash,
  bridgeUrl,
  dstTxHash,
  onRetrySourceReceipt,
  dialogState,
  route,
}: ConfirmationDialogContent<TChainId0, TChainId1>) {
  const {
    state: { chainId0, chainId1, token0, token1, recipient },
  } = useLifiXSwap<TChainId0, TChainId1>()
  const swapOnDest =
    route?.step &&
    [
      route.step.includedStepsWithoutFees?.[1]?.type,
      route.step.includedStepsWithoutFees?.[2]?.type,
    ].includes('swap')

  const [chain0, chain1] = useMemo(
    () => [
      getChainById(chainId0 as LifiXSwapSupportedChainId),
      getChainById(chainId1 as LifiXSwapSupportedChainId),
    ],
    [chainId0, chainId1],
  )

  if (dialogState.source === StepState.Sign) {
    return <>Please sign order with your wallet.</>
  }

  if (dialogState.source === StepState.Pending) {
    return (
      <>
        Waiting for your{' '}
        <SourceTransactionLink
          href={txHash ? chain0.getTransactionUrl(txHash) : undefined}
          state="pending"
          chainName={chain0.name}
        />{' '}
        to be confirmed on {chain0.name}
      </>
    )
  }

  if (dialogState.source === StepState.Failed) {
    return (
      <>
        <span className="text-red">Oops!</span> Your{' '}
        <SourceTransactionLink
          href={txHash ? chain0.getTransactionUrl(txHash) : undefined}
          state="failed"
          chainName={chain0.name}
        />{' '}
        failed
      </>
    )
  }

  if (dialogState.source === StepState.Unknown) {
    return (
      <>
        Status unavailable. View the{' '}
        <SourceTransactionLink
          href={txHash ? chain0.getTransactionUrl(txHash) : undefined}
          state="pending"
          chainName={chain0.name}
        />{' '}
        or{' '}
        <Button
          size="sm"
          variant="link"
          onClick={onRetrySourceReceipt}
          disabled={!onRetrySourceReceipt}
        >
          retry
        </Button>
        .
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
            rel="noreferrer noopener noreferer"
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
    const fromTokenSymbol =
      route?.step?.includedStepsWithoutFees?.[1]?.type === 'swap'
        ? route.step.includedStepsWithoutFees[1]?.action.fromToken?.symbol
        : route?.step?.includedStepsWithoutFees?.[2]?.type === 'swap'
          ? route.step.includedStepsWithoutFees[2]?.action.fromToken?.symbol
          : undefined

    return (
      <>
        We {`couldn't`} swap {fromTokenSymbol} into {token1?.symbol},{' '}
        {fromTokenSymbol} has been send to{' '}
        {recipient ? (
          <Button asChild size="sm" variant="link">
            <a
              target="_blank"
              rel="noreferrer noopener noreferer"
              href={chain1.getAccountUrl(recipient)}
            >
              <Dots>{shortenAddress(recipient)}</Dots>
            </a>
          </Button>
        ) : (
          'recipient'
        )}
      </>
    )
  }

  if (dialogState.dest === StepState.Success) {
    if (swapOnDest) {
      return (
        <>
          You sold{' '}
          <Button asChild size="sm" variant="link">
            <a
              target="_blank"
              rel="noreferrer noopener noreferer"
              href={txHash ? chain0.getTransactionUrl(txHash) : ''}
            >
              {route?.amountIn.toSignificant(6)} {token0?.symbol}
            </a>
          </Button>{' '}
          for{' '}
          <Button asChild size="sm" variant="link">
            <a
              target="_blank"
              rel="noreferrer noopener noreferer"
              href={dstTxHash ? chain1.getTransactionUrl(dstTxHash) : ''}
            >
              {route?.amountOut.toSignificant(6)} {token1?.symbol}
            </a>
          </Button>
        </>
      )
    } else {
      return (
        <>
          Sent{' '}
          <Button asChild size="sm" variant="link">
            <a
              target="_blank"
              rel="noreferrer noopener noreferer"
              href={dstTxHash ? chain1.getTransactionUrl(dstTxHash) : ''}
            >
              {route?.amountOut.toSignificant(6)} {token1?.symbol}
            </a>
          </Button>{' '}
          to {recipient ? shortenAddress(recipient) : 'recipient'}
        </>
      )
    }
  }

  return <span />
}

export { StepState } from './trade-review-dialog/cross-chain-swap-execution'

export const initState = (state: {
  source: StepState
  bridge: StepState
  dest: StepState
}) => {
  return (
    state.source === StepState.NotStarted &&
    state.bridge === StepState.NotStarted &&
    state.dest === StepState.NotStarted
  )
}

export const pendingState = (state: {
  source: StepState
  bridge: StepState
  dest: StepState
}) => {
  return !finishedState(state) && !failedState(state) && !initState(state)
}

export const finishedState = (state: {
  source: StepState
  bridge: StepState
  dest: StepState
}) => {
  if (state.source === StepState.Failed) return true
  return [
    StepState.Success,
    StepState.Failed,
    StepState.PartialSuccess,
  ].includes(state.dest)
}

export const failedState = (state: {
  source: StepState
  bridge: StepState
  dest: StepState
}) => {
  return state.source === StepState.Failed
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
  if (state === StepState.Unknown) return <Loading />
  if (state === StepState.Success) return <Completed partial={false} />
  if (state === StepState.Failed) return <Failed />
  return <Completed partial={true} />
}
