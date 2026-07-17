export type JsonPrimitive = boolean | null | number | string
export type JsonValue =
  | JsonPrimitive
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue }

export interface JsonRpcRequest {
  readonly id: number | string
  readonly jsonrpc: '2.0'
  readonly method: string
  readonly params?: readonly JsonValue[]
}

export interface JsonRpcSuccess<T> {
  readonly id: number | string
  readonly jsonrpc: '2.0'
  readonly result: T
}

export interface JsonRpcFailure {
  readonly error: {
    readonly code: number
    readonly data?: JsonValue
    readonly message: string
  }
  readonly id: number | string | null
  readonly jsonrpc: '2.0'
}

export type JsonRpcResponse<T> = JsonRpcFailure | JsonRpcSuccess<T>

export type JsonRpcTransport = <T>(
  method: string,
  params?: readonly JsonValue[],
) => Promise<T>

export class JsonRpcError extends Error {
  readonly code: number
  readonly data: JsonValue | undefined

  constructor(message: string, code: number, data?: JsonValue) {
    super(message)
    this.name = 'JsonRpcError'
    this.code = code
    this.data = data
  }
}

export interface HttpJsonRpcTransportOptions {
  readonly fetch?: typeof fetch
  readonly headers?: Readonly<Record<string, string>>
  readonly timeoutMs?: number
  readonly url: string
}

let nextRequestId = 1

export function createHttpJsonRpcTransport({
  fetch: fetchImplementation = fetch,
  headers,
  timeoutMs = 30_000,
  url,
}: HttpJsonRpcTransportOptions): JsonRpcTransport {
  return async function request<T>(
    method: string,
    params: readonly JsonValue[] = [],
  ): Promise<T> {
    const requestId = nextRequestId++
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetchImplementation(url, {
        body: JSON.stringify({
          id: requestId,
          jsonrpc: '2.0',
          method,
          params,
        } satisfies JsonRpcRequest),
        headers: {
          'content-type': 'application/json',
          ...headers,
        },
        method: 'POST',
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(
          `JSON-RPC ${method} failed with HTTP ${response.status}`,
        )
      }

      const body: unknown = await response.json()
      if (!isJsonRpcResponse<T>(body) || body.id !== requestId) {
        throw new Error(`JSON-RPC ${method} returned a malformed response`)
      }

      if ('error' in body) {
        throw new JsonRpcError(
          body.error.message,
          body.error.code,
          body.error.data,
        )
      }

      return body.result
    } finally {
      clearTimeout(timeout)
    }
  }
}

function isJsonRpcResponse<T>(value: unknown): value is JsonRpcResponse<T> {
  if (!isRecord(value) || value.jsonrpc !== '2.0') return false
  if (typeof value.id !== 'number' && typeof value.id !== 'string') return false

  if ('result' in value) return true
  if (!isRecord(value.error)) return false

  return (
    typeof value.error.code === 'number' &&
    typeof value.error.message === 'string'
  )
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function toHexQuantity(value: bigint | number): `0x${string}` {
  return `0x${BigInt(value).toString(16)}`
}

export function fromHexQuantity(value: string): bigint {
  if (!/^0x[0-9a-f]+$/i.test(value)) {
    throw new Error(`Invalid hex quantity: ${value}`)
  }

  return BigInt(value)
}
