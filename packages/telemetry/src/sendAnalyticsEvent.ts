export function sendAnalyticsEvent(
  eventName: string,
  eventProperties?: Record<string, unknown>,
) {
  console.log('sendAnalyticsEvent', eventName, eventProperties)
  console.log('window', window)
  typeof window.gtag !== 'undefined' &&
    window.gtag('event', eventName, eventProperties)
}
