'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  getSlippageToleranceBasisPoints,
  useIsMounted,
  useLocalStorage,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import {
  Button,
  Collapsible,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogType,
  SkeletonText,
  TextField,
  classNames,
  useDialog,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import {
  CrossmintOrderCheckout,
  CrossmintOrderCheckoutSkeleton,
  useFiatExchangeRates,
  useFiatLocale,
} from 'src/lib/crossmint'
import type {
  CrossmintCreatedOrder,
  CrossmintMoney,
  CrossmintReceiveAmountRange,
} from 'src/lib/crossmint'
import { createCrossmintOrder } from 'src/lib/crossmint/actions/create-crossmint-order'
import {
  CROSSMINT_CLIENT_SIDE_API_KEY,
  getCrossmintEnvironment,
  getCrossmintTarget,
  serializeCrossmintToken,
} from 'src/lib/crossmint/crossmint-config'
import { convertFiatToUsdAmount } from 'src/lib/crossmint/fiat-exchange-rates'
import { isValidCrossmintReceiptEmail } from 'src/lib/crossmint/validation'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { shortenAddress } from 'sushi'
import { useCurrencyPrice } from '~evm/_common/ui/price-provider/price-provider/use-currency-price'
import { useDerivedStateFiatBuy } from './derivedstate-fiat-buy-provider'
import {
  formatFiatBuyTokenAmount,
  getFiatBuyTokenEstimate,
} from './fiat-buy-token-estimate'

interface FiatBuyReviewDialogProps {
  children: ReactNode
}

const CROSSMINT_RECEIPT_EMAIL_STORAGE_KEY = 'sushi.crossmint.receipt-email'

export function FiatBuyReviewDialog({ children }: FiatBuyReviewDialogProps) {
  return (
    <DialogProvider>
      <FiatBuyReviewDialogContent>{children}</FiatBuyReviewDialogContent>
    </DialogProvider>
  )
}

function FiatBuyReviewDialogContent({ children }: FiatBuyReviewDialogProps) {
  const {
    state: { fiatAmountString, paymentCurrency, token: tokenEntry },
  } = useDerivedStateFiatBuy()
  const [checkoutSession, setCheckoutSession] =
    useState<CrossmintCreatedOrder>()
  const [emailDraft, setEmailDraft] = useState('')
  const [error, setError] = useState<string>()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [receiptEmail, setReceiptEmail] = useLocalStorage<string>(
    CROSSMINT_RECEIPT_EMAIL_STORAGE_KEY,
    '',
  )
  const [slippageTolerance] = useSlippageTolerance()
  const slippageBps = getSlippageToleranceBasisPoints(slippageTolerance)
  const isMounted = useIsMounted()
  const { open } = useDialog(DialogType.Review)
  const locale = useFiatLocale()
  const exchangeRates = useFiatExchangeRates({
    enabled: open && paymentCurrency !== 'usd',
  })
  const tokenPrice = useCurrencyPrice({
    currency: tokenEntry?.token,
    enabled: open,
  })
  const requestKeyRef = useRef<string | undefined>(undefined)
  const visibleReceiptEmail = isMounted ? receiptEmail : ''
  const hasSavedEmail = isValidCrossmintReceiptEmail(visibleReceiptEmail)
  const serializedToken = useMemo(() => {
    if (!tokenEntry) return undefined

    try {
      return serializeCrossmintToken(tokenEntry.token)
    } catch {
      return undefined
    }
  }, [tokenEntry])
  const target = useMemo(() => {
    if (!serializedToken || !CROSSMINT_CLIENT_SIDE_API_KEY) return undefined

    try {
      return getCrossmintTarget(
        serializedToken,
        getCrossmintEnvironment(CROSSMINT_CLIENT_SIDE_API_KEY),
      )
    } catch {
      return undefined
    }
  }, [serializedToken])
  const walletAddress = useAccount(target?.walletNamespace)
  const exchangeRate =
    paymentCurrency === 'usd' ? 1 : exchangeRates.data?.rates[paymentCurrency]
  const amountUsd = useMemo(() => {
    if (!exchangeRate) return undefined

    try {
      return convertFiatToUsdAmount(Number(fiatAmountString), exchangeRate)
    } catch {
      return undefined
    }
  }, [exchangeRate, fiatAmountString])
  const tokenEstimate = getFiatBuyTokenEstimate({
    allowStagingFallback: !tokenPrice.isLoading,
    amountUsd: amountUsd ? Number(amountUsd) : undefined,
    environment: target?.environment,
    sushiTokenPrice: tokenPrice.data,
  })
  const allowedMethods = useMemo(
    () => ({
      applePay: Boolean(tokenEntry?.features.creditCardPayment),
      card: Boolean(tokenEntry?.features.creditCardPayment),
      googlePay: Boolean(tokenEntry?.features.creditCardPayment),
    }),
    [tokenEntry?.features.creditCardPayment],
  )

  useEffect(() => {
    setEmailDraft(visibleReceiptEmail)
  }, [visibleReceiptEmail])

  useEffect(() => {
    if (open) return

    requestKeyRef.current = undefined
    setCheckoutSession(undefined)
    setError(undefined)
    setDetailsOpen(false)
    setIsEditingEmail(false)
    setIsCreatingOrder(false)
    setRetryCount(0)
  }, [open])

  useEffect(() => {
    if (
      !open ||
      !amountUsd ||
      !hasSavedEmail ||
      !serializedToken ||
      !target ||
      !tokenEntry ||
      !walletAddress ||
      !slippageBps ||
      !tokenEntry.features.creditCardPayment
    ) {
      return
    }

    const requestKey = [
      amountUsd,
      paymentCurrency,
      retryCount,
      serializedToken.chainId,
      serializedToken.address,
      slippageBps,
      visibleReceiptEmail,
      walletAddress,
    ].join(':')

    if (requestKeyRef.current === requestKey) return

    requestKeyRef.current = requestKey
    let ignore = false
    const orderAmountUsd = amountUsd
    const orderSlippageBps = slippageBps
    const orderToken = serializedToken
    const orderWalletAddress = walletAddress

    async function createOrder(): Promise<void> {
      setCheckoutSession(undefined)
      setError(undefined)
      setIsCreatingOrder(true)

      try {
        const order = await createCrossmintOrder({
          amountUsd: orderAmountUsd,
          paymentCurrency,
          receiptEmail: visibleReceiptEmail,
          slippageBps: orderSlippageBps,
          token: orderToken,
          walletAddress: orderWalletAddress,
        })

        if (!ignore) setCheckoutSession(order)
      } catch (caughtError) {
        if (!ignore) setError(normalizeError(caughtError).message)
      } finally {
        if (!ignore) setIsCreatingOrder(false)
      }
    }

    void createOrder()

    return () => {
      ignore = true
    }
  }, [
    amountUsd,
    hasSavedEmail,
    open,
    paymentCurrency,
    retryCount,
    serializedToken,
    slippageBps,
    target,
    tokenEntry,
    visibleReceiptEmail,
    walletAddress,
  ])

  function saveEmail(): void {
    const normalizedEmail = emailDraft.trim()

    if (isValidCrossmintReceiptEmail(normalizedEmail)) {
      if (normalizedEmail !== visibleReceiptEmail) {
        requestKeyRef.current = undefined
        setCheckoutSession(undefined)
        setError(undefined)
      }

      setReceiptEmail(normalizedEmail)
      setIsEditingEmail(false)
    }
  }

  function editEmail(): void {
    setEmailDraft(visibleReceiptEmail)
    setIsEditingEmail(true)
  }

  function cancelEmailEdit(): void {
    setEmailDraft(visibleReceiptEmail)
    setIsEditingEmail(false)
  }

  const quotedReceiveLabel = formatReceiveAmount(
    checkoutSession?.quote?.receiveAmount,
    tokenEntry?.token.symbol,
    locale,
  )
  const estimatedReceiveLabel =
    tokenEstimate.amount !== undefined && tokenEntry
      ? `${formatFiatBuyTokenAmount(tokenEstimate.amount, locale)} ${tokenEntry.token.symbol}`
      : undefined
  const receiveLabel =
    target?.kind === 'memecoin' && tokenEstimate.usesStagingFallback
      ? estimatedReceiveLabel
      : (quotedReceiveLabel ?? estimatedReceiveLabel)
  const isReceiveAmountLoading =
    isCreatingOrder ||
    (target?.environment === 'staging' && tokenPrice.isLoading)
  const paymentLabel = formatMoney(
    { amount: fiatAmountString, currency: paymentCurrency },
    locale,
  )
  const feeLabel = formatCrossmintFee({
    locale,
    paymentAmount: fiatAmountString,
    paymentCurrency,
    totalPrice: checkoutSession?.quote?.totalPrice,
  })
  const feeSummary =
    feeLabel === '-'
      ? undefined
      : feeLabel === 'Included in quote'
        ? 'Fee included'
        : `${feeLabel} fee`
  const canSaveEmail = isValidCrossmintReceiptEmail(emailDraft)

  return (
    <DialogReview>
      {() => (
        <>
          {children}
          {tokenEntry && target ? (
            <DialogContent className="max-h-[calc(100dvh-16px)] max-w-md overflow-y-auto">
              <DialogHeader className="!text-left">
                <DialogTitle>Buy {tokenEntry.token.symbol}</DialogTitle>
                <DialogDescription>Pay {paymentLabel}</DialogDescription>
              </DialogHeader>

              <div className="space-y-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 text-sm"
                  aria-expanded={detailsOpen}
                  onClick={() => setDetailsOpen((open) => !open)}
                >
                  <span className="font-medium text-gray-700 dark:text-slate-300">
                    Details
                  </span>
                  <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-slate-400">
                    {isCreatingOrder ? (
                      <SkeletonText className="min-w-14" fontSize="sm" />
                    ) : (
                      feeSummary
                    )}
                    <ChevronDownIcon
                      className={classNames(
                        'h-4 w-4 transition-transform',
                        detailsOpen && 'rotate-180',
                      )}
                    />
                  </span>
                </button>

                <Collapsible open={detailsOpen}>
                  <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-slate-200/5">
                    <ReviewDetail title="Network">
                      <span className="flex items-center gap-2 text-right">
                        <NetworkIcon
                          chainId={tokenEntry.token.chainId}
                          height={18}
                          width={18}
                        />
                        {target.network}
                      </span>
                    </ReviewDetail>
                    <ReviewDetail title="You receive">
                      {isReceiveAmountLoading ? (
                        <SkeletonText
                          align="right"
                          className="w-24"
                          fontSize="sm"
                        />
                      ) : (
                        (receiveLabel ?? '-')
                      )}
                    </ReviewDetail>
                    <ReviewDetail title="Recipient wallet">
                      <span className="font-mono" title={walletAddress}>
                        {walletAddress ? shortenAddress(walletAddress) : '-'}
                      </span>
                    </ReviewDetail>
                    <ReviewDetail title="Crossmint fee">
                      {isCreatingOrder ? (
                        <SkeletonText
                          align="right"
                          className="w-16"
                          fontSize="sm"
                        />
                      ) : (
                        feeLabel
                      )}
                    </ReviewDetail>
                    {target.stagingNotice ? (
                      <p className="pt-1 text-xs leading-5 text-yellow-600 dark:text-yellow-400">
                        {target.stagingNotice}
                      </p>
                    ) : null}
                  </div>
                </Collapsible>

                {hasSavedEmail && !isEditingEmail ? (
                  <div className="flex min-w-0 items-center justify-between gap-3 pb-1 text-xs text-muted-foreground">
                    <span
                      className="min-w-0 truncate"
                      title={visibleReceiptEmail}
                    >
                      Receipt to {visibleReceiptEmail}
                    </span>
                    <button
                      type="button"
                      className="shrink-0 font-medium text-blue underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={editEmail}
                    >
                      Change
                    </button>
                  </div>
                ) : null}

                {!hasSavedEmail || isEditingEmail ? (
                  <div className="space-y-2 rounded-xl bg-gray-100 py-3 dark:bg-slate-800">
                    <label className="text-sm font-medium" htmlFor="fiat-email">
                      Receipt email
                    </label>
                    <div className="flex items-center gap-2">
                      <TextField
                        id="fiat-email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        type="text"
                        value={emailDraft}
                        onValueChange={setEmailDraft}
                        isError={emailDraft.length > 0 && !canSaveEmail}
                      />
                      <div className="flex items-center gap-1">
                        {hasSavedEmail ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={cancelEmailEdit}
                          >
                            Cancel
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          size="sm"
                          disabled={!canSaveEmail}
                          onClick={saveEmail}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Required by Crossmint for payment receipts and saved in
                      this browser.
                    </p>
                  </div>
                ) : null}

                {exchangeRates.isError && paymentCurrency !== 'usd' ? (
                  <p role="alert" className="text-sm text-red">
                    The exchange rate needed to create this quote is currently
                    unavailable.
                  </p>
                ) : null}

                {error ? (
                  <div className="space-y-2">
                    <p role="alert" className="text-sm text-red">
                      {error}
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => setRetryCount((count) => count + 1)}
                    >
                      Try again
                    </Button>
                  </div>
                ) : null}

                {!hasSavedEmail || isEditingEmail ? (
                  <p className="text-center text-sm text-muted-foreground">
                    {hasSavedEmail
                      ? 'Save or cancel the email change to continue.'
                      : 'Add a receipt email to load payment options.'}
                  </p>
                ) : checkoutSession ? (
                  <CrossmintOrderCheckout
                    allowedMethods={allowedMethods}
                    clientSecret={checkoutSession.clientSecret}
                    orderId={checkoutSession.orderId}
                    paymentCurrency={paymentCurrency}
                    receiptEmail={visibleReceiptEmail}
                  />
                ) : isCreatingOrder ? (
                  <CrossmintOrderCheckoutSkeleton
                    type={
                      tokenEntry?.token?.symbol === 'USDC'
                        ? 'stablecoin'
                        : 'memecoin'
                    }
                  />
                ) : null}
              </div>
            </DialogContent>
          ) : null}
        </>
      )}
    </DialogReview>
  )
}

function ReviewDetail({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-gray-700 dark:text-slate-400">{title}</span>
      <span className="min-w-0 text-right font-semibold text-gray-700 dark:text-slate-300">
        {children}
      </span>
    </div>
  )
}

function normalizeError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error('Crossmint checkout could not be started')
}

