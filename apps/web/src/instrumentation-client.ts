'use client'

import {
  FetchTransport,
  ReactIntegration,
  faro,
  getWebInstrumentations,
  initializeFaro,
} from '@grafana/faro-react'
import {
  type LogEvent,
  LogLevel,
  type TransportItem,
} from '@grafana/faro-web-sdk'

const faroConfig = {
  url: 'https://faro.analytics-fe.sushi.com/collect',
  samplingRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
}

const ignoreUrls = [
  faroConfig.url,
  'https://cca-lite.coinbase.com/*',
  'google-analytics.com',
  'https://cdn.sushi.com',
  'lb.drpc.org',
  'api.sushi.com/quote',
  '/_next/static',
  '/_next/data',
  '/_next/image',
]

const ignoreLogStacks: RegExp[] = [/-extension:\/\//]

if (!faro.api && !process.env.CI) {
  try {
    initializeFaro({
      app: {
        name: 'sushiswap:web',
        version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
      },
      beforeSend: (item) => {
        if (item.type === 'log') {
          const log = item as TransportItem<LogEvent>
          if (
            ignoreLogStacks.some((r) =>
              r.test(log.payload?.context?.stackFrames || ''),
            )
          ) {
            return null
          }
        }
        return item
      },
      consoleInstrumentation: {
        consoleErrorAsLog: true,
        serializeErrors: true,
        disabledLevels: [LogLevel.DEBUG, LogLevel.INFO],
      },
      transports: [
        new FetchTransport({
          url: faroConfig.url,
          concurrency: 2,
          defaultRateLimitBackoffMs: 5_000,
        }),
      ],
      batching: {
        enabled: true,
        itemLimit: 50,
        sendTimeout: 5_000,
      },
      ignoreUrls,
      instrumentations: [
        ...getWebInstrumentations({
          captureConsole: true,
          captureConsoleDisabledLevels: [LogLevel.DEBUG, LogLevel.INFO],
        }),
        // new TracingInstrumentation(),
        new ReactIntegration(),
      ],
    })
  } catch {}
}

export function onRouterTransitionStart(
  url: string,
  _navigationType: 'push' | 'replace' | 'traverse',
) {
  if (!faro.api || !window.location) return

  const newView = `${window.location.protocol}//${window.location.host}${url}`

  // Skip view change for swap page to avoid flooding with view events on amount change
  const currentView = faro.api.getView()
  if (currentView) {
    const currentUrl = new URL(currentView.name, window.location.origin)
      .pathname
    const newViewUrl = new URL(newView, window.location.origin).pathname

    const swapRegex = /^(.*)\/swap$/

    const currentSwapMatch = currentUrl.match(swapRegex)
    const newViewSwapMatch = newViewUrl.match(swapRegex)

    if (
      currentSwapMatch !== null &&
      newViewSwapMatch !== null &&
      currentSwapMatch[0] === newViewSwapMatch[0]
    ) {
      return
    }
  }

  faro.api.setView({
    name: newView,
  })
}

if (!('structuredClone' in globalThis)) {
  import('@ungap/structured-clone').then((mod) => {
    // @ts-ignore
    globalThis.structuredClone = mod.default
  })
}
