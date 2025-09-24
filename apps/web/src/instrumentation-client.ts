'use client'

// import { logs } from '@opentelemetry/api-logs'
// import { metrics } from '@opentelemetry/api-metrics'
// import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
// import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
// import { registerInstrumentations } from '@opentelemetry/instrumentation'
// import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'
// import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
// import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction'
// import { resourceFromAttributes } from '@opentelemetry/resources'
// import {
//   BatchLogRecordProcessor,
//   InMemoryLogRecordExporter,
//   LoggerProvider,
// } from '@opentelemetry/sdk-logs'
// import {
//   AggregationTemporality,
//   InMemoryMetricExporter,
//   MeterProvider,
//   PeriodicExportingMetricReader,
// } from '@opentelemetry/sdk-metrics'
// import {
//   BatchSpanProcessor,
//   InMemorySpanExporter,
// } from '@opentelemetry/sdk-trace-base'
// import {
//   ParentBasedSampler,
//   TraceIdRatioBasedSampler,
// } from '@opentelemetry/sdk-trace-base'
// import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
// import {
//   ATTR_SERVICE_NAME,
//   ATTR_SERVICE_VERSION,
// } from '@opentelemetry/semantic-conventions'

// declare global {
//   var __sushi_otlp_inited__: boolean | undefined
// }

// if (typeof window !== 'undefined' && !globalThis.__sushi_otlp_inited__) {
//   const isDev = process.env.NODE_ENV === 'development'

//   const resource = resourceFromAttributes({
//     [ATTR_SERVICE_NAME]: 'sushiswap-web',
//     [ATTR_SERVICE_VERSION]:
//       process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'unknown',
//   })

//   // -------- Traces (browser) --------
//   const traceExporter = isDev
//     ? new InMemorySpanExporter()
//     : new OTLPTraceExporter({
//         url: 'https://otlp.analytics-fe.sushi.com/v1/traces',
//       })

//   const tracerProvider = new WebTracerProvider({
//     resource,
//     spanProcessors: [
//       new BatchSpanProcessor(traceExporter, {
//         maxQueueSize: 2048,
//         maxExportBatchSize: 512,
//         scheduledDelayMillis: 3_000,
//         exportTimeoutMillis: 10_000,
//       }),
//     ],
//     sampler: new ParentBasedSampler({
//       root: new TraceIdRatioBasedSampler(isDev ? 1.0 : 0.1), // 100% dev, 10% prod
//     }),
//   })

//   tracerProvider.register()

//   // -------- Metrics (browser) --------
//   const metricExporter = isDev
//     ? new InMemoryMetricExporter(AggregationTemporality.CUMULATIVE)
//     : new OTLPMetricExporter({
//         url: 'https://otlp.analytics-fe.sushi.com/v1/metrics',
//       })

//   const meterProvider = new MeterProvider({
//     resource,
//     readers: [
//       new PeriodicExportingMetricReader({
//         exporter: metricExporter,
//         exportIntervalMillis: 5_000,
//         exportTimeoutMillis: 5_000,
//       }),
//     ],
//   })

//   metrics.setGlobalMeterProvider(meterProvider)

//   // -------- Logs (browser) --------
//   const logsExporter = isDev
//     ? new InMemoryLogRecordExporter()
//     : new OTLPLogExporter({
//         url: 'https://otlp.analytics-fe.sushi.com/v1/logs',
//       })

//   const loggerProvider = new LoggerProvider({
//     resource,
//     processors: [
//       new BatchLogRecordProcessor(logsExporter, {
//         maxQueueSize: 2048,
//         maxExportBatchSize: 512,
//         scheduledDelayMillis: 3_000,
//         exportTimeoutMillis: 10_000,
//       }),
//     ],
//   })

//   logs.setGlobalLoggerProvider(loggerProvider)

//   registerInstrumentations({
//     instrumentations: [
//       new DocumentLoadInstrumentation(),
//       new UserInteractionInstrumentation(),
//       new FetchInstrumentation({
//         // Don’t trace calls to your collector to avoid loops
//         ignoreUrls: [/\/v1\/logs$/, /\/v1\/traces$/, /\/v1\/metrics$/],
//         propagateTraceHeaderCorsUrls: [/.*/],
//       }),
//     ],
//     meterProvider,
//     tracerProvider,
//     loggerProvider,
//   })

//   globalThis.__sushi_otlp_inited__ = true

//   // ---- Flush on unload ----
//   const flushAll = async () => {
//     const timeout = new Promise((r) => setTimeout(r, 1000))

//     await Promise.race([
//       Promise.all([
//         tracerProvider.forceFlush().catch(),
//         meterProvider.forceFlush?.().catch(),
//         loggerProvider.forceFlush().catch(),
//       ]),
//       timeout,
//     ])
//   }

//   const handleVisibility = () => {
//     if (document.visibilityState === 'hidden') {
//       flushAll()
//     }
//   }
//   window.addEventListener('visibilitychange', handleVisibility)
//   window.addEventListener('pagehide', flushAll)
// }

import {
  ReactIntegration,
  faro,
  getWebInstrumentations,
  initializeFaro,
} from '@grafana/faro-react'
import { LogLevel } from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'

const faroConfig = {
  url: 'https://faro.analytics-fe.sushi.com/collect',
  samplingRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
}

const ignoreUrls = [
  faroConfig.url,
  'https://cca-lite.coinbase.com/*',
  'google-analytics.com',
  'https://cdn.sushi.com',
  '/_next/static',
  '/_next/data',
  '/_next/image',
]

if (!faro.api && !process.env.CI) {
  try {
    initializeFaro({
      url: faroConfig.url,
      app: {
        name: 'sushiswap:web',
        version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
      },
      consoleInstrumentation: {
        consoleErrorAsLog: true,
        serializeErrors: true,
        disabledLevels: [LogLevel.DEBUG, LogLevel.INFO],
      },
      // pageTracking: {},
      ignoreUrls,
      instrumentations: [
        // Mandatory, omits default instrumentations otherwise.
        ...getWebInstrumentations({
          captureConsole: true,
          captureConsoleDisabledLevels: [LogLevel.DEBUG, LogLevel.INFO],
        }),
        // Tracing package to get end-to-end visibility for HTTP requests.
        new TracingInstrumentation(),
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

  faro.api.setView({
    name: `${window.location.protocol}//${window.location.host}${url}`,
  })
}
