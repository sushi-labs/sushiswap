'use client'

import {
  Button,
  DialogClose,
  DialogContent,
  DialogCustom,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogType,
  Dots,
  List,
  SelectIcon,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ReactNode } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import {
  NEAR_INTENTS_UI_FEE_DECIMAL,
  NEAR_INTENTS_UI_FEE_PERCENT,
} from 'src/lib/swap/near-intents'
import type { NearIntentsSupportedChainId } from 'src/lib/swap/near-intents/types'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import { useAccount } from 'src/lib/wallet'
import {
  Amount,
  Price,
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
import {
  NearIntentsConfirmationDialogContent,
  NearIntentsConfirmationDialogFooter,
  NearIntentsConfirmationDialogSteps,
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
    previewQuote,
    state: { chainId0, chainId1, swapAmount, token0, token1 },
  } = useNearIntentsXSwap()
  const [slippagePercent] = useSlippageTolerance()
  const recipient = useAccount(chainId1)

  const execute = useNearIntentsExecute({
    chainId0,
    chainId1,
    swapAmount,
    token0,
    token1,
    currencyEntries,
  })

  const quote = previewQuote.data
  const quoteRef = useRef<NearIntentsQuoteResponse | null>(null)

  const outputAmount =
    token1 && quote?.quote.amountOut
      ? new Amount(token1, quote.quote.amountOut)
      : null
  const minimumOutputAmount =
    token1 && quote?.quote.minAmountOut
      ? new Amount(token1, quote.quote.minAmountOut)
      : null
  const amountOutUsd = quote?.quote.amountOutUsd
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
      confirm()
      void execute
        .mutateAsync({ previewQuote: reviewedQuote })
        .then((result) => {
          setSwapAmount('')
          setActiveExecution(result)
        })
        .catch(() => undefined)
    },
    [clearActiveExecution, execute, quote, setActiveExecution, setSwapAmount],
  )

  return (
    <>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div className="flex flex-col">
              <div className="mt-4">{children}</div>
            </div>
            <DialogContent className="max-h-[80vh]">
              <DialogHeader className="!text-left">
                <DialogTitle>
                  {!outputAmount ? (
                    <SkeletonText fontSize="xs" className="w-2/3" />
                  ) : (
                    `Receive ${outputAmount.toSignificant(6)} ${token1?.symbol}`
                  )}
                </DialogTitle>
                <DialogDescription>
                  Swap {swapAmount?.toSignificant(6)} {token0?.symbol}{' '}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(80vh-176px)]">
                <NearIntentsTradeDetails
                  amountOutUsd={amountOutUsd}
                  chainId0={chainId0}
                  chainId1={chainId1}
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
              </div>
              <DialogFooter>
                <Button
                  fullWidth
                  size="xl"
                  disabled={execute.isPending || !quote}
                  onClick={() => handleConfirm(confirm)}
                  testId="confirm-swap"
                >
                  {execute.isPending ? (
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
      <DialogCustom dialogType={DialogType.Confirm}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Cross-chain swap</DialogTitle>
            <DialogDescription asChild>
              <div>
                <NearIntentsConfirmationDialogContent
                  executionError={execute.error}
                  executionPending={execute.isPending}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            <NearIntentsConfirmationDialogSteps
              executionError={execute.error}
              executionPending={execute.isPending}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <div className="w-full">
                <NearIntentsConfirmationDialogFooter
                  clearActiveExecution={clearActiveExecution}
                  executionError={execute.error}
                  executionPending={execute.isPending}
                />
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogCustom>
    </>
  )
}

