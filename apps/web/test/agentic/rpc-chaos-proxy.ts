import {
  type IncomingMessage,
  type Server,
  type ServerResponse,
  createServer,
} from 'node:http'
import { connect as connectTcp } from 'node:net'
import type { Duplex } from 'node:stream'
import { connect as connectTls } from 'node:tls'
import {
  type JsonRpcRequest,
  type JsonRpcResponse,
  type JsonValue,
  isRecord,
  toHexQuantity,
} from './json-rpc'
import {
  type RpcFaultProfile,
  RpcFaultScheduler,
  type ScheduledRpcFault,
} from './rpc-chaos'

export interface RpcExchangeArtifact {
  readonly faults: readonly ScheduledRpcFault[]
  readonly request: JsonRpcRequest | readonly JsonRpcRequest[]
  readonly response?: unknown
}

export interface RpcChaosProxyOptions {
  readonly fetch?: typeof fetch
  readonly host?: string
  readonly onExchange?: (artifact: RpcExchangeArtifact) => Promise<void> | void
  readonly port: number
  readonly profile: RpcFaultProfile
  readonly targetRpcUrl: string
}

export interface StartedRpcChaosProxy {
  readonly url: string
  close(): Promise<void>
}

export async function startRpcChaosProxy(
  options: RpcChaosProxyOptions,
): Promise<StartedRpcChaosProxy> {
  const host = options.host ?? '127.0.0.1'
  const scheduler = new RpcFaultScheduler(options.profile)
  const server = createServer((request, response) => {
    void handleRpcRequest(options, scheduler, request, response)
  })
  server.on('upgrade', (request, socket, head) => {
    const faults = scheduler.schedule({ method: 'websocket' })
    if (faults.some(({ kind }) => kind === 'websocket-disconnect')) {
      socket.destroy()
      return
    }
    tunnelWebSocket(options.targetRpcUrl, request, socket, head)
  })
  await listen(server, options.port, host)
  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('RPC chaos proxy did not bind a TCP port')
  }

  return {
    url: `http://${host}:${address.port}`,
    close: () => close(server),
  }
}

async function handleRpcRequest(
  options: RpcChaosProxyOptions,
  scheduler: RpcFaultScheduler,
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  setCorsHeaders(response)
  if (request.method === 'OPTIONS') {
    response.writeHead(204).end()
    return
  }
  if (request.method !== 'POST') {
    response.writeHead(405).end()
    return
  }

  let parsed: JsonRpcRequest | readonly JsonRpcRequest[]
  try {
    parsed = parseRequests(await readBody(request))
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : String(error),
    })
    return
  }

  const requests = Array.isArray(parsed) ? parsed : [parsed]
  const faults = requests.flatMap((rpcRequest) =>
    scheduler.schedule(rpcRequest),
  )
  const artifact: RpcExchangeArtifact = { faults, request: parsed }

  try {
    const reset = faults.find(({ kind }) => kind === 'connection-reset')
    if (reset) {
      request.socket.destroy()
      return
    }

    const timeout = faults.find(({ kind }) => kind === 'timeout')
    if (timeout) {
      await delay(timeout.rule.options?.timeoutMs ?? 30_000)
      response.writeHead(504).end()
      return
    }

    const delayFault = faults.find(({ kind }) => kind === 'delay')
    if (delayFault) {
      const latency = delayFault.rule.options?.latencyMs ?? 0
      await delay(Math.max(0, latency + scheduler.jitter(delayFault)))
    }

    const httpError = faults.find(({ kind }) => kind === 'http-error')
    if (httpError) {
      response.writeHead(httpError.rule.options?.status ?? 503).end()
      return
    }

    const upstream = await (options.fetch ?? fetch)(options.targetRpcUrl, {
      body: JSON.stringify(parsed),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
    const upstreamText = await upstream.text()
    let upstreamBody: unknown
    try {
      upstreamBody = JSON.parse(upstreamText)
    } catch {
      response.writeHead(upstream.status).end(upstreamText)
      return
    }

    const mutated = mutateResponse(upstreamBody, requests, faults)
    Object.assign(artifact, { response: mutated })

    if (faults.some(({ kind }) => kind === 'malformed-json')) {
      response
        .writeHead(200, { 'content-type': 'application/json' })
        .end('{"jsonrpc":"2.0",')
      return
    }
    const serialized = JSON.stringify(mutated)
    if (faults.some(({ kind }) => kind === 'truncated-json')) {
      response
        .writeHead(200, { 'content-type': 'application/json' })
        .end(serialized.slice(0, Math.max(1, serialized.length - 3)))
      return
    }

    response
      .writeHead(upstream.status, { 'content-type': 'application/json' })
      .end(serialized)
  } catch (error) {
    sendJson(response, 502, {
      error: error instanceof Error ? error.message : String(error),
    })
  } finally {
    await options.onExchange?.(artifact)
  }
}

function mutateResponse(
  value: unknown,
  requests: readonly JsonRpcRequest[],
  faults: readonly ScheduledRpcFault[],
): unknown {
  const responses = Array.isArray(value) ? value : [value]
  const mutated = responses.map((response, index) => {
    if (!isRecord(response)) return response
    const request = requests[index] ?? requests[0]
    const relevant = faults.filter(
      ({ rule }) => !rule.methods || rule.methods.includes(request.method),
    )
    const next: Record<string, unknown> = { ...response }

    for (const fault of relevant) {
      switch (fault.kind) {
        case 'drop-receipt':
          if (request.method === 'eth_getTransactionReceipt') next.result = null
          break
        case 'missing-result':
          delete next.result
          break
        case 'stale-result':
          next.result = fault.rule.options?.value ?? next.result
          break
        case 'underestimate-gas':
          if (
            request.method === 'eth_estimateGas' &&
            typeof next.result === 'string'
          ) {
            const factor = BigInt(fault.rule.options?.factorBps ?? 8_000)
            next.result = toHexQuantity(
              (BigInt(next.result) * factor) / 10_000n,
            )
          }
          break
        case 'wrong-id':
          next.id = typeof next.id === 'number' ? next.id + 1 : 'wrong-id'
          break
      }
    }
    return next
  })

  const outOfOrder = faults.some(
    ({ kind, rule }) =>
      kind === 'stale-result' && rule.id.includes('out-of-order-batch'),
  )
  if (outOfOrder) mutated.reverse()
  return Array.isArray(value) ? mutated : mutated[0]
}

function parseRequests(
  value: string,
): JsonRpcRequest | readonly JsonRpcRequest[] {
  const parsed: unknown = JSON.parse(value)
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) throw new Error('Empty JSON-RPC batch')
    return parsed.map(parseRequest)
  }
  return parseRequest(parsed)
}

