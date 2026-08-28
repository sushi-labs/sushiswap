'use client'

import {
  CrossmintCheckoutProvider,
  CrossmintEmbeddedCheckout,
  CrossmintProvider,
  useCrossmintCheckout,
} from '@crossmint/client-sdk-react-ui'
import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { Button, Collapsible, classNames } from '@sushiswap/ui'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CrossmintSupportedFiatCurrency } from 'src/config'
import { CROSSMINT_CLIENT_SIDE_API_KEY } from '../crossmint-config'
import {
  CROSSMINT_FIAT_PAYMENT_METHOD_LABELS,
  type CrossmintFiatPaymentMethod,
  type CrossmintFiatPaymentMethods,
  type CrossmintPaymentMethodAvailability,
  getCrossmintAvailableFiatPaymentMethods,
  isCrossmintGooglePayUserAgent,
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
  const [paymentMethodAvailability, setPaymentMethodAvailability] =
    useState<CrossmintPaymentMethodAvailability>()
  const [selectedMethod, setSelectedMethod] =
    useState<CrossmintFiatPaymentMethod>()
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const isComplete = order?.phase === 'delivery' || order?.phase === 'completed'
  const availableMethods = useMemo(
    () =>
      paymentMethodAvailability
        ? getCrossmintAvailableFiatPaymentMethods(
            { applePay, card, googlePay },
            paymentMethodAvailability,
          )
        : [],
    [applePay, card, googlePay, paymentMethodAvailability],
  )

  useEffect(() => {
    if (isComplete && !completionReported.current) {
      completionReported.current = true
      onComplete?.(orderId)
    }
  }, [isComplete, onComplete, orderId])

  useEffect(() => {
    setPaymentMethodAvailability({
      applePay: canUseApplePay(),
      googlePay: isCrossmintGooglePayUserAgent(navigator.userAgent),
    })
  }, [])

  useEffect(() => {
    if (availableMethods.length === 0) return

    setSelectedMethod((currentMethod) =>
      currentMethod && availableMethods.includes(currentMethod)
        ? currentMethod
        : availableMethods[0],
    )
  }, [availableMethods])

  if (paymentMethodAvailability && availableMethods.length === 0) {
    return <p role="alert">No payment methods are available.</p>
  }

  if (!selectedMethod) {
    return (
      <Button type="button" fullWidth size="xl" loading>
        Loading payment options
      </Button>
    )
  }

  const selectedAllowedMethods = {
    applePay: selectedMethod === 'applePay',
    card: selectedMethod === 'card',
    googlePay: selectedMethod === 'googlePay',
  }
  const canChangePaymentMethod = availableMethods.length > 1

  return (
    <div className={classNames(className)}>
      <div className="flex items-center justify-between gap-2 text-sm">
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
        <div className="grid grid-cols-2 gap-2 pb-1">
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
        key={`${orderId}:${selectedMethod}`}
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
  )
}

interface ApplePayWindow extends Window {
  ApplePaySession?: {
    canMakePayments(): boolean
  }
}

function canUseApplePay(): boolean {
  try {
    return Boolean(
      (window as ApplePayWindow).ApplePaySession?.canMakePayments(),
    )
  } catch {
    return false
  }
}
