import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import React, { useMemo } from 'react'
import type { XSwapSupportedChainId } from 'src/config'
import { nativeFromChainId, newToken } from 'src/lib/currency-from-chain-id'
import { getCrossChainStepBreakdown } from 'src/lib/swap/cross-chain'
import type {
  CrossChainAction,
  CrossChainEstimate,
  CrossChainStep,
  CrossChainToolDetails,
} from 'src/lib/swap/cross-chain/types'
import { Amount, formatNumber, getChainById, getNativeAddress } from 'sushi'

interface CrossChainSwapRouteViewProps {
  step: CrossChainStep
}

export function CrossChainSwapRouteView({
  step,
}: CrossChainSwapRouteViewProps) {
  const { srcStep, bridgeStep, dstStep } = useMemo(
    () => getCrossChainStepBreakdown(step),
    [step],
  )

  const fromAmount = useMemo(
    () =>
      new Amount(
        getNativeAddress(step.action.fromToken.chainId) ===
          step.action.fromToken.address
          ? nativeFromChainId(step.action.fromToken.chainId)
          : newToken(step.action.fromToken),
        step.action.fromAmount,
      ),
    [step],
  )

  const toAmount = useMemo(
    () =>
      new Amount(
        getNativeAddress(step.action.toToken.chainId) ===
          step.action.toToken.address
          ? nativeFromChainId(step.action.toToken.chainId)
          : newToken(step.action.toToken),
        step.estimate.toAmount,
      ),
    [step],
  )

  return (
    <div className="flex gap-4">
      <VerticalDivider count={2} className="pt-1.5 pl-1" />
      <div className="flex flex-col gap-8">
        {srcStep ? (
          <SwapAction
            label="From"
            action={srcStep?.action}
            estimate={srcStep?.estimate}
          />
        ) : (
          <SendAction label="From" amount={fromAmount} />
        )}
        <BridgeAction toolDetails={bridgeStep!.toolDetails} />
        {dstStep ? (
          <SwapAction
            label="To"
            action={dstStep.action}
            estimate={dstStep.estimate}
          />
        ) : (
          <SendAction label="To" amount={toAmount} />
        )}
      </div>
    </div>
  )
}

function VerticalDivider({
  className,
  count,
}: { className?: string; count: number }) {
  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      {Array.from({ length: count }).map((_, i) => {
        return i === 0 ? (
          <svg
            key={`divider:${i}`}
            width="6"
            height="80"
            viewBox="0 0 6 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 79.6667C4.47276 79.6667 5.66667 78.4728 5.66667 77C5.66667 75.5272 4.47276 74.3333 3 74.3333C1.52724 74.3333 0.333333 75.5272 0.333333 77C0.333333 78.4728 1.52724 79.6667 3 79.6667ZM3 5.66666C4.47276 5.66666 5.66667 4.47276 5.66667 3C5.66667 1.52724 4.47276 0.333336 3 0.333336C1.52724 0.333336 0.333337 1.52724 0.333336 3C0.333336 4.47276 1.52724 5.66666 3 5.66666ZM3.5 77L3.5 74.3571L2.5 74.3571L2.5 77L3.5 77ZM3.5 69.0714L3.5 63.7857L2.5 63.7857L2.5 69.0714L3.5 69.0714ZM3.5 58.5L3.5 53.2143L2.5 53.2143L2.5 58.5L3.5 58.5ZM3.5 47.9286L3.5 42.6429L2.5 42.6429L2.5 47.9286L3.5 47.9286ZM3.5 37.3571L3.5 32.0714L2.5 32.0714L2.5 37.3571L3.5 37.3571ZM3.5 26.7857L3.5 21.5L2.5 21.5L2.5 26.7857L3.5 26.7857ZM3.5 16.2143L3.5 10.9286L2.5 10.9286L2.5 16.2143L3.5 16.2143ZM3.5 5.64287L3.5 3L2.5 3L2.5 5.64287L3.5 5.64287Z"
              fill="#D8E6FD"
            />
          </svg>
        ) : (
          <svg
            key={`divider:${i}`}
            width="6"
            height="70"
            viewBox="0 10 6 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 79.6667C4.47276 79.6667 5.66667 78.4728 5.66667 77C5.66667 75.5272 4.47276 74.3333 3 74.3333C1.52724 74.3333 0.333333 75.5272 0.333333 77C0.333333 78.4728 1.52724 79.6667 3 79.6667Z M3.5 77L3.5 74.3571L2.5 74.3571L2.5 77L3.5 77Z M3.5 69.0714L3.5 63.7857L2.5 63.7857L2.5 69.0714L3.5 69.0714Z M3.5 58.5L3.5 53.2143L2.5 53.2143L2.5 58.5L3.5 58.5Z M3.5 47.9286L3.5 42.6429L2.5 42.6429L2.5 47.9286L3.5 47.9286Z M3.5 37.3571L3.5 32.0714L2.5 32.0714L2.5 37.3571L3.5 37.3571Z M3.5 26.7857L3.5 21.5L2.5 21.5L2.5 26.7857L3.5 26.7857Z M3.5 16.2143L3.5 10.9286L2.5 10.9286L2.5 16.2143L3.5 16.2143Z"
              fill="#D8E6FD"
            />
          </svg>
        )
      })}
    </div>
  )
}

