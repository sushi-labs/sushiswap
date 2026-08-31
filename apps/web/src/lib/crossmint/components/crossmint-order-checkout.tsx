'use client'

import {
  CrossmintCheckoutProvider,
  CrossmintEmbeddedCheckout,
  CrossmintProvider,
  useCrossmintCheckout,
} from '@crossmint/client-sdk-react-ui'
import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { Button, Collapsible, SkeletonText, classNames } from '@sushiswap/ui'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDerivedStateFiatBuy } from 'src/app/(networks)/(evm)/[chainId]/(trade)/fiat/_ui/derivedstate-fiat-buy-provider'
import type { CrossmintSupportedFiatCurrency } from 'src/config'
import { CROSSMINT_CLIENT_SIDE_API_KEY } from '../crossmint-config'
import {
  CROSSMINT_FIAT_PAYMENT_METHOD_LABELS,
  type CrossmintFiatPaymentMethod,
  type CrossmintFiatPaymentMethods,
  getCrossmintAvailableFiatPaymentMethods,
} from '../crossmint-payment-methods'

interface CrossmintOrderCheckoutProps {
  allowedMethods: CrossmintFiatPaymentMethods
  className?: string
  clientSecret: string
  onComplete?(orderId: string): void
  orderId: string
  paymentCurrency: CrossmintSupportedFiatCurrency
  receiptEmail: string
}

