'use client'

import {
  CrossmintCheckoutProvider,
  CrossmintEmbeddedCheckout,
  CrossmintProvider,
  useCrossmintCheckout,
} from '@crossmint/client-sdk-react-ui'
import { useIsMounted, useLocalStorage } from '@sushiswap/hooks'
import { Button, Card, Currency, TextField, classNames } from '@sushiswap/ui'
import { useTheme } from 'next-themes'
import { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { shortenAddress } from 'sushi'
import { createCrossmintOrder } from '../actions/create-crossmint-order'
import {
  CROSSMINT_CLIENT_SIDE_API_KEY,
  type CrossmintCheckoutToken,
  type CrossmintEnvironment,
  type CrossmintTarget,
  type SerializedCrossmintToken,
  getCrossmintEnvironment,
  getCrossmintTarget,
  serializeCrossmintToken,
} from '../crossmint-config'
import type { CrossmintCreatedOrder } from '../types'

export const CROSSMINT_RECEIPT_EMAIL_STORAGE_KEY =
  'sushi.crossmint.receipt-email'
export const DEFAULT_CROSSMINT_AMOUNT_PRESETS_USD = [
  '25',
  '50',
  '100',
  '250',
] as const

export type CrossmintCheckoutExperience = 'checkout' | 'one-tap'
export type CrossmintCheckoutPresentation = 'card' | 'plain'
type WalletPayMethod = 'applePay' | 'googlePay'

interface CheckoutSession extends CrossmintCreatedOrder {
  environment: CrossmintEnvironment
  experience: CrossmintCheckoutExperience
  receiptEmail: string
  token: SerializedCrossmintToken
  walletAddress: string
  walletPayMethod: WalletPayMethod
}

export interface CrossmintTokenCheckoutProps {
  amountPresetsUsd?: readonly string[]
  className?: string
  defaultAmountUsd?: string
  defaultExperience?: CrossmintCheckoutExperience
  onCancel?(): void
  onComplete?(orderId: string): void
  onError?(error: Error): void
  onOrderCreated?(orderId: string): void
  presentation?: CrossmintCheckoutPresentation
  showCancelButton?: boolean
  token: CrossmintCheckoutToken
}

function normalizeError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error('Crossmint checkout could not be started')
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function CrossmintTokenCheckout({
  amountPresetsUsd = DEFAULT_CROSSMINT_AMOUNT_PRESETS_USD,
  className,
  defaultAmountUsd = DEFAULT_CROSSMINT_AMOUNT_PRESETS_USD[0],
  defaultExperience = 'one-tap',
  onCancel,
  onComplete,
  onError,
  onOrderCreated,
  presentation = 'card',
  showCancelButton = false,
  token,
}: CrossmintTokenCheckoutProps) {
  if (!CROSSMINT_CLIENT_SIDE_API_KEY) {
    return (
      <div role="alert" className={className}>
        Crossmint checkout is not configured.
      </div>
    )
  }

  let serializedToken: SerializedCrossmintToken
  let environment: CrossmintEnvironment
  let target: CrossmintTarget

  try {
    serializedToken = serializeCrossmintToken(token)
    environment = getCrossmintEnvironment(CROSSMINT_CLIENT_SIDE_API_KEY)
    target = getCrossmintTarget(serializedToken, environment)
  } catch (error) {
    return (
      <div
        role="alert"
        className={classNames(
          'rounded-xl border border-accent p-4 text-sm text-red',
          className,
        )}
      >
        {normalizeError(error).message}
      </div>
    )
  }

  return (
    <div className={className}>
      <CrossmintProvider
        apiKey={CROSSMINT_CLIENT_SIDE_API_KEY}
        consoleLogLevel="error"
      >
        <CrossmintCheckoutProvider>
          <CrossmintTokenCheckoutForm
            key={`${serializedToken.chainId}:${serializedToken.address}`}
            amountPresetsUsd={amountPresetsUsd}
            currency={token}
            defaultAmountUsd={defaultAmountUsd}
            defaultExperience={defaultExperience}
            environment={environment}
            onCancel={onCancel}
            onComplete={onComplete}
            onError={onError}
            onOrderCreated={onOrderCreated}
            presentation={presentation}
            showCancelButton={showCancelButton}
            target={target}
            token={serializedToken}
          />
        </CrossmintCheckoutProvider>
      </CrossmintProvider>
    </div>
  )
}

function CrossmintTokenCheckoutForm({
  amountPresetsUsd,
  currency,
  defaultAmountUsd,
  defaultExperience,
  environment,
  onCancel,
  onComplete,
  onError,
  onOrderCreated,
  presentation,
  showCancelButton,
  target,
  token,
}: {
  amountPresetsUsd: readonly string[]
  currency: CrossmintCheckoutToken
  defaultAmountUsd: string
  defaultExperience: CrossmintCheckoutExperience
  environment: CrossmintEnvironment
  onCancel?(): void
  onComplete?(orderId: string): void
  onError?(error: Error): void
  onOrderCreated?(orderId: string): void
  presentation: CrossmintCheckoutPresentation
  showCancelButton: boolean
  target: CrossmintTarget
  token: SerializedCrossmintToken
}) {
  const [amountUsd, setAmountUsd] = useState(defaultAmountUsd)
  const [checkoutExperience, setCheckoutExperience] =
    useState<CrossmintCheckoutExperience>(defaultExperience)
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSession>()
  const [error, setError] = useState<string>()
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [receiptEmail, setReceiptEmail, clearReceiptEmail] =
    useLocalStorage<string>(CROSSMINT_RECEIPT_EMAIL_STORAGE_KEY, '')
  const [walletPayMethod, setWalletPayMethod] =
    useState<WalletPayMethod>('googlePay')
  const amountId = useId()
  const emailId = useId()
  const isMounted = useIsMounted()
  const evmAddress = useAccount('evm')
  const stellarAddress = useAccount('stellar')
  const svmAddress = useAccount('svm')
  const { open } = useSidebar()
  const walletAddress =
    target.walletNamespace === 'evm'
      ? evmAddress
      : target.walletNamespace === 'stellar'
        ? stellarAddress
        : svmAddress
  const visibleReceiptEmail = isMounted ? receiptEmail : ''
  const hasSavedEmail = isEmail(visibleReceiptEmail)
  const showEmailEditor = isEditingEmail || !hasSavedEmail
  const walletPayLabel =
    walletPayMethod === 'applePay' ? 'Apple Pay' : 'Google Pay'

  useEffect(() => {
    const applePaySession = (
      window as typeof window & {
        ApplePaySession?: { canMakePayments(): boolean }
      }
    ).ApplePaySession

    setWalletPayMethod(
      applePaySession?.canMakePayments() ? 'applePay' : 'googlePay',
    )
  }, [])

  function connectWallet(): void {
    open('connect', {
      closeOnConnect: true,
      namespace: target.walletNamespace,
    })
  }

  function resetCheckout(): void {
    setCheckoutSession(undefined)
    setError(undefined)
  }

  function cancelCheckout(): void {
    resetCheckout()
    onCancel?.()
  }

  function reportError(caughtError: unknown): void {
    const normalizedError = normalizeError(caughtError)
    setError(normalizedError.message)
    onError?.(normalizedError)
  }

  function handleEmailChange(value: string): void {
    setIsEditingEmail(true)
    setReceiptEmail(value)
  }

  function handleClearEmail(): void {
    clearReceiptEmail()
    setIsEditingEmail(true)
  }

  function toggleCheckoutExperience(): void {
    resetCheckout()
    setCheckoutExperience((experience) =>
      experience === 'one-tap' ? 'checkout' : 'one-tap',
    )
  }

  async function createOrder(): Promise<void> {
    if (!walletAddress || !hasSavedEmail) return

    const normalizedEmail = visibleReceiptEmail.trim()
    setReceiptEmail(normalizedEmail)
    setError(undefined)
    setIsCreatingOrder(true)

    try {
      const order = await createCrossmintOrder({
        amountUsd,
        receiptEmail: normalizedEmail,
        token,
        walletAddress,
      })
      const session: CheckoutSession = {
        ...order,
        environment,
        experience: checkoutExperience,
        receiptEmail: normalizedEmail,
        token,
        walletAddress,
        walletPayMethod,
      }

      onOrderCreated?.(order.orderId)
      setCheckoutSession(session)
    } catch (caughtError) {
      reportError(caughtError)
    } finally {
      setIsCreatingOrder(false)
    }
  }

  if (checkoutSession) {
    return (
      <CrossmintCheckout
        currency={currency}
        onCancel={cancelCheckout}
        onComplete={onComplete}
        onReset={resetCheckout}
        presentation={presentation}
        session={checkoutSession}
      />
    )
  }

  return (
    <CheckoutShell
      currency={currency}
      presentation={presentation}
      target={target}
    >
      <div className="space-y-5 p-5">
        {target.stagingNotice ? (
          <div className="rounded-xl border border-yellow/40 bg-yellow/10 p-3 text-xs leading-5">
            {target.stagingNotice}
          </div>
        ) : null}

        <div className="space-y-3">
          <label className="text-sm font-medium" htmlFor={amountId}>
            Pay
          </label>
          <TextField
            id={amountId}
            type="number"
            maxDecimals={2}
            min="0.01"
            placeholder="25"
            unit="USD"
            value={amountUsd}
            onValueChange={setAmountUsd}
          />
          {amountPresetsUsd.length > 0 ? (
            <div className="grid grid-flow-col auto-cols-fr gap-2 overflow-x-auto">
              {amountPresetsUsd.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  size="xs"
                  variant={amountUsd === preset ? 'default' : 'secondary'}
                  onClick={() => setAmountUsd(preset)}
                >
                  ${preset}
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        {showEmailEditor ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium" htmlFor={emailId}>
                Receipt email
              </label>
              {visibleReceiptEmail ? (
                <Button
                  type="button"
                  size="sm"
                  variant="link"
                  onClick={handleClearEmail}
                >
                  Clear
                </Button>
              ) : null}
            </div>
            <TextField
              id={emailId}
              type="text"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={visibleReceiptEmail}
              onValueChange={handleEmailChange}
              isError={visibleReceiptEmail.length > 0 && !hasSavedEmail}
            />
            <div className="flex items-center justify-between gap-3">
              {hasSavedEmail ? (
                <Button
                  type="button"
                  size="sm"
                  variant="link"
                  onClick={() => setIsEditingEmail(false)}
                >
                  Done
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary p-3">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Receipt email</div>
              <div className="truncate text-sm">{visibleReceiptEmail}</div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="link"
              onClick={() => setIsEditingEmail(true)}
            >
              Edit
            </Button>
          </div>
        )}

        {walletAddress ? (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary p-3">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">
                External wallet · {target.network}
              </div>
              <div className="font-mono text-sm">
                {shortenAddress(walletAddress)}
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="link"
              onClick={connectWallet}
            >
              Change
            </Button>
          </div>
        ) : (
          <p className="text-xs leading-5 text-muted-foreground">
            Connect the external wallet where you want to receive{' '}
            {`${target.asset}.`}
          </p>
        )}

        {error ? (
          <p role="alert" className="text-sm text-red">
            {error}
          </p>
        ) : null}

        <Checker.Root>
          <Checker.Connect namespace={target.walletNamespace}>
            <Checker.Network chainId={token.chainId}>
              <Button
                type="button"
                className="w-full"
                size="xl"
                loading={isCreatingOrder}
                disabled={!hasSavedEmail || !amountUsd}
                onClick={() => void createOrder()}
              >
                {checkoutExperience === 'one-tap'
                  ? `Buy with ${walletPayLabel}`
                  : 'Continue to secure checkout'}
              </Button>
            </Checker.Network>
          </Checker.Connect>
        </Checker.Root>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-muted-foreground">
            Quote, provider fees, and verification requirements are shown before
            payment.
          </p>
          <Button
            type="button"
            size="sm"
            variant="link"
            onClick={toggleCheckoutExperience}
          >
            {checkoutExperience === 'one-tap'
              ? 'Use card or another payment method'
              : `Use ${walletPayLabel}`}
          </Button>
        </div>

        {showCancelButton && onCancel ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={cancelCheckout}
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </CheckoutShell>
  )
}

function CheckoutShell({
  children,
  currency,
  presentation,
  target,
}: {
  children: ReactNode
  currency: CrossmintCheckoutToken
  presentation: CrossmintCheckoutPresentation
  target: CrossmintTarget
}) {
  const content = (
    <>
      <div
        className={classNames(
          'flex items-center gap-3 border-b border-accent p-5',
          presentation === 'plain' && 'pr-16',
        )}
      >
        <Currency.Icon currency={currency} height={40} width={40} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">
            Buy {currency.symbol}
          </h3>
          <p className="text-sm text-muted-foreground">{target.network}</p>
        </div>
        <div className="rounded-full bg-blue/10 px-2.5 py-1 text-xs font-medium text-blue">
          {target.kind === 'stablecoin' ? 'Onramp' : 'One-click'}
        </div>
      </div>
      {children}
    </>
  )

  return presentation === 'card' ? (
    <Card className="overflow-hidden">{content}</Card>
  ) : (
    <div className="overflow-hidden">{content}</div>
  )
}

function CrossmintCheckout({
  currency,
  onCancel,
  onComplete,
  onReset,
  presentation,
  session,
}: {
  currency: CrossmintCheckoutToken
  onCancel(): void
  onComplete?(orderId: string): void
  onReset(): void
  presentation: CrossmintCheckoutPresentation
  session: CheckoutSession
}) {
  const { resolvedTheme } = useTheme()
  const { order } = useCrossmintCheckout()
  const completionReported = useRef(false)
  const target = getCrossmintTarget(session.token, session.environment)
  const isComplete = order?.phase === 'delivery' || order?.phase === 'completed'
  const allowedMethods =
    session.experience === 'one-tap'
      ? {
          applePay: session.walletPayMethod === 'applePay',
          card: false,
          googlePay: session.walletPayMethod === 'googlePay',
        }
      : { applePay: true, card: true, googlePay: true }

  useEffect(() => {
    if (isComplete && !completionReported.current) {
      completionReported.current = true
      onComplete?.(session.orderId)
    }
  }, [isComplete, onComplete, session.orderId])

  if (isComplete) {
    const content = (
      <div className="p-8 text-center">
        <h3 className="text-lg font-semibold">Payment complete</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {target.asset} will be delivered to your connected external wallet.
        </p>
        <Button type="button" className="mt-6" onClick={onReset}>
          Buy again
        </Button>
      </div>
    )

    return presentation === 'card' ? <Card>{content}</Card> : content
  }

  const content = (
    <>
      <div
        className={classNames(
          'flex items-center gap-3 border-b border-accent p-5',
          presentation === 'plain' && 'pr-16',
        )}
      >
        <Currency.Icon currency={currency} height={40} width={40} />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">Buy {target.asset}</h3>
          <p className="text-sm text-muted-foreground">
            {target.network} · {shortenAddress(session.walletAddress)}
          </p>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CrossmintEmbeddedCheckout
          key={session.orderId}
          orderId={session.orderId}
          clientSecret={session.clientSecret}
          payment={{
            crypto: { enabled: false },
            defaultMethod: 'fiat',
            fiat: { enabled: true, allowedMethods },
            receiptEmail: session.receiptEmail,
          }}
          appearance={{
            rules: {
              DestinationInput: { display: 'hidden' },
              GlobalMessage: { display: 'visible' },
              ReceiptEmailInput: { display: 'hidden' },
            },
            variables: {
              borderRadius: '12px',
              colors: {
                accent: '#2563eb',
                backgroundPrimary:
                  resolvedTheme === 'dark' ? '#111827' : '#ffffff',
                borderPrimary: '#00000000',
                textPrimary: resolvedTheme === 'dark' ? '#ffffff' : '#111827',
                textSecondary: resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280',
              },
            },
          }}
        />
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={onCancel}
        >
          Back
        </Button>
      </div>
    </>
  )

  return presentation === 'card' ? (
    <Card className="overflow-hidden">{content}</Card>
  ) : (
    <div className="overflow-hidden">{content}</div>
  )
}