function parseRequest(value: unknown): JsonRpcRequest {
  if (
    !isRecord(value) ||
    value.jsonrpc !== '2.0' ||
    (typeof value.id !== 'number' && typeof value.id !== 'string') ||
    typeof value.method !== 'string' ||
    (value.params !== undefined && !Array.isArray(value.params))
  ) {
    throw new Error('Malformed JSON-RPC request')
  }

  return {
    id: value.id,
    jsonrpc: '2.0',
    method: value.method,
    params: value.params as readonly JsonValue[] | undefined,
  }
}

function tunnelWebSocket(
  targetRpcUrl: string,
  request: IncomingMessage,
  browserSocket: Duplex,
  head: Buffer,
): void {
  const target = new URL(targetRpcUrl)
  const secure = target.protocol === 'https:' || target.protocol === 'wss:'
  const port = Number(target.port || (secure ? 443 : 80))
  const upstream = secure
    ? connectTls({ host: target.hostname, port })
    : connectTcp({ host: target.hostname, port })

  upstream.once('connect', () => {
    const path = `${target.pathname}${target.search}` || '/'
    const headers = Object.entries(request.headers)
      .filter(([, value]) => value !== undefined)
      .map(([name, value]) => `${name}: ${String(value)}`)
      .join('\r\n')
    upstream.write(`GET ${path} HTTP/1.1\r\n${headers}\r\n\r\n`)
    if (head.length > 0) upstream.write(head)
    browserSocket.pipe(upstream).pipe(browserSocket)
  })
  upstream.on('error', () => browserSocket.destroy())
  browserSocket.on('error', () => upstream.destroy())
}

function readBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let length = 0
    request.on('data', (chunk: Buffer) => {
      length += chunk.length
      if (length > 2_000_000) {
        reject(new Error('JSON-RPC request body is too large'))
        request.destroy()
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    request.on('error', reject)
  })
}

function setCorsHeaders(response: ServerResponse): void {
  response.setHeader('access-control-allow-headers', '*')
  response.setHeader('access-control-allow-methods', 'POST, OPTIONS')
  response.setHeader('access-control-allow-origin', '*')
}

function sendJson(
  response: ServerResponse,
  status: number,
  body: Readonly<Record<string, JsonValue>>,
): void {
  response
    .writeHead(status, { 'content-type': 'application/json' })
    .end(JSON.stringify(body))
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function listen(server: Server, port: number, host: string): Promise<void> {
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, host, () => {
      server.off('error', reject)
      resolve()
    })
  })
}

function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
}
