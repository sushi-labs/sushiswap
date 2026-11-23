'use client'

import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dots,
  List,
  SkeletonText,
} from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ReviewAmountValue } from 'src/lib/components/review-amount-value'
import { ReviewDetailRow } from 'src/lib/components/review-detail-row'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import {
  NEAR_INTENTS_UI_FEE_DECIMAL,
  NEAR_INTENTS_UI_FEE_PERCENT,
} from 'src/lib/swap/near-intents'
import type { NearIntentsSupportedChainId } from 'src/lib/swap/near-intents/types'
import {
  DialogProvider,
  DialogReview,
  DialogType,
  useDialog,
} from 'src/lib/transaction-dialog'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import {
  Amount,
  formatNumber,
  formatUSD,
  getChainById,
  shortenAddress,
} from 'sushi'
import { type EvmAddress, isEvmAddress } from 'sushi/evm'
import {
  type StellarAccountAddress,
  isStellarAccountAddress,
  isStellarChainId,
} from 'sushi/stellar'
import type { NearIntentsQuoteResponse } from '~evm/api/cross-chain/near-intents/schemas'
import { getStellarAddressLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { DialogBody } from '../../../swap/_ui/simple-swap-trade-review-dialog/dialog-body'
import { TradeAmounts } from '../../../swap/_ui/simple-swap-trade-review-dialog/trade-amounts'
import { TradeHeader } from '../../../swap/_ui/simple-swap-trade-review-dialog/trade-header'
import { StepState } from '../lifi/confirmation-dialog'
import { CrossChainSwapRouteView } from '../lifi/route-view'
import { useXSwapRoutingLock } from '../xswap-routing-context'
import {
  NearIntentsConfirmationDialogContent,
  NearIntentsConfirmationDialogFooter,
  NearIntentsConfirmationDialogSteps,
  getNearIntentsStatusStepState,
} from './confirmation-dialog'
import { useNearIntentsExecute } from './hooks/use-near-intents-execute'
import { useNearIntentsSourceNetworkFee } from './hooks/use-near-intents-source-network-fee'
import { useNearIntentsXSwap } from './xswap-provider'

const NEAR_INTENTS_ICON_URL = 'https://docs.near-intents.org/favicon.svg'

export function NearIntentsTradeReviewDialog({
  children,
}: {
  children: ReactNode
}) {
  return (
    <DialogProvider>
      <NearIntentsTradeReviewDialogContent>
        {children}
      </NearIntentsTradeReviewDialogContent>
    </DialogProvider>
  )
}

function NearIntentsTradeReviewDialogContent({
  children,
}: {
  children: ReactNode
}) {
  const {
    currencyEntries,
    mutate: { clearActiveExecution, setActiveExecution, setSwapAmount },
    executionStatus,
    previewQuote,
    state: { chainId0, chainId1, swapAmount, token0, token1 },
  } = useNearIntentsXSwap()
  const [slippagePercent] = useSlippageTolerance()
  const recipient = useAccount(chainId1)

  const { confirmSourceDeposit, submitSourceTransaction } =
    useNearIntentsExecute({
      chainId0,
      chainId1,
      swapAmount,
      token0,
      token1,
      currencyEntries,
    })

  const quote = previewQuote.data
  const quoteRef = useRef<NearIntentsQuoteResponse | null>(null)
  const [stepStates, setStepStates] = useState({
    source: StepState.NotStarted,
    execution: StepState.NotStarted,
  })
  const { open: confirmDialogOpen, setOpen: setConfirmOpen } = useDialog(
    DialogType.Confirm,
  )
  const { open: reviewOpen } = useDialog(DialogType.Review)
  useXSwapRoutingLock(
    'near-intents',
    reviewOpen || confirmDialogOpen || submitSourceTransaction.isPending,
  )

  const outputAmount =
    token1 && quote?.quote.amountOut
      ? new Amount(token1, quote.quote.amountOut)
      : null
  const minimumOutputAmount =
    token1 && quote?.quote.minAmountOut
      ? new Amount(token1, quote.quote.minAmountOut)
      : null
  const feeUsd = quote
    ? Number(quote.quote.amountInUsd) * NEAR_INTENTS_UI_FEE_DECIMAL
    : undefined
  const networkFee = useNearIntentsSourceNetworkFee({
    amountIn: quote?.quote.amountIn,
    chainId: chainId0,
    enabled: Boolean(quote),
    token: token0,
  })
  const totalFeeUsd =
    feeUsd === undefined
      ? undefined
      : networkFee.amountUsd === undefined
        ? feeUsd
        : feeUsd + networkFee.amountUsd
  const feeAmount = quote?.quote.amountInFormatted
    ? formatNumber(
        (
          Number(quote.quote.amountInFormatted) * NEAR_INTENTS_UI_FEE_DECIMAL
        ).toString(),
      )
    : undefined
  const minimumOutputAmountUsd =
    quote?.quote.amountOutUsd && quote.quote.amountOut !== '0'
      ? (
          Number(quote.quote.amountOutUsd) *
          (Number(quote.quote.minAmountOut) / Number(quote.quote.amountOut))
        ).toString()
      : undefined

  const handleConfirm = useCallback(
    (confirm: () => void) => {
      if (!quote) return

      quoteRef.current = quote
      const reviewedQuote = quoteRef.current
      clearActiveExecution()
      setStepStates({
        source: StepState.Pending,
        execution: StepState.NotStarted,
      })
      void submitSourceTransaction
        .mutateAsync({ previewQuote: reviewedQuote })
        .then((result) => {
          setSwapAmount('')
          confirm()
          void confirmSourceDeposit(result)
            .then(() => {
              setActiveExecution(result)
              setStepStates(
                getNearIntentsStatusStepState({ status: undefined }),
              )
            })
            .catch(() => {
              setStepStates({
                source: StepState.Failed,
                execution: StepState.NotStarted,
              })
            })
        })
        .catch(() => {
          setStepStates({
            source: StepState.Failed,
            execution: StepState.NotStarted,
          })
        })
    },
    [
      clearActiveExecution,
      confirmSourceDeposit,
      quote,
      setActiveExecution,
      setSwapAmount,
      submitSourceTransaction,
    ],
  )

  useEffect(() => {
    const status = executionStatus.data?.status
    if (!status) return

    setStepStates(getNearIntentsStatusStepState({ status }))
  }, [executionStatus.data?.status])

  useEffect(() => {
    if (!confirmDialogOpen) {
      setStepStates({
        source: StepState.NotStarted,
        execution: StepState.NotStarted,
      })
    }
  }, [confirmDialogOpen])

  const handleClearExecution = useCallback(() => {
    clearActiveExecution()
    setStepStates({
      source: StepState.NotStarted,
      execution: StepState.NotStarted,
    })
  }, [clearActiveExecution])

  return (
    <>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div className="flex flex-col">
              <div className="mt-4">{children}</div>
            </div>
            <DialogContent className="max-h-[80vh]">
              <TradeHeader variant="default" />
              <DialogBody>
                <NearIntentsTradeDetails
                  amountInUSD={quote?.quote.amountInUsd}
                  amountOutUSD={quote?.quote.amountOutUsd}
                  executionDuration={previewQuote.executionDuration}
                  feeUsd={feeUsd}
                  feeTokenAmount={feeAmount}
                  minimumOutputAmount={minimumOutputAmount}
                  minimumOutputAmountUsd={minimumOutputAmountUsd}
                  networkFeeAmount={networkFee.amount}
                  networkFeeAmountUsd={networkFee.amountUsd}
                  networkFeeSymbol={networkFee.symbol}
                  outputAmount={outputAmount}
                  slippageLabel={slippagePercent.toPercentString()}
                  swapAmount={swapAmount}
                  totalFeeUsd={totalFeeUsd}
                />
                <RecipientSection chainId={chainId1} recipient={recipient} />
              </DialogBody>
              <DialogFooter>
                <Button
                  fullWidth
                  size="xl"
                  disabled={submitSourceTransaction.isPending || !quote}
                  onClick={() => handleConfirm(confirm)}
                  testId="confirm-swap"
                >
                  {submitSourceTransaction.isPending ? (
                    <Dots>Confirm Swap</Dots>
                  ) : (
                    `Swap ${token0?.symbol} for ${token1?.symbol}`
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Cross-chain swap</DialogTitle>
            <DialogDescription asChild>
              <div>
                <NearIntentsConfirmationDialogContent
                  executionError={submitSourceTransaction.error}
                  executionPending={submitSourceTransaction.isPending}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            <NearIntentsConfirmationDialogSteps dialogState={stepStates} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <div className="w-full">
                <NearIntentsConfirmationDialogFooter
                  clearActiveExecution={handleClearExecution}
                  dialogState={stepStates}
                />
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function NearIntentsTradeDetails({
  amountInUSD,
  amountOutUSD,
  executionDuration,
  feeTokenAmount,
  feeUsd,
  minimumOutputAmount,
  minimumOutputAmountUsd,
  networkFeeAmount,
  networkFeeAmountUsd,
  networkFeeSymbol,
  outputAmount,
  slippageLabel,
  swapAmount,
  totalFeeUsd,
}: {
  amountInUSD: string | undefined
  amountOutUSD: string | undefined
  executionDuration: string | undefined
  feeTokenAmount: string | undefined
  feeUsd: number | undefined
  minimumOutputAmount: Amount<CurrencyFor<NearIntentsSupportedChainId>> | null
  minimumOutputAmountUsd: string | undefined
  networkFeeAmount: string | undefined
  networkFeeAmountUsd: number | undefined
  networkFeeSymbol: string | undefined
  outputAmount: Amount<CurrencyFor<NearIntentsSupportedChainId>> | null
  slippageLabel: string
  swapAmount: Amount<CurrencyFor<NearIntentsSupportedChainId>> | undefined
  totalFeeUsd: number | undefined
}) {
  return (
    <div className="flex flex-col gap-2">
      <TradeAmounts
        amountIn={swapAmount}
        amountOut={outputAmount}
        amountInUSD={amountInUSD}
        amountOutUSD={amountOutUSD}
      />
      <List className="!pt-0 !gap-0">
        <List.Control className="border-transparent !bg-transparent !px-0">
          <ReviewDetailRow
            title="Slippage tolerance"
            explanation="The percentage of slippage you are willing to accept. Slippage is the difference between the expected price and the actual price at which the trade is executed."
          >
            {slippageLabel}
          </ReviewDetailRow>
          <ReviewDetailRow
            title="Minimum received"
            explanation="The minimum amount you are guaranteed to receive."
          >
            <ReviewAmountValue usdValue={minimumOutputAmountUsd}>
              {!minimumOutputAmount ? (
                <SkeletonText align="right" fontSize="sm" />
              ) : (
                `${minimumOutputAmount.toSignificant(6)} ${minimumOutputAmount.currency.symbol}`
              )}
            </ReviewAmountValue>
          </ReviewDetailRow>
          <ReviewDetailRow
            title="Network fee"
            explanation="The transaction fee charged by the origin blockchain."
          >
            {networkFeeAmountUsd === undefined ||
            !networkFeeAmount ||
            !networkFeeSymbol ? (
              <SkeletonText align="right" fontSize="sm" />
            ) : (
              <ReviewAmountValue usdValue={networkFeeAmountUsd}>
                {networkFeeAmount} {networkFeeSymbol}
              </ReviewAmountValue>
            )}
          </ReviewDetailRow>
          <ReviewDetailRow
            title={<>Fee ({NEAR_INTENTS_UI_FEE_PERCENT}%)</>}
            explanation="The fee charged by Sushi."
          >
            {feeUsd === undefined || !feeTokenAmount || !swapAmount ? (
              <SkeletonText align="right" fontSize="sm" />
            ) : (
              <ReviewAmountValue usdValue={feeUsd}>
                {feeTokenAmount} {swapAmount.currency.symbol}
              </ReviewAmountValue>
            )}
          </ReviewDetailRow>
          <ReviewDetailRow title="Total fee">
            {totalFeeUsd === undefined ||
            !networkFeeAmount ||
            !networkFeeSymbol ? (
              <SkeletonText align="right" fontSize="sm" />
            ) : (
              formatUSD(totalFeeUsd)
            )}
          </ReviewDetailRow>
          <ReviewDetailRow title="Estimated arrival">
            {!executionDuration ? (
              <SkeletonText align="right" fontSize="sm" />
            ) : (
              executionDuration
            )}
          </ReviewDetailRow>
        </List.Control>
      </List>
      {swapAmount && outputAmount ? (
        <List className="!pt-2">
          <List.Control className="!bg-transparent !rounded-2xl !p-5">
            <CrossChainSwapRouteView
              amountIn={swapAmount}
              amountOut={outputAmount}
              provider={
                <span className="inline-flex items-center gap-1">
                  <img
                    src={NEAR_INTENTS_ICON_URL}
                    className="rounded-full"
                    width={10}
                    height={10}
                    alt="NEAR Intents"
                  />{' '}
                  <span className="font-semibold">NEAR Intents</span>
                </span>
              }
            />
          </List.Control>
        </List>
      ) : null}
    </div>
  )
}

function RecipientSection({
  chainId,
  recipient,
}: {
  chainId: NearIntentsSupportedChainId
  recipient: AddressFor<NearIntentsSupportedChainId> | undefined
}) {
  if (!recipient) return null

  const isStellar = isStellarChainId(chainId)
  const isValidRecipient = isStellar
    ? isStellarAccountAddress(recipient)
    : isEvmAddress(recipient)

  if (!isValidRecipient) return null

  const href = isStellar
    ? getStellarAddressLink(recipient as StellarAccountAddress)
    : getChainById(chainId).getAccountUrl(recipient as EvmAddress)

  return (
    <List.KeyValue
      title={<div className="text-muted-foreground">Recipient</div>}
      fontWeight="normal"
      className="!px-0"
    >
      <Button variant="link" size="sm" asChild>
        <a
          target="_blank"
          href={href}
          className="font-normal flex items-center gap-1"
          rel="noreferrer"
        >
          {isStellar ? (
            shortenAddress(recipient)
          ) : (
            <AddressToEnsResolver address={recipient as EvmAddress}>
              {({ isLoading, data }) => {
                return (
                  <>{isLoading || !data ? shortenAddress(recipient) : data}</>
                )
              }}
            </AddressToEnsResolver>
          )}
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      </Button>
    </List.KeyValue>
  )
}
