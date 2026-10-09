import 'server-only'
import { ZodError, type ZodType } from 'zod'
import {
  VALUE_TRANSFER_API_URL,
  VALUE_TRANSFER_REQUEST_TIMEOUT_MS,
} from './config'
import {
  type ValueTransferBuildUserStepsRequest,
  type ValueTransferBuildUserStepsResponse,
  type ValueTransferChainsResponse,
  type ValueTransferMetadataResponse,
  type ValueTransferQuoteRequest,
  type ValueTransferQuoteResponse,
  type ValueTransferStatusRequest,
  type ValueTransferStatusResponse,
  type ValueTransferSubmitSignatureRequest,
  type ValueTransferTokensRequest,
  type ValueTransferTokensResponse,
  valueTransferBuildUserStepsResponseSchema,
  valueTransferChainsResponseSchema,
  valueTransferMetadataResponseSchema,
  valueTransferQuoteResponseSchema,
  valueTransferStatusResponseSchema,
  valueTransferSubmitSignatureResponseSchema,
  valueTransferTokensResponseSchema,
} from './schemas'

class ValueTransferApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ValueTransferApiError'
  }
}

type Endpoint =
  | 'chains'
  | 'tokens'
  | 'metadata'
  | 'quotes'
  | 'build-user-steps'
  | 'submit-signature'
  | 'status'

async function requestValueTransfer<T>({
  endpoint,
  schema,
  body,
  query,
  quoteId,
}: {
  endpoint: Endpoint
  schema: ZodType<T>
  body?: unknown
  query?: URLSearchParams
  quoteId?: string
}): Promise<T> {
  const isPublic =
    endpoint === 'chains' || endpoint === 'tokens' || endpoint === 'metadata'
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (!isPublic) {
    const key = process.env.LAYERZERO_VALUE_TRANSFER_API_KEY
    if (!key) {
      throw new ValueTransferApiError(503, 'Value Transfer is not configured')
    }
    headers['x-api-key'] = key
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const url = new URL(
    `${VALUE_TRANSFER_API_URL}/${endpoint}${quoteId ? `/${encodeURIComponent(quoteId)}` : ''}`,
  )
  if (query) url.search = query.toString()
  let response: Response
  try {
    response = await fetch(url.toString(), {
      method: body === undefined ? 'GET' : 'POST',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(VALUE_TRANSFER_REQUEST_TIMEOUT_MS),
    })
  } catch {
    throw new ValueTransferApiError(
      502,
      'Value Transfer is temporarily unavailable',
    )
  }

  if (!response.ok) {
    // Never return upstream bodies, request headers, or credentials to clients.
    const status =
      response.status === 429 ? 429 : response.status === 404 ? 404 : 502
    throw new ValueTransferApiError(status, 'Value Transfer request failed')
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new ValueTransferApiError(502, 'Invalid Value Transfer response')
  }
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    throw new ValueTransferApiError(
      502,
      'Value Transfer could not complete the request',
    )
  }
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    throw new ValueTransferApiError(502, 'Invalid Value Transfer response')
  }
  return parsed.data
}

async function requestDiscoveryPages<
  T extends { pagination?: { nextToken?: string } },
>(
  endpoint: 'chains' | 'tokens',
  schema: ZodType<T>,
  query = new URLSearchParams(),
): Promise<T[]> {
  const pages: T[] = []
  const seen = new Set<string>()
  let nextToken: string | undefined
  do {
    if (nextToken) query.set('pagination[nextToken]', nextToken)
    const page = await requestValueTransfer({
      endpoint,
      schema,
      query,
    })
    pages.push(page)
    nextToken = page.pagination?.nextToken
    if (nextToken && (seen.has(nextToken) || seen.size >= 100)) {
      throw new ValueTransferApiError(502, 'Invalid Value Transfer pagination')
    }
    if (nextToken) seen.add(nextToken)
  } while (nextToken)
  return pages
}

export async function getValueTransferChains(): Promise<ValueTransferChainsResponse> {
  const pages = await requestDiscoveryPages(
    'chains',
    valueTransferChainsResponseSchema,
  )
  return { chains: pages.flatMap((page) => page.chains) }
}

export async function getValueTransferTokens(
  request: ValueTransferTokensRequest,
): Promise<ValueTransferTokensResponse> {
  const query = new URLSearchParams()
  if (request.transferrableFromChainKey)
    query.set('transferrableFromChainKey', request.transferrableFromChainKey)
  if (request.transferrableFromTokenAddress)
    query.set(
      'transferrableFromTokenAddress',
      request.transferrableFromTokenAddress,
    )
  const pages = await requestDiscoveryPages(
    'tokens',
    valueTransferTokensResponseSchema,
    query,
  )
  return { tokens: pages.flatMap((page) => page.tokens) }
}

export async function getValueTransferMetadata(): Promise<ValueTransferMetadataResponse> {
  return requestValueTransfer({
    endpoint: 'metadata',
    schema: valueTransferMetadataResponseSchema,
  })
}

export async function getValueTransferQuote(
  request: ValueTransferQuoteRequest,
): Promise<ValueTransferQuoteResponse> {
  return requestValueTransfer({
    endpoint: 'quotes',
    schema: valueTransferQuoteResponseSchema,
    body: request,
  })
}

export async function buildValueTransferUserSteps(
  request: ValueTransferBuildUserStepsRequest,
): Promise<ValueTransferBuildUserStepsResponse> {
  return requestValueTransfer({
    endpoint: 'build-user-steps',
    schema: valueTransferBuildUserStepsResponseSchema,
    body: request,
  })
}

export async function submitValueTransferSignature(
  request: ValueTransferSubmitSignatureRequest,
): Promise<Record<string, never>> {
  return requestValueTransfer({
    endpoint: 'submit-signature',
    schema: valueTransferSubmitSignatureResponseSchema,
    body: request,
  })
}

export async function getValueTransferStatus(
  request: ValueTransferStatusRequest,
): Promise<ValueTransferStatusResponse> {
  const query = new URLSearchParams()
  if (request.txHash) query.set('txHash', request.txHash)
  try {
    return await requestValueTransfer({
      endpoint: 'status',
      schema: valueTransferStatusResponseSchema,
      quoteId: request.quoteId,
      query,
    })
  } catch (error) {
    if (error instanceof ValueTransferApiError && error.status === 404)
      return { status: 'UNKNOWN' }
    throw error
  }
}

export async function readValueTransferRequest<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<T> {
  const body = await request.text()
  if (body.length > 32_768)
    throw new ValueTransferApiError(413, 'Value Transfer request is too large')
  return schema.parse(JSON.parse(body))
}

export function createValueTransferErrorResponse(error: unknown): Response {
  let status = 500
  let message = 'Value Transfer request failed'
  if (error instanceof ValueTransferApiError) {
    status = error.status
    message = error.message
  } else if (error instanceof ZodError || error instanceof SyntaxError) {
    status = 400
    message = 'Invalid Value Transfer request'
  }
  return Response.json(
    { message },
    { status, headers: { 'Cache-Control': 'no-store' } },
  )
}
