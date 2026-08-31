export interface CrossmintFiatPaymentMethods {
  applePay: boolean
  card: boolean
  googlePay: boolean
}

export type CrossmintFiatPaymentMethod = keyof CrossmintFiatPaymentMethods

interface CrossmintPaymentMethodAvailability {
  applePay: boolean
  googlePay: boolean
}

export const CROSSMINT_FIAT_PAYMENT_METHOD_LABELS = {
  applePay: 'Apple Pay',
  googlePay: 'Google Pay',
  card: 'Card',
} as const satisfies Record<CrossmintFiatPaymentMethod, string>

export function getCrossmintAvailableFiatPaymentMethods(
  allowedMethods: CrossmintFiatPaymentMethods,
  availability: CrossmintPaymentMethodAvailability,
): CrossmintFiatPaymentMethod[] {
  const methods: CrossmintFiatPaymentMethod[] = []

  if (allowedMethods.googlePay && availability.googlePay) {
    methods.push('googlePay')
  }

  if (allowedMethods.applePay && availability.applePay) {
    methods.push('applePay')
  }

  if (allowedMethods.card) {
    methods.push('card')
  }

  if (methods.length > 0) return methods

  if (allowedMethods.applePay) methods.push('applePay')
  if (allowedMethods.googlePay) methods.push('googlePay')

  return methods
}

export function isCrossmintGooglePayUserAgent(userAgent: string): boolean {
  return /Android|Chrome\/|CriOS\/|Chromium\/|Edg(?:A|iOS)?\//.test(userAgent)
}