interface CrossmintOrderCheckoutSkeletonProps {
  type: 'memecoin' | 'stablecoin'
  className?: string
}
export function CrossmintOrderCheckoutSkeleton({
  type,
  className,
}: CrossmintOrderCheckoutSkeletonProps) {
  return (
    <div className={classNames('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-gray-700 dark:text-slate-300">
          Pay with
        </span>
        <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-slate-100">
          <SkeletonText className="min-w-14" fontSize="sm" />
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </div>
      {type === 'stablecoin' ? (
        <>
          <div className="w-full h-px bg-accent" />
          <div className="flex px-1 items-center justify-between gap-2 text-base">
            <span className="font-medium text-gray-700 dark:text-slate-300">
              You receive
            </span>
            <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-slate-100">
              <SkeletonText className="min-w-14" fontSize="default" />
              <ChevronDownIcon className="h-6 w-6 -rotate-90" />
            </div>
          </div>
        </>
      ) : null}
      <Button type="button" className="w-full mt-4" size="xl" loading>
        Loading
      </Button>
      <div>
        <SkeletonText className="min-w-full" fontSize="sm" />
        <SkeletonText className="max-w-[14rem] mx-auto" fontSize="sm" />
      </div>
    </div>
  )
}

export function CrossmintOrderCheckout({
  allowedMethods,
  className,
  clientSecret,
  onComplete,
  orderId,
  paymentCurrency,
  receiptEmail,
}: CrossmintOrderCheckoutProps) {
  if (!CROSSMINT_CLIENT_SIDE_API_KEY) {
    return <p role="alert">Crossmint checkout is not configured.</p>
  }

  return (
    <CrossmintProvider
      apiKey={CROSSMINT_CLIENT_SIDE_API_KEY}
      consoleLogLevel="error"
    >
      <CrossmintCheckoutProvider>
        <CrossmintOrderCheckoutContent
          allowedMethods={allowedMethods}
          className={className}
          clientSecret={clientSecret}
          onComplete={onComplete}
          orderId={orderId}
          paymentCurrency={paymentCurrency}
          receiptEmail={receiptEmail}
        />
      </CrossmintCheckoutProvider>
    </CrossmintProvider>
  )
}

function CrossmintOrderCheckoutContent({
  allowedMethods,
  className,
  clientSecret,
  onComplete,
  orderId,
  paymentCurrency,
  receiptEmail,
}: CrossmintOrderCheckoutProps) {
  const { applePay, card, googlePay } = allowedMethods
  const { resolvedTheme } = useTheme()
  const { order } = useCrossmintCheckout()
  const [isReady, setIsReady] = useState(false)
  const completionReported = useRef(false)
  const [selectedMethod, setSelectedMethod] =
    useState<CrossmintFiatPaymentMethod>()
  const selectedMethodRef = useRef(selectedMethod)
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const isPaymentComplete =
    order?.phase === 'delivery' || order?.phase === 'completed'
  const {
    state: { token },
  } = useDerivedStateFiatBuy()
  const availableMethods = useMemo(
    () =>
      getCrossmintAvailableFiatPaymentMethods(
        { applePay, card, googlePay },
        {
          applePay: true,
          googlePay: true,
        },
      ),

    [applePay, card, googlePay],
  )
  const checkoutKey = `${orderId}:${selectedMethod ?? ''}`

  useEffect(() => {
    if (isPaymentComplete && !completionReported.current) {
      completionReported.current = true
      onComplete?.(orderId)
    }
  }, [isPaymentComplete, onComplete, orderId])

  useEffect(() => {
    if (availableMethods.length === 0) return

    setSelectedMethod((currentMethod) =>
      currentMethod && availableMethods.includes(currentMethod)
        ? currentMethod
        : availableMethods[0],
    )
  }, [availableMethods])

  useEffect(() => {
    if (selectedMethodRef.current !== selectedMethod) {
      setIsReady(false)
    }
    selectedMethodRef.current = selectedMethod
  }, [selectedMethod])

  const selectedAllowedMethods = useMemo(() => {
    return {
      applePay: selectedMethod === 'applePay',
      card: selectedMethod === 'card',
      googlePay: selectedMethod === 'googlePay',
    }
  }, [selectedMethod])

  const canChangePaymentMethod = availableMethods.length > 1

  // reveal the button once the iframe has content (ui:height.changed)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!e.origin.endsWith('.crossmint.com')) return
      const event = (e.data as { event?: string } | null)?.event
      if (
        event === 'ui:height.changed' ||
        event === 'ui:express-checkout.ready'
      ) {
        setIsReady(true)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  if (!selectedMethod) {
    return (
      <CrossmintOrderCheckoutSkeleton
        type={token?.token?.symbol === 'USDC' ? 'stablecoin' : 'memecoin'}
        className={className}
      />
    )
  }

  return (
    <div
      className={classNames(
        'relative',
        !isReady ? 'overflow-hidden' : '',
        className,
      )}
    >
      {!isReady ? (
        <CrossmintOrderCheckoutSkeleton
          type={token?.token?.symbol === 'USDC' ? 'stablecoin' : 'memecoin'}
        />
      ) : null}

      <div
        onLoadCapture={(event) => {
          // Card does not emit the express-checkout ready event.
          if (
            selectedMethod === 'card' &&
            event.target instanceof HTMLIFrameElement
          ) {
            setIsReady(true)
          }
        }}
        className={classNames(
          !isReady ? 'pointer-events-none absolute invisible h-0' : '',
        )}
      >
        <div className="flex items-center justify-between gap-2 pb-1 text-sm">
          <span className="font-medium text-gray-700 dark:text-slate-300">
            Pay with
          </span>
          {canChangePaymentMethod ? (
            <button
              type="button"
              className="flex items-center gap-1 font-semibold text-gray-900 dark:text-slate-100"
              aria-expanded={showPaymentMethods}
              onClick={() => setShowPaymentMethods((open) => !open)}
            >
              {CROSSMINT_FIAT_PAYMENT_METHOD_LABELS[selectedMethod]}
              <ChevronDownIcon
                className={classNames(
                  'h-4 w-4 transition-transform',
                  showPaymentMethods && 'rotate-180',
                )}
              />
            </button>
          ) : (
            <span className="font-semibold text-gray-900 dark:text-slate-100">
              {CROSSMINT_FIAT_PAYMENT_METHOD_LABELS[selectedMethod]}
            </span>
          )}
        </div>

        <Collapsible open={showPaymentMethods && canChangePaymentMethod}>
          <div
            className="grid gap-2 pb-1"
            style={{
              gridTemplateColumns: `repeat(${availableMethods.length}, minmax(0, 1fr))`,
            }}
          >
            {availableMethods.map((method) => (
              <Button
                key={method}
                type="button"
                size="sm"
                variant={method === selectedMethod ? 'secondary' : 'ghost'}
                onClick={() => {
                  setSelectedMethod(method)
                  setShowPaymentMethods(false)
                }}
              >
                {CROSSMINT_FIAT_PAYMENT_METHOD_LABELS[method]}
              </Button>
            ))}
          </div>
        </Collapsible>

        <CrossmintEmbeddedCheckout
          key={checkoutKey}
          orderId={orderId}
          clientSecret={clientSecret}
          payment={{
            crypto: { enabled: false },
            defaultMethod: 'fiat',
            fiat: {
              allowedMethods: selectedAllowedMethods,
              defaultCurrency: paymentCurrency,
              enabled: true,
            },
            receiptEmail,
          }}
          appearance={{
            rules: {
              DestinationInput: { display: 'hidden' },
              GlobalMessage: { display: 'visible' },
              ReceiptEmailInput: { display: 'hidden' },
              PrimaryButton: {
                colors: {
                  background: '#3b82f6',
                  text: 'white',
                },
                hover: {
                  colors: {
                    background: '#2563eb',
                    text: 'white',
                  },
                },
              },
            },
            variables: {
              borderRadius: '12px',
              spacingUnit: '4px',
              colors: {
                accent: '#2563eb',
                backgroundPrimary:
                  resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderPrimary:
                  resolvedTheme === 'dark' ? '#ffffff14' : '#00000014',
                textPrimary: resolvedTheme === 'dark' ? '#ffffff' : '#111827',
                textSecondary: resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280',
              },
            },
          }}
        />
      </div>
    </div>
  )
}

//can use this if we only want to show if Apple Pay is available without a qr code
// interface ApplePayWindow extends Window {
//   ApplePaySession?: {
//     canMakePayments(): boolean
//   }
// }

// function canUseApplePay(): boolean {
//   try {
//     return Boolean(
//       (window as ApplePayWindow).ApplePaySession?.canMakePayments(),
//     )
//   } catch {
//     return false
//   }
// }
