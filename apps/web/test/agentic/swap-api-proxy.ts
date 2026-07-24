import { randomUUID } from 'node:crypto'
import {
  type IncomingHttpHeaders,
  type IncomingMessage,
  type Server,
  type ServerResponse,
  createServer,
} from 'node:http'
import type { EvmAddress } from 'sushi/evm'
import { erc20Abi_allowance, erc20Abi_balanceOf } from 'sushi/evm'
import {
  type Hex,
  decodeFunctionResult,
  encodeFunctionData,
  isAddress,
} from 'viem'
import type { ForkController } from './fork-controller'
import {
  type JsonRpcTransport,
  type JsonValue,
  fromHexQuantity,
  isRecord,
  toHexQuantity,
} from './json-rpc'
import {
  type ClassifiedSimulation,
  classifyTrace,
  simulationErrorMessage,
} from './simulation-classifier'

const NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export interface SwapTransaction {
  readonly data: Hex
  readonly from: EvmAddress
  readonly gas?: bigint
  readonly gasPrice?: bigint
  readonly to: EvmAddress
  readonly value: bigint
}

export interface SwapProxyArtifact {
  readonly correlationId: string
  readonly requestUrl: string
  readonly simulation?: ClassifiedSimulation
  readonly trace?: unknown
  readonly transaction?: SwapTransaction
  readonly upstreamResponse?: unknown
}

export interface SwapApiProxyOptions {
  readonly controller: ForkController
  readonly fetch?: typeof fetch
  readonly host?: string
  readonly onArtifact?: (artifact: SwapProxyArtifact) => Promise<void> | void
  readonly port: number
  readonly productionApiBaseUrl: string
  readonly simulationTransport?: JsonRpcTransport
  readonly traceTimeoutMs?: number
}

export interface StartedSwapApiProxy {
  readonly url: string
  close(): Promise<void>
}

interface SwapPrerequisites {
  readonly amountIn: bigint
  readonly inputToken: string
  readonly sender: EvmAddress
}

export async function startSwapApiProxy(
  options: SwapApiProxyOptions,
): Promise<StartedSwapApiProxy> {
  const host = options.host ?? '127.0.0.1'
  const server = createServer((request, response) => {
    void handleRequest(options, request, response)
  })
  await listen(server, options.port, host)
  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Swap API proxy did not bind a TCP port')
  }

  return {
    url: `http://${host}:${address.port}`,
    close: () => close(server),
  }
}