function formatReceiveAmount(
  range: CrossmintReceiveAmountRange | undefined,
  symbol: string | undefined,
  locale: string,
): string | undefined {
  if (!range || !symbol) return undefined

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 8,
  })
  const lowerBound = formatter.format(Number(range.lowerBound))
  const upperBound = formatter.format(Number(range.upperBound))
  const amount =
    range.lowerBound === range.upperBound
      ? lowerBound
      : `${lowerBound}–${upperBound}`

  return `${amount} ${symbol}`
}

function formatMoney(money: CrossmintMoney, locale: string): string {
  const amount = Number(money.amount)

  if (!Number.isFinite(amount)) return '-'

  return new Intl.NumberFormat(locale, {
    currency: money.currency.toUpperCase(),
    style: 'currency',
  }).format(amount)
}

function formatCrossmintFee({
  locale,
  paymentAmount,
  paymentCurrency,
  totalPrice,
}: {
  locale: string
  paymentAmount: string
  paymentCurrency: string
  totalPrice?: CrossmintMoney
}): string {
  if (!totalPrice) return '-'

  if (totalPrice.currency.toLowerCase() !== paymentCurrency.toLowerCase()) {
    return 'Included in quote'
  }

  const total = Number(totalPrice.amount)
  const amount = Number(paymentAmount)

  if (!Number.isFinite(total) || !Number.isFinite(amount)) return '-'

  return formatMoney(
    {
      amount: Math.max(total - amount, 0).toString(),
      currency: totalPrice.currency,
    },
    locale,
  )
}
