import { FC, useMemo } from 'react'
import { Transaction } from 'viem'
import { useTwapTrade } from './derivedstate-twap-provider'
import { StepDetails } from './twap-progress-step'

export enum ProgressIndicatorStep {
  REVIEWING = 'review',
  WRAPPING = 'wrapping',
  RESETTING_TOKEN_ALLOWANCE = 'resetting-token-allowance',
  APPROVING_TOKEN = 'approving-token',
  PERMITTING = 'permitting',
  PENDING_CONFIRMATION = 'pending-confirmation',
}

interface ProgressIndicatorProps {
  steps: ProgressIndicatorStep[]
  currentStep: ProgressIndicatorStep
  tx?: Transaction
  swapResult?: ReturnType<typeof useTwapTrade>
  wrapTxHash?: string
  tokenApprovalPending?: boolean
  revocationPending?: boolean
  swapError?: Error | string
}

export const ProgressIndicator: FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
}: ProgressIndicatorProps) => {
  const stepDetails: Record<ProgressIndicatorStep, StepDetails> = useMemo(
    () => ({
      [ProgressIndicatorStep.WRAPPING]: {
        icon: <CurrencyLogo currency={trade?.inputAmount.currency} />,
        previewTitle: t('common.wrap', { symbol: nativeCurrency.symbol }),
        actionRequiredTitle: t('common.wrapIn', {
          symbol: nativeCurrency.symbol,
        }),
        inProgressTitle: t('common.wrappingToken', {
          symbol: nativeCurrency.symbol,
        }),
        learnMoreLinkText: t('common.whyWrap', {
          symbol: nativeCurrency.symbol,
        }),
        learnMoreLinkHref: uniswapUrls.helpArticleUrls.wethExplainer,
      },
      [ProgressIndicatorStep.RESETTING_TOKEN_ALLOWANCE]: {
        icon: <CurrencyLogo currency={trade?.inputAmount.currency} />,
        previewTitle: t('common.resetLimit', {
          symbol: trade?.inputAmount.currency.symbol,
        }),
        actionRequiredTitle: t('common.resetLimitWallet', {
          symbol: trade?.inputAmount.currency.symbol,
        }),
        inProgressTitle: t('common.resettingLimit', {
          symbol: trade?.inputAmount.currency.symbol,
        }),
      },
      [ProgressIndicatorStep.APPROVING_TOKEN]: {
        icon: <CurrencyLogo currency={trade?.inputAmount.currency} />,
        previewTitle: t('common.approveSpend', {
          symbol: trade?.inputAmount.currency.symbol,
        }),
        actionRequiredTitle: t('common.wallet.approve'),
        inProgressTitle: t('common.approvePending'),
        learnMoreLinkText: t('common.whyApprove'),
        learnMoreLinkHref: uniswapUrls.helpArticleUrls.approvalsExplainer,
      },
      [ProgressIndicatorStep.PERMITTING]: {
        icon: <Sign />,
        previewTitle: t('common.signMessage'),
        actionRequiredTitle: t('common.signMessageWallet'),
        learnMoreLinkText: t('common.whySign'),
        learnMoreLinkHref: uniswapUrls.helpArticleUrls.approvalsExplainer,
      },
      [ProgressIndicatorStep.PENDING_CONFIRMATION]: {
        icon: <Swap />,
        previewTitle: isLimitTrade(trade)
          ? t('common.confirm')
          : t('swap.confirmSwap'),
        actionRequiredTitle: isLimitTrade(trade)
          ? t('common.confirmWallet')
          : t('common.confirmSwap'),
        inProgressTitle: isLimitTrade(trade)
          ? t('common.pendingEllipsis')
          : t('common.swapPending'),
        ...(isUniswapXSwapTrade(trade) && {
          timeToStart:
            trade.order.info.deadline - Math.floor(Date.now() / 1000),
          delayedStartTitle: t('common.confirmTimedOut'),
        }),
        learnMoreLinkText: isLimitTrade(trade)
          ? t('limits.learnMore')
          : t('common.learnMoreSwap'),
        learnMoreLinkHref: isLimitTrade(trade)
          ? uniswapUrls.helpArticleUrls.limitsInfo
          : uniswapUrls.helpArticleUrls.howToSwapTokens,
      },
    }),
    [inputTokenColor, nativeCurrency.symbol, trade, theme.accent1],
  )

  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <>
          {i % 2 === 1 ? (
            <div className="w-6 h-6 flex justify-center">
              <span className="w-[1px] bg-muted-foreground" />
            </div>
          ) : null}
        </>
      ))}
    </div>
  )
}