async function handleRequest(
  options: SwapApiProxyOptions,
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  setCorsHeaders(response)
  if (request.method === 'OPTIONS') {
    response.writeHead(204).end()
    return
  }

  const requestUrl = new URL(request.url ?? '/', 'http://agentic.invalid')
  if (
    request.method !== 'GET' ||
    !/^\/swap\/v7\/\d+$/.test(requestUrl.pathname)
  ) {
    sendJson(response, 404, { message: 'Not found' })
    return
  }

  const correlationId = request.headers['x-sushi-trace-id'] ?? randomUUID()
  const id = Array.isArray(correlationId) ? correlationId[0] : correlationId
  const artifact: SwapProxyArtifact = {
    correlationId: id,
    requestUrl: requestUrl.toString(),
  }

  try {
    const upstreamUrl = new URL(
      requestUrl.pathname,
      ensureTrailingSlash(options.productionApiBaseUrl),
    )
    requestUrl.searchParams.forEach((value, key) => {
      upstreamUrl.searchParams.append(key, value)
    })
    upstreamUrl.searchParams.set('simulate', 'false')

    const upstream = await (options.fetch ?? fetch)(upstreamUrl, {
      headers: forwardedHeaders(request.headers, id),
    })
    const upstreamText = await upstream.text()
    const upstreamBody: unknown = parseJson(upstreamText)
    Object.assign(artifact, { upstreamResponse: upstreamBody })

    if (!upstream.ok) {
      copyResponseHeaders(upstream.headers, response)
      response.writeHead(upstream.status).end(upstreamText)
      return
    }

    const transaction = parseSwapTransaction(upstreamBody)
    Object.assign(artifact, { transaction })
    const prerequisites = parsePrerequisites(requestUrl)
    const failure = await verifyPrerequisites(
      options.controller,
      prerequisites,
      transaction,
    )
    if (failure) {
      response.setHeader('x-agentic-classification', 'harness-setup-failure')
      response.setHeader('x-sushi-trace-id', id)
      sendJson(response, 500, {
        code: 'HARNESS_SETUP_FAILURE',
        message: failure,
      })
      return
    }

    let trace: unknown
    try {
      trace = await withTimeout(
        (
          options.simulationTransport ??
          options.controller.requestAdmin.bind(options.controller)
        )<unknown>('debug_traceCall', [
          transactionToRpc(transaction),
          'latest',
          { tracer: 'callTracer' },
        ]),
        options.traceTimeoutMs ?? 60_000,
        'Local simulation timed out',
      )
    } catch (error) {
      response.setHeader('x-agentic-classification', 'simulation-unavailable')
      response.setHeader('x-sushi-trace-id', id)
      sendJson(response, 503, {
        code: 'SIMULATION_UNAVAILABLE',
        message: error instanceof Error ? error.message : String(error),
      })
      return
    }

    const simulation = classifyTrace(trace)
    Object.assign(artifact, { simulation, trace })
    response.setHeader('x-agentic-classification', simulation.classification)
    response.setHeader('x-sushi-trace-id', id)

    if (simulation.classification !== 'success') {
      sendJson(response, 422, {
        code: simulation.classification.toUpperCase().replaceAll('-', '_'),
        message: simulationErrorMessage(simulation.classification),
        status: 'SimulationFailed',
      })
      return
    }

    copyResponseHeaders(upstream.headers, response)
    response.setHeader('content-type', 'application/json')
    response.writeHead(upstream.status).end(upstreamText)
  } catch (error) {
    response.setHeader('x-sushi-trace-id', id)
    sendJson(response, 500, {
      code: 'PROXY_FAILURE',
      message: error instanceof Error ? error.message : String(error),
    })
  } finally {
    await options.onArtifact?.(artifact)
  }
}

async function verifyPrerequisites(
  controller: ForkController,
  prerequisites: SwapPrerequisites,
  transaction: SwapTransaction,
): Promise<string | undefined> {
  const nativeBalance = fromHexQuantity(
    await controller.requestAdmin<string>('eth_getBalance', [
      prerequisites.sender,
      'latest',
    ]),
  )
  const gasCost = (transaction.gas ?? 0n) * (transaction.gasPrice ?? 0n)

  if (prerequisites.inputToken.toLowerCase() === NATIVE_ADDRESS) {
    if (nativeBalance < prerequisites.amountIn + gasCost) {
      return 'Fork sender does not have enough native input and gas balance'
    }
    return undefined
  }

  if (!isAddress(prerequisites.inputToken)) {
    return 'Swap request contains an invalid input token address'
  }
  if (nativeBalance < gasCost) {
    return 'Fork sender does not have enough native gas balance'
  }

  const token = prerequisites.inputToken as EvmAddress
  const balance = await readUint256(controller, token, {
    data: encodeFunctionData({
      abi: erc20Abi_balanceOf,
      args: [prerequisites.sender],
      functionName: 'balanceOf',
    }),
    decode(data) {
      return decodeFunctionResult({
        abi: erc20Abi_balanceOf,
        data,
        functionName: 'balanceOf',
      })
    },
  })
  if (balance < prerequisites.amountIn) {
    return 'Fork sender does not have enough ERC-20 input balance'
  }

  const allowance = await readUint256(controller, token, {
    data: encodeFunctionData({
      abi: erc20Abi_allowance,
      args: [prerequisites.sender, transaction.to],
      functionName: 'allowance',
    }),
    decode(data) {
      return decodeFunctionResult({
        abi: erc20Abi_allowance,
        data,
        functionName: 'allowance',
      })
    },
  })
  if (allowance < prerequisites.amountIn) {
    return 'Fork sender does not have enough router allowance'
  }

  return undefined
}

