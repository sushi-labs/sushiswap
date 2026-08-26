import { z } from 'zod'
import {
  CROSSMINT_CLIENT_SIDE_API_KEY,
  getCrossmintApiUrl,
  getCrossmintEnvironment,
} from './crossmint-config'
import type {
  CrossmintCheckoutTokenAvailability,
  CrossmintCheckoutTokenClass,
  CrossmintCheckoutTokensResponse,
} from './types'

const crossmintCheckoutTokensResponseSchema: z.ZodType<CrossmintCheckoutTokensResponse> =
  z.object({
    data: z.array(
      z.object({
        available: z.boolean(),
        features: z.object({
          creditCardPayment: z.boolean(),
        }),
        token: z.string().min(1),
      }),
    ),
    nextCursor: z
      .string()
      .min(1)
      .nullish()
      .transform((cursor) => cursor ?? undefined),
    previousCursor: z
      .string()
      .min(1)
      .nullish()
      .transform((cursor) => cursor ?? undefined),
  })

export interface FetchCrossmintCheckoutTokensPageInput {
  chains?: readonly string[]
  cursor?: string
  limit?: number
  signal?: AbortSignal
  tokenClasses?: readonly CrossmintCheckoutTokenClass[]
}

function getErrorMessage(payload: unknown): string | undefined {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message
  }

  return undefined
}

function parseResponseBody(body: string): unknown {
  if (!body) return undefined

  try {
    return JSON.parse(body)
  } catch {
    return body
  }
}

function appendListQueryParameter(
  url: URL,
  name: 'chains' | 'tokenClasses',
  values?: readonly string[],
): void {
  const value = values
    ?.map((item) => item.trim())
    .filter(Boolean)
    .join(',')

  if (value) {
    url.searchParams.set(name, value)
  }
}
export async function fetchCrossmintCheckoutTokensPage({
  chains,
  cursor,
  limit,
  signal,
  tokenClasses,
}: FetchCrossmintCheckoutTokensPageInput): Promise<CrossmintCheckoutTokensResponse> {
  if (!CROSSMINT_CLIENT_SIDE_API_KEY) {
    throw new Error('NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY is not set')
  }

  if (
    limit !== undefined &&
    (!Number.isInteger(limit) || limit < 1 || limit > 100)
  ) {
    throw new Error('Crossmint checkout token limit must be between 1 and 100')
  }

  const environment = getCrossmintEnvironment(CROSSMINT_CLIENT_SIDE_API_KEY)
  const url = new URL(`${getCrossmintApiUrl(environment)}/2024-09-26/tokens`)

  appendListQueryParameter(url, 'chains', chains)
  appendListQueryParameter(url, 'tokenClasses', tokenClasses)

  if (cursor) {
    url.searchParams.set('cursor', cursor)
  }

  if (limit !== undefined) {
    url.searchParams.set('limit', String(limit))
  }

  const response = await fetch(url, {
    headers: { 'X-API-KEY': CROSSMINT_CLIENT_SIDE_API_KEY },
    signal,
  })
  const payload = parseResponseBody(await response.text())

  if (!response.ok) {
    const message = getErrorMessage(payload)
    throw new Error(
      message
        ? `Crossmint checkout tokens request failed: ${message}`
        : `Crossmint checkout tokens request failed with status ${response.status}`,
    )
  }

  return crossmintCheckoutTokensResponseSchema.parse(payload)
}

export function getAvailableCrossmintCheckoutTokens(
  pages: readonly CrossmintCheckoutTokensResponse[],
): CrossmintCheckoutTokenAvailability[] {
  return pages.flatMap((page) => page.data.filter((token) => token.available))
}