function NearIntentsTradeDetails({
  amountOutUsd,
  chainId0,
  chainId1,
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
  amountOutUsd: string | undefined
  chainId0: NearIntentsSupportedChainId
  chainId1: NearIntentsSupportedChainId
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
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <List>
        <List.Control>
          <List.KeyValue title="Estimated arrival">
            {!executionDuration ? (
              <SkeletonText align="right" fontSize="sm" className="w-1/5" />
            ) : (
              executionDuration
            )}
          </List.KeyValue>
          {showMore ? (
            <>
              <List.KeyValue
                title="Network fee"
                subtitle="The transaction fee charged by the origin blockchain."
              >
                {networkFeeAmountUsd === undefined ||
                !networkFeeAmount ||
                !networkFeeSymbol ? (
                  <SkeletonText align="right" fontSize="sm" className="w-1/5" />
                ) : (
                  <FeeWithUsd
                    amount={networkFeeAmount}
                    symbol={networkFeeSymbol}
                    amountUsd={networkFeeAmountUsd}
                  />
                )}
              </List.KeyValue>
              <List.KeyValue
                title={`Fee (${NEAR_INTENTS_UI_FEE_PERCENT}%)`}
                subtitle="The fee charged by Sushi."
              >
                {feeUsd === undefined || !feeTokenAmount || !swapAmount ? (
                  <SkeletonText align="right" fontSize="sm" className="w-1/5" />
                ) : (
                  <FeeWithUsd
                    amount={feeTokenAmount}
                    symbol={swapAmount.currency.symbol}
                    amountUsd={feeUsd}
                  />
                )}
              </List.KeyValue>
              <List.KeyValue
                title="Est. received"
                subtitle="The estimated output amount."
              >
                <AmountWithUsd amount={outputAmount} amountUsd={amountOutUsd} />
              </List.KeyValue>
              <List.KeyValue
                title={`Min. received after slippage (${slippageLabel})`}
                subtitle="The minimum amount you are guaranteed to receive."
              >
                <AmountWithUsd
                  amount={minimumOutputAmount}
                  amountUsd={minimumOutputAmountUsd}
                />
              </List.KeyValue>
            </>
          ) : (
            <>
              <List.KeyValue title="Total fee">
                {totalFeeUsd === undefined ||
                !networkFeeAmount ||
                !networkFeeSymbol ? (
                  <SkeletonText align="right" fontSize="sm" className="w-1/5" />
                ) : (
                  <FeeWithUsd
                    amount={networkFeeAmount}
                    symbol={networkFeeSymbol}
                    amountUsd={totalFeeUsd}
                  />
                )}
              </List.KeyValue>
              <List.KeyValue
                title="Est. received"
                subtitle="The estimated output amount."
              >
                <AmountWithUsd amount={outputAmount} amountUsd={amountOutUsd} />
              </List.KeyValue>
            </>
          )}

          <div className="p-3">
            <Button
              size="xs"
              fullWidth
              onClick={() => setShowMore(!showMore)}
              variant="ghost"
            >
              {showMore ? (
                <SelectIcon className="rotate-180" />
              ) : (
                <SelectIcon />
              )}
            </Button>
          </div>
        </List.Control>
      </List>
      {swapAmount && outputAmount ? (
        <List className="!pt-2">
          <List.Control className="!p-5">
            <NearIntentsRouteView
              chainId0={chainId0}
              chainId1={chainId1}
              outputAmount={outputAmount}
              swapAmount={swapAmount}
            />
          </List.Control>
        </List>
      ) : null}
    </>
  )
}

function NearIntentsRouteView({
  chainId0,
  chainId1,
  outputAmount,
  swapAmount,
}: {
  chainId0: NearIntentsSupportedChainId
  chainId1: NearIntentsSupportedChainId
  outputAmount: Amount<CurrencyFor<NearIntentsSupportedChainId>>
  swapAmount: Amount<CurrencyFor<NearIntentsSupportedChainId>>
}) {
  return (
    <div className="flex gap-4">
      <VerticalDivider className="pt-1.5 pl-1" />
      <div className="flex flex-col gap-8">
        <SendAction label="From" amount={swapAmount} chainId={chainId0} />
        <span className="inline-flex items-center gap-1 text-xs leading-3 text-muted-foreground whitespace-nowrap">
          Via{' '}
          <img
            src={NEAR_INTENTS_ICON_URL}
            className="rounded-full"
            width={10}
            height={10}
            alt="NEAR Intents"
          />{' '}
          <span className="font-semibold">NEAR Intents</span>
        </span>
        <SendAction label="To" amount={outputAmount} chainId={chainId1} />
      </div>
    </div>
  )
}

function SendAction({
  amount,
  chainId,
  label,
}: {
  amount: Amount<CurrencyFor<NearIntentsSupportedChainId>>
  chainId: NearIntentsSupportedChainId
  label: 'From' | 'To'
}) {
  const chain = getChainById(chainId)?.name?.toUpperCase()

  return (
    <div className="flex flex-col gap-3">
      <span className="inline-flex items-center gap-1 text-sm leading-3 text-muted-foreground whitespace-nowrap">
        {label} <NetworkIcon chainId={chainId} width={10} height={10} />{' '}
        <span className="font-semibold leading-[17px]">{chain}</span>
      </span>
      <span className="text-sm leading-4 decoration-dotted">
        {label === 'From' ? 'Send' : 'Receive'}{' '}
        {formatNumber(amount.toString())} {amount.currency.symbol}
      </span>
    </div>
  )
}

