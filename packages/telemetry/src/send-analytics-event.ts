declare const window: Window &
  typeof globalThis & { dataLayer: Record<string, unknown>[] }

export function sendAnalyticsEvent(
  eventName: string,
  eventProperties?: Record<string, unknown>,
) {
  typeof window.gtag !== 'undefined' &&
    window.gtag('event', eventName, eventProperties)

  typeof window.dataLayer !== 'undefined' &&
    window.dataLayer.push({
      event: eventName,
      ...eventProperties,
    })
}
