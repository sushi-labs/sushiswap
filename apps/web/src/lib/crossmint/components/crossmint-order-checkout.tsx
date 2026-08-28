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
import type { CrossmintSupportedFiatCurrency } from 'src/config'
import { CROSSMINT_CLIENT_SIDE_API_KEY } from '../crossmint-config'
import {
  CROSSMINT_FIAT_PAYMENT_METHOD_LABELS,
  type CrossmintFiatPaymentMethod,
  type CrossmintFiatPaymentMethods,
  getCrossmintAvailableFiatPaymentMethods,
} from '../crossmint-payment-methods'

export type { CrossmintFiatPaymentMethods } from '../crossmint-payment-methods'

export interface CrossmintOrderCheckoutProps {
  allowedMethods: CrossmintFiatPaymentMethods
  className?: string
  clientSecret: string
  onComplete?(orderId: string): void
  orderId: string
  paymentCurrency: CrossmintSupportedFiatCurrency
  receiptEmail: string
}

export interface CrossmintOrderCheckoutSkeletonProps {
  className?: string
}
export function CrossmintOrderCheckoutSkeleton({
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
      <Button type="button" className="w-full mt-4" size="xl" loading>
        Loading payment options
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
  const completionReported = useRef(false)
  const [loadedCheckoutKey, setLoadedCheckoutKey] = useState<string>()
  const [selectedMethod, setSelectedMethod] =
    useState<CrossmintFiatPaymentMethod>()
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const isComplete = order?.phase === 'delivery' || order?.phase === 'completed'
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
  const checkoutKey = `${orderId}:${selectedMethod ?? ''}:${paymentCurrency}:${resolvedTheme ?? ''}`

  useEffect(() => {
    if (isComplete && !completionReported.current) {
      completionReported.current = true
      onComplete?.(orderId)
    }
  }, [isComplete, onComplete, orderId])

  useEffect(() => {
    if (availableMethods.length === 0) return

    setSelectedMethod((currentMethod) =>
      currentMethod && availableMethods.includes(currentMethod)
        ? currentMethod
        : availableMethods[0],
    )
  }, [availableMethods])

  if (!selectedMethod) {
    return <CrossmintOrderCheckoutSkeleton className={className} />
  }

  const selectedAllowedMethods = {
    applePay: selectedMethod === 'applePay',
    card: selectedMethod === 'card',
    googlePay: selectedMethod === 'googlePay',
  }
  const canChangePaymentMethod = availableMethods.length > 1
  const isCheckoutLoading = loadedCheckoutKey !== checkoutKey

  return (
    <div className={classNames('relative', className)}>
      {isCheckoutLoading ? <CrossmintOrderCheckoutSkeleton /> : null}

      <div
        onLoadCapture={(event) => {
          if (event.target instanceof HTMLIFrameElement) {
            setLoadedCheckoutKey(checkoutKey)
          }
        }}
        className={classNames(
          isCheckoutLoading &&
            'pointer-events-none absolute inset-x-0 top-0 opacity-0',
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