function VerticalDivider({ className }: { className?: string }) {
  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      <svg
        width="6"
        height="80"
        viewBox="0 0 6 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 79.6667C4.47276 79.6667 5.66667 78.4728 5.66667 77C5.66667 75.5272 4.47276 74.3333 3 74.3333C1.52724 74.3333 0.333333 75.5272 0.333333 77C0.333333 78.4728 1.52724 79.6667 3 79.6667ZM3 5.66666C4.47276 5.66666 5.66667 4.47276 5.66667 3C5.66667 1.52724 4.47276 0.333336 3 0.333336C1.52724 0.333336 0.333337 1.52724 0.333336 3C0.333336 4.47276 1.52724 5.66666 3 5.66666ZM3.5 77L3.5 74.3571L2.5 74.3571L2.5 77L3.5 77ZM3.5 69.0714L3.5 63.7857L2.5 63.7857L2.5 69.0714L3.5 69.0714ZM3.5 58.5L3.5 53.2143L2.5 53.2143L2.5 58.5L3.5 58.5ZM3.5 47.9286L3.5 42.6429L2.5 42.6429L2.5 47.9286L3.5 47.9286ZM3.5 37.3571L3.5 32.0714L2.5 32.0714L2.5 37.3571L3.5 37.3571ZM3.5 26.7857L3.5 21.5L2.5 21.5L2.5 26.7857L3.5 26.7857ZM3.5 16.2143L3.5 10.9286L2.5 10.9286L2.5 16.2143ZM3.5 5.64287L3.5 3L2.5 3L2.5 5.64287L3.5 5.64287Z"
          fill="#D8E6FD"
        />
      </svg>
      <svg
        width="6"
        height="70"
        viewBox="0 10 6 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 79.6667C4.47276 79.6667 5.66667 78.4728 5.66667 77C5.66667 75.5272 4.47276 74.3333 3 74.3333C1.52724 74.3333 0.333333 75.5272 0.333333 77C0.333333 78.4728 1.52724 79.6667 3 79.6667Z M3.5 77L3.5 74.3571L2.5 74.3571L2.5 77L3.5 77Z M3.5 69.0714L3.5 63.7857L2.5 63.7857L2.5 69.0714L3.5 69.0714Z M3.5 58.5L3.5 53.2143L2.5 53.2143L2.5 58.5L3.5 58.5Z M3.5 47.9286L3.5 42.6429L2.5 42.6429L2.5 47.9286L3.5 47.9286Z M3.5 37.3571L3.5 32.0714L2.5 32.0714L2.5 37.3571ZM3.5 26.7857L3.5 21.5L2.5 21.5L2.5 26.7857ZM3.5 16.2143L3.5 10.9286L2.5 10.9286L2.5 16.2143Z"
          fill="#D8E6FD"
        />
      </svg>
    </div>
  )
}

function FeeWithUsd({
  amount,
  amountUsd,
  symbol,
}: {
  amount: string
  amountUsd: number
  symbol: string
}) {
  return (
    <span>
      {amount} {symbol}{' '}
      <span className="text-muted-foreground">({formatUSD(amountUsd)})</span>
    </span>
  )
}

function AmountWithUsd({
  amount,
  amountUsd,
}: {
  amount: Amount<CurrencyFor<NearIntentsSupportedChainId>> | null
  amountUsd?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {!amount ? (
        <SkeletonText align="right" fontSize="sm" className="w-1/2" />
      ) : (
        <span className="text-sm font-medium">{`${amount.toSignificant(6)} ${amount.currency.symbol}`}</span>
      )}
      {amountUsd === undefined ? (
        <SkeletonText
          align="right"
          fontSize="xs"
          className={classNames('w-1/4', !amount ? '' : 'invisible')}
        />
      ) : (
        <span className="text-xs text-muted-foreground">
          {formatUSD(amountUsd)}
        </span>
      )}
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
    <List className="!pt-2">
      <List.Control>
        <List.KeyValue title="Recipient">
          <a
            target="_blank"
            href={href}
            className="flex items-center gap-2 cursor-pointer text-blue"
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
          </a>
        </List.KeyValue>
      </List.Control>
    </List>
  )
}