async function readUint256(
  controller: ForkController,
  to: EvmAddress,
  call: { readonly data: Hex; decode(data: Hex): bigint },
): Promise<bigint> {
  const result = await controller.requestAdmin<Hex>('eth_call', [
    { data: call.data, to },
    'latest',
  ])
  return call.decode(result)
}

function parsePrerequisites(url: URL): SwapPrerequisites {
  const sender = url.searchParams.get('sender')
  const tokenIn = url.searchParams.get('tokenIn')
  const amount = url.searchParams.get('amount')
  if (
    !sender ||
    !isAddress(sender) ||
    !tokenIn ||
    !amount ||
    !/^\d+$/.test(amount)
  ) {
    throw new Error('Swap request is missing sender, tokenIn, or amount')
  }
  return {
    amountIn: BigInt(amount),
    inputToken: tokenIn,
    sender,
  }
}

export function parseSwapTransaction(value: unknown): SwapTransaction {
  if (!isRecord(value) || !isRecord(value.tx)) {
    throw new Error('Production Swap API response has no transaction')
  }
  const tx = value.tx
  if (
    typeof tx.from !== 'string' ||
    !isAddress(tx.from) ||
    typeof tx.to !== 'string' ||
    !isAddress(tx.to) ||
    typeof tx.data !== 'string' ||
    !/^0x[0-9a-f]*$/i.test(tx.data)
  ) {
    throw new Error('Production Swap API returned a malformed transaction')
  }

  return {
    data: tx.data as Hex,
    from: tx.from,
    gas: optionalBigInt(tx.gas),
    gasPrice: optionalBigInt(tx.gasPrice),
    to: tx.to,
    value: optionalBigInt(tx.value) ?? 0n,
  }
}

export function transactionToRpc(
  transaction: SwapTransaction,
): Readonly<Record<string, JsonValue>> {
  return {
    data: transaction.data,
    from: transaction.from,
    ...(transaction.gas ? { gas: toHexQuantity(transaction.gas) } : {}),
    ...(transaction.gasPrice
      ? { gasPrice: toHexQuantity(transaction.gasPrice) }
      : {}),
    to: transaction.to,
    value: toHexQuantity(transaction.value),
  }
}

function optionalBigInt(value: unknown): bigint | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'number' && typeof value !== 'string') {
    throw new Error('Swap transaction quantity is malformed')
  }
  return BigInt(value)
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    throw new Error('Production Swap API returned malformed JSON')
  }
}

function forwardedHeaders(
  incoming: IncomingHttpHeaders,
  correlationId: string,
): Headers {
  const headers = new Headers()
  for (const [name, value] of Object.entries(incoming)) {
    if (!value || ['connection', 'host'].includes(name.toLowerCase())) continue
    headers.set(name, Array.isArray(value) ? value.join(', ') : value)
  }
  headers.set('accept', 'application/json')
  headers.set('x-sushi-trace-id', correlationId)
  return headers
}

function copyResponseHeaders(headers: Headers, response: ServerResponse): void {
  for (const [name, value] of headers.entries()) {
    if (
      ['content-encoding', 'content-length', 'transfer-encoding'].includes(name)
    ) {
      continue
    }
    response.setHeader(name, value)
  }
}

function setCorsHeaders(response: ServerResponse): void {
  response.setHeader('access-control-allow-headers', '*')
  response.setHeader('access-control-allow-methods', 'GET, OPTIONS')
  response.setHeader('access-control-allow-origin', '*')
  response.setHeader(
    'access-control-expose-headers',
    'x-agentic-classification, x-sushi-trace-id',
  )
}

function sendJson(
  response: ServerResponse,
  status: number,
  body: Readonly<Record<string, JsonValue>>,
): void {
  response.setHeader('content-type', 'application/json')
  response.writeHead(status).end(JSON.stringify(body))
}

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  let timeout: NodeJS.Timeout | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(message)), timeoutMs)
      }),
    ])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
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
