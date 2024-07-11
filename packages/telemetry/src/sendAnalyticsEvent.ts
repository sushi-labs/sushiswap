import { track } from '@vercel/analytics'

export function sendAnalyticsEvent(
  eventName: string,
  eventProperties?: Record<string, unknown>,
) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventProperties)
  }
  track(
    eventName,
    eventProperties as Record<string, string | number | boolean | null>,
  )
}
