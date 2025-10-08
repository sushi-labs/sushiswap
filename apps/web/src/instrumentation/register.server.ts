import type { Context } from '@opentelemetry/api'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import {
  AggregationTemporality,
  InMemoryMetricExporter,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics'
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  type ReadableSpan,
  type Span,
  type SpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { registerOTel } from '@vercel/otel'

class SpanNameProcessor implements SpanProcessor {
  forceFlush(): Promise<void> {
    return Promise.resolve()
  }
  onStart(span: Span, _parentContext: Context): void {
    if (span.name.startsWith('GET /_next/static')) {
      span.updateName('GET /_next/static')
    } else if (span.name.startsWith('GET /_next/data')) {
      span.updateName('GET /_next/data')
    } else if (span.name.startsWith('GET /_next/image')) {
      span.updateName('GET /_next/image')
    }
  }
  onEnd(_span: ReadableSpan): void {}
  shutdown(): Promise<void> {
    return Promise.resolve()
  }
}

export function register() {
  const isDev = process.env.NODE_ENV === 'development'

  const metricExporter = isDev
    ? new InMemoryMetricExporter(AggregationTemporality.CUMULATIVE)
    : new OTLPMetricExporter({
        url: `https://otlp.analytics-fe.sushi.com/v1/metrics`,
      })

  const metricReader = new PeriodicExportingMetricReader({
    exportIntervalMillis: 15_000,
    exportTimeoutMillis: 5_000,
    exporter: metricExporter,
  })

  const logExporter = isDev
    ? undefined
    : new OTLPLogExporter({
        url: 'https://otlp.analytics-fe.sushi.com/v1/logs',
      })

  const logRecordProcessor = logExporter
    ? new BatchLogRecordProcessor(logExporter)
    : undefined

  const spanExporter = isDev
    ? new ConsoleSpanExporter()
    : new OTLPTraceExporter({
        url: `https://otlp.analytics-fe.sushi.com/v1/traces`,
      })

  const spanProcessors = isDev
    ? []
    : [new BatchSpanProcessor(spanExporter), new SpanNameProcessor()]

  registerOTel({
    serviceName: 'sushiswap-web',
    metricReader,
    logRecordProcessor,
    spanProcessors,
  })
}
