import type { Page } from '@playwright/test'
import type {
  FetchHandlerResult,
  NextFixture,
} from 'next/experimental/testmode/playwright.js'
import * as z from 'zod'
import { chainId } from './constants'
import { account } from './fork'

const telemetryHosts = [
  'ad.doubleclick.net',
  'secure.adnxs.com',
  'www.google.com',
  'region1.google-analytics.com',
  'www.google-analytics.com',
  'www.googletagmanager.com',
]

export type MockHandler = (
  request: Request,
) => Promise<Response | undefined> | Response | undefined

const walletTransaction = z
  .object({
    id: z.union([z.number(), z.string()]),
    method: z.literal('eth_sendTransaction'),
    params: z.tuple([z.object({ gas: z.string().optional() }).passthrough()]),
  })
  .passthrough()

const gasEstimate = z.union([
  z.object({ result: z.string().regex(/^0x[0-9a-f]+$/i) }),
  z.object({
    error: z.object({ code: z.number(), message: z.string() }).passthrough(),
  }),
])

/** One dispatcher owns browser and server fetches; RPC always takes precedence. */
export class NetworkMocks {
  readonly requests: { method: string; url: string; mocked: boolean }[] = []
  private readonly handlers: MockHandler[] = []
  private readonly rpcHandlers: MockHandler[] = []

  constructor(readonly rpcUrl: string) {}

  add(handler: MockHandler): void {
    this.handlers.push(handler)
  }

  addRpc(handler: MockHandler): void {
    this.rpcHandlers.push(handler)
  }

  isRpc(url: URL): boolean {
    return (
      ['127.0.0.1', 'localhost'].includes(url.hostname) &&
      url.port === new URL(this.rpcUrl).port
    )
  }

  async dispatch(request: Request): Promise<FetchHandlerResult> {
    const url = new URL(request.url)
    if (this.isRpc(url)) {
      for (const handler of this.rpcHandlers.toReversed()) {
        const response = await handler(request.clone())
        if (response) return response
      }
      let body = await request.text()
      const transaction = walletTransaction.safeParse(JSON.parse(body))
      if (transaction.success && transaction.data.params[0].gas === undefined) {
        // Wagmi's mock skips the gas estimation an injected wallet performs.
        // Use the public RPC estimator instead of Anvil's gasless-send fallback.
        // Route the estimate through our dispatcher so failure scenarios apply.
        const estimate = await this.dispatch(
          new Request(this.rpcUrl, {
            method: 'POST',
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: transaction.data.id,
              method: 'eth_estimateGas',
              params: [...transaction.data.params, 'pending'],
            }),
          }),
        )
        if (!(estimate instanceof Response))
          throw new Error('Expected gas estimate response')
        const result = gasEstimate.parse(await estimate.json())
        if ('error' in result)
          return Response.json({
            jsonrpc: '2.0',
            id: transaction.data.id,
            error: result.error,
          })
        transaction.data.params[0].gas = result.result
        body = JSON.stringify(transaction.data)
      }
      // Forward bodies explicitly; spreading a Request loses its stream/method.
      return fetch(this.rpcUrl, {
        method: request.method,
        headers: { 'content-type': 'application/json' },
        body,
        signal: AbortSignal.timeout(60_000),
      })
    }
    for (const handler of this.handlers.toReversed()) {
      const response = await handler(request.clone())
      if (response) {
        this.requests.push({
          method: request.method,
          url: url.origin + url.pathname,
          mocked: true,
        })
        return response
      }
    }
    if (
      url.hostname === 'edge-config.vercel.com' &&
      url.pathname.endsWith('/item/swap')
    )
      return Response.json({ maintenance: false })
    if (url.pathname === '/api/config/swap')
      return Response.json({ maintenance: false })
    if (url.pathname === `/price/v1/${chainId}`) return Response.json({})
    if (/\/(quote|swap)\/v7\//.test(url.pathname)) {
      // Intermediate token/amount edits may have no recorded quote. Executable
      // swaps, however, must match a recording exactly and must never go live.
      if (url.pathname.startsWith('/quote/'))
        return Response.json({ status: 'NoWay' })
      throw new Error(
        `Unrecorded swap request: ${url.pathname} ${url.searchParams.toString()}`,
      )
    }
    if (
      url.hostname === 'api.trmlabs.com' &&
      url.pathname === '/public/v1/sanctions/screening'
    ) {
      return Response.json([{ address: account.address, isSanctioned: false }])
    }
    if (telemetryHosts.includes(url.hostname))
      return new Response(null, { status: 204 })
    this.requests.push({
      method: request.method,
      url: url.origin + url.pathname,
      mocked: false,
    })
    if (url.pathname === '/api/graphql') {
      const body: unknown = await request.json()
      const operation =
        body && typeof body === 'object' && 'operationName' in body
          ? body.operationName
          : 'unknown'
      throw new Error(`Unmocked GraphQL operation: ${String(operation)}`)
    }
    // Static assets and Next internals are handled by Playwright's route fallback.
    // No unrecorded application data request may silently reach a live service.
    throw new Error(
      `Unmocked fetch: ${request.method} ${url.origin}${url.pathname}`,
    )
  }

  async install(page: Page, next: NextFixture): Promise<void> {
    next.onFetch((request) => this.dispatch(request))
    await page.route(
      (url) => telemetryHosts.includes(url.hostname),
      (route) => route.fulfill({ status: 204, body: '' }),
    )
    // Next's fixture passes same-origin requests through. Handle our local API
    // fixture and wallet RPC explicitly, preserving Next headers on other routes.
    await page.route(
      (url) => this.isRpc(url) || url.pathname === '/api/config/swap',
      async (route) => {
        const request = route.request()
        const response = await this.dispatch(
          new Request(request.url(), {
            method: request.method(),
            headers: request.headers(),
            body: request.postData(),
          }),
        )
        if (!(response instanceof Response))
          throw new Error('Expected a mocked response')
        await route.fulfill({
          status: response.status,
          headers: Object.fromEntries(response.headers),
          body: Buffer.from(await response.arrayBuffer()),
        })
      },
    )
  }
}
