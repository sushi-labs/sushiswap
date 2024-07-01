import * as Sentry from '@sentry/nextjs'

export function sendAnalyticsEvent(
  eventName: string,
  eventProperties?: Record<string, unknown>,
) {
  Sentry.captureEvent({
    level: 'info',
    message: eventName,
    extra: { ...eventProperties },
  })
}