function SendAction<TChainId extends XSwapSupportedChainId>({
  label,
  amount,
}: {
  label: 'From' | 'To'
  amount: Amount<CurrencyFor<TChainId>>
}) {
  const chain = useMemo(
    () => getChainById(amount.currency.chainId)?.name?.toUpperCase(),
    [amount],
  )

  return (
    <div className="flex flex-col gap-3">
      <span className="inline-flex items-center gap-1 text-sm leading-3 text-muted-foreground whitespace-nowrap">
        {label}{' '}
        <NetworkIcon chainId={amount.currency.chainId} width={10} height={10} />{' '}
        <span className="font-semibold leading-[17px]">{chain}</span>
      </span>
      <span className="text-sm leading-4 decoration-dotted">
        {`${label === 'From' ? 'Send' : 'Receive'} ${amount.toSignificant(6)} ${
          amount.currency.symbol
        }`}
      </span>
    </div>
  )
}

function SwapAction({
  label,
  action,
  estimate,
}: {
  label: 'From' | 'To'
  action: CrossChainAction
  estimate: CrossChainEstimate
}) {
  const { fromAmount, toAmount, chain, isWrap, isUnwrap } = useMemo(() => {
    const fromToken =
      getNativeAddress(action.fromToken.chainId) === action.fromToken.address
        ? nativeFromChainId(action.fromToken.chainId)
        : newToken(action.fromToken)

    const toToken =
      getNativeAddress(action.toToken.chainId) === action.toToken.address
        ? nativeFromChainId(action.toToken.chainId)
        : newToken(action.toToken)

    const chain = getChainById(
      label === 'From' ? fromToken.chainId : toToken.chainId,
    )?.name?.toUpperCase()

    return {
      fromAmount: new Amount(fromToken, action.fromAmount),
      toAmount: new Amount(toToken, estimate.toAmount),
      label,
      chain,
      isWrap: fromToken.type === 'native' && fromToken.wrap().isSame(toToken),
      isUnwrap: toToken.type === 'native' && toToken.wrap().isSame(fromToken),
    }
  }, [
    action.fromToken,
    action.toToken,
    action.fromAmount,
    estimate.toAmount,
    label,
  ])

  return (
    <div className="flex flex-col gap-3">
      <span className="inline-flex items-center gap-1 text-sm leading-3 text-muted-foreground whitespace-nowrap">
        {label}{' '}
        <NetworkIcon
          chainId={fromAmount.currency.chainId}
          width={10}
          height={10}
        />{' '}
        <span className="font-semibold leading-[17px]">{chain}</span>
      </span>
      <span className="text-sm leading-4 decoration-dotted">
        {isWrap ? (
          <>Wrap {toAmount.currency.symbol}</>
        ) : isUnwrap ? (
          <>Unwrap {fromAmount.currency.symbol}</>
        ) : (
          <>
            Swap {formatNumber(fromAmount.toString())}{' '}
            {fromAmount.currency.symbol}
            {' -> '}
            {formatNumber(toAmount.toString())} {toAmount.currency.symbol}
          </>
        )}
      </span>
    </div>
  )
}

function BridgeAction({
  toolDetails,
}: {
  toolDetails: CrossChainToolDetails
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs leading-3 text-muted-foreground whitespace-nowrap">
      Via{' '}
      <img
        src={toolDetails.logoURI}
        className="rounded-full"
        width={10}
        height={10}
        alt={toolDetails.name}
      />{' '}
      <span className="font-semibold">{toolDetails.name}</span>
    </span>
  )
}
