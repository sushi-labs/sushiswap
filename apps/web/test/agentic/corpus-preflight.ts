import type { EvmAddress } from 'sushi/evm'
import {
  erc20Abi_allowance,
  erc20Abi_balanceOf,
  erc20Abi_decimals,
  erc20Abi_name,
  erc20Abi_symbol,
  erc20Abi_totalSupply,
} from 'sushi/evm'
import {
  type Hex,
  decodeAbiParameters,
  decodeFunctionResult,
  encodeFunctionData,
  hexToString,
} from 'viem'
import type { ForkController } from './fork-controller'
import {
  type TokenBehaviorScanner,
  type TokenBehaviorScreening,
  createGoPlusTokenBehaviorScannerFromEnvironment,
} from './token-behavior-scanner'
import type { TestedToken, TokenBehavior } from './token-corpus'

export type ManifestDisposition = 'discovery-only' | 'enabled' | 'quarantined'

export type PreflightReasonCode =
  | 'behavior-drift'
  | 'behavior-screening-unavailable'
  | 'behavior-screening-unsupported'
  | 'bytecode-missing'
  | 'buy-restricted'
  | 'confiscatory-tax'
  | 'funding-unavailable'
  | 'honeypot-detected'
  | 'metadata-mismatch'
  | 'metadata-unreadable'
  | 'no-production-route'
  | 'probe-failed'
  | 'sell-restricted'
  | 'transfer-restricted'

export interface PreflightReason {
  readonly code: PreflightReasonCode
  readonly detail: string
}

export interface QuoteProbeResult {
  readonly amount: bigint
  readonly assumedAmountOut?: bigint
  readonly routeFound: boolean
  readonly upstreamResponse: unknown
}

export interface TransferProbeResult {
  readonly actualReceived: bigint
  readonly amountSent: bigint
  readonly error?: string
}

export interface FundingResolution {
  readonly method?: 'impersonate-holder' | 'set-erc20-balance' | 'swap-acquire'
  readonly ready: boolean
}

export interface CorpusPreflightAdapters {
  fund(
    token: TestedToken,
    sender: EvmAddress,
    amount: bigint,
  ): Promise<FundingResolution>
  quote(
    token: TestedToken,
    amount: bigint,
    sender: EvmAddress,
  ): Promise<QuoteProbeResult>
  screen: TokenBehaviorScanner
  transfer?(
    token: TestedToken,
    sender: EvmAddress,
    amount: bigint,
  ): Promise<TransferProbeResult>
}

export type CorpusPreflightAdapterOptions = Omit<
  CorpusPreflightAdapters,
  'screen'
> & {
  readonly environment?: Readonly<Record<string, string | undefined>>
  readonly screen?: TokenBehaviorScanner
}

export interface ResolvedTokenManifest {
  readonly address: EvmAddress
  readonly allowance: bigint
  readonly balance: bigint
  readonly behaviorScreening?: TokenBehaviorScreening
  readonly chainId: TestedToken['chainId']
  readonly disposition: ManifestDisposition
  readonly forkBlockNumber: bigint
  readonly funding: FundingResolution
  readonly metadata: {
    readonly decimals?: number
    readonly name?: string
    readonly symbol?: string
    readonly totalSupply?: bigint
  }
  readonly observedTransferFeeBps?: number
  readonly quotes: readonly QuoteProbeResult[]
  readonly reasons: readonly PreflightReason[]
  readonly seed: TestedToken
}

export interface PreflightTokenOptions {
  readonly adapters: CorpusPreflightAdapters
  readonly controller: ForkController
  readonly sender: EvmAddress
  readonly spender: EvmAddress
  readonly token: TestedToken
}

export function createCorpusPreflightAdapters({
  environment = process.env,
  screen,
  ...adapters
}: CorpusPreflightAdapterOptions): CorpusPreflightAdapters {
  return {
    ...adapters,
    screen:
      screen ?? createGoPlusTokenBehaviorScannerFromEnvironment(environment),
  }
}

export async function preflightToken({
  adapters,
  controller,
  sender,
  spender,
  token,
}: PreflightTokenOptions): Promise<ResolvedTokenManifest> {
  if (!controller.metadata)
    throw new Error('Fork must be created before preflight')

  const reasons: PreflightReason[] = []
  const code = await controller.requestAdmin<Hex>('eth_getCode', [
    token.address,
    'latest',
  ])
  if (code === '0x' || code === '0x0') {
    reasons.push({
      code: 'bytecode-missing',
      detail: 'No deployed bytecode exists at the seeded address.',
    })
  }

  const [name, symbol, decimals, totalSupply, balance, allowance] =
    await Promise.all([
      readMetadataString(controller, token.address, 'name'),
      readMetadataString(controller, token.address, 'symbol'),
      readOptionalUint(controller, token.address, 'decimals'),
      readOptionalUint(controller, token.address, 'totalSupply'),
      readOptionalUint(controller, token.address, 'balanceOf', [sender]),
      readOptionalUint(controller, token.address, 'allowance', [
        sender,
        spender,
      ]),
    ])

  if (name === undefined || symbol === undefined || decimals === undefined) {
    reasons.push({
      code: 'metadata-unreadable',
      detail:
        'One or more required ERC-20 metadata calls reverted or were malformed.',
    })
  }
  if (
    (name !== undefined && name !== token.name) ||
    (symbol !== undefined && symbol !== token.symbol) ||
    (decimals !== undefined && decimals !== BigInt(token.decimals))
  ) {
    reasons.push({
      code: 'metadata-mismatch',
      detail: `Seeded ${token.name} (${token.symbol}, ${token.decimals}) resolved as ${name ?? '?'} (${symbol ?? '?'}, ${decimals?.toString() ?? '?'}).`,
    })
  }

  let behaviorScreening: TokenBehaviorScreening | undefined
  try {
    behaviorScreening = await adapters.screen(token)
    appendScreeningReasons(token, behaviorScreening, reasons)
  } catch (error) {
    reasons.push({
      code: 'behavior-screening-unavailable',
      detail: `Token behavior screening threw unexpectedly: ${error instanceof Error ? error.message : String(error)}`,
    })
  }

  const probeDecimals = Number(decimals ?? BigInt(token.decimals))
  const quoteAmounts = safeQuoteAmounts(probeDecimals)
  const quotes = await Promise.all(
    quoteAmounts.map(async (amount) => {
      try {
        return await adapters.quote(token, amount, sender)
      } catch (error) {
        return {
          amount,
          routeFound: false,
          upstreamResponse: {
            error: error instanceof Error ? error.message : String(error),
          },
        } satisfies QuoteProbeResult
      }
    }),
  )
  if (!quotes.some(({ routeFound }) => routeFound)) {
    reasons.push({
      code: 'no-production-route',
      detail: 'Neither safe-size production Swap API probe returned a route.',
    })
  }

  const fundingAmount = quoteAmounts[1]
  let funding: FundingResolution = { ready: false }
  try {
    funding = await adapters.fund(token, sender, fundingAmount)
  } catch (error) {
    reasons.push({
      code: 'probe-failed',
      detail: `Funding probe failed: ${error instanceof Error ? error.message : String(error)}`,
    })
  }
  if (!funding.ready) {
    reasons.push({
      code: 'funding-unavailable',
      detail: 'No verified fork-local funding strategy is available.',
    })
  }

  let observedTransferFeeBps: number | undefined
  if (adapters.transfer && funding.ready) {
    const snapshot = await controller.snapshot()
    try {
      const transfer = await adapters.transfer(token, sender, quoteAmounts[0])
      if (transfer.error) {
        reasons.push({ code: 'transfer-restricted', detail: transfer.error })
      } else if (transfer.amountSent > 0n) {
        observedTransferFeeBps = Number(
          ((transfer.amountSent - transfer.actualReceived) * 10_000n) /
            transfer.amountSent,
        )
      }
    } catch (error) {
      reasons.push({
        code: 'transfer-restricted',
        detail: error instanceof Error ? error.message : String(error),
      })
    } finally {
      await controller.revert(snapshot)
    }
  }

  if (observedTransferFeeBps === 0 && expectsTransferFee(token.behaviors)) {
    reasons.push({
      code: 'behavior-drift',
      detail:
        'The seed describes transfer tax behavior, but the fork-local differential observed no tax.',
    })
  }

  if (
    behaviorScreening?.status === 'available' &&
    observedTransferFeeBps !== undefined &&
    behaviorScreening.signals.transferTaxBps !== undefined &&
    Math.abs(
      observedTransferFeeBps - behaviorScreening.signals.transferTaxBps,
    ) > 10
  ) {
    reasons.push({
      code: 'behavior-drift',
      detail: `Fork-local transfer fee (${observedTransferFeeBps} bps) differs from the GoPlus transfer-tax signal (${behaviorScreening.signals.transferTaxBps} bps).`,
    })
  }

  return {
    address: token.address,
    allowance: allowance ?? 0n,
    balance: balance ?? 0n,
    behaviorScreening,
    chainId: token.chainId,
    disposition: dispositionFor(token, reasons),
    forkBlockNumber: controller.metadata.forkBlockNumber,
    funding,
    metadata: {
      decimals: decimals === undefined ? undefined : Number(decimals),
      name,
      symbol,
      totalSupply,
    },
    observedTransferFeeBps,
    quotes,
    reasons,
    seed: token,
  }
}

export function createControllerFundingAdapter(
  controller: ForkController,
): CorpusPreflightAdapters['fund'] {
  return async function fund(token, sender, amount) {
    if (token.funding !== 'set-erc20-balance') return { ready: false }
    const snapshot = await controller.snapshot()
    try {
      const supported = await controller.setErc20Balance(
        token.address,
        sender,
        amount,
      )
      if (!supported) return { ready: false }
      const balance = await readOptionalUint(
        controller,
        token.address,
        'balanceOf',
        [sender],
      )
      return {
        method: 'set-erc20-balance',
        ready: balance !== undefined && balance >= amount,
      }
    } finally {
      await controller.revert(snapshot)
    }
  }
}

function dispositionFor(
  token: TestedToken,
  reasons: readonly PreflightReason[],
): ManifestDisposition {
  const fatal = new Set<PreflightReasonCode>([
    'bytecode-missing',
    'buy-restricted',
    'confiscatory-tax',
    'funding-unavailable',
    'honeypot-detected',
    'metadata-unreadable',
    'no-production-route',
    'sell-restricted',
  ])
  if (reasons.some(({ code }) => fatal.has(code))) {
    return token.confidence === 'candidate' ? 'discovery-only' : 'quarantined'
  }
  if (reasons.length > 0 || token.coverage === 'discovery') {
    return 'discovery-only'
  }
  return 'enabled'
}

function safeQuoteAmounts(decimals: number): readonly [bigint, bigint] {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new Error(`Invalid token decimals: ${decimals}`)
  }
  const unit = 10n ** BigInt(decimals)
  return [unit >= 100n ? unit / 100n : 1n, unit]
}

async function readMetadataString(
  controller: ForkController,
  token: EvmAddress,
  field: 'name' | 'symbol',
): Promise<string | undefined> {
  const abi = field === 'name' ? erc20Abi_name : erc20Abi_symbol
  try {
    const result = await controller.requestAdmin<Hex>('eth_call', [
      {
        data: encodeFunctionData({ abi, functionName: field }),
        to: token,
      },
      'latest',
    ])
    try {
      return decodeFunctionResult({ abi, data: result, functionName: field })
    } catch {
      const [bytes32] = decodeAbiParameters([{ type: 'bytes32' }], result)
      return hexToString(bytes32, { size: 32 }).replaceAll('\0', '')
    }
  } catch {
    return undefined
  }
}

type UintCall = 'allowance' | 'balanceOf' | 'decimals' | 'totalSupply'

async function readOptionalUint(
  controller: ForkController,
  token: EvmAddress,
  field: UintCall,
  args: readonly EvmAddress[] = [],
): Promise<bigint | undefined> {
  try {
    switch (field) {
      case 'allowance': {
        const data = encodeFunctionData({
          abi: erc20Abi_allowance,
          args: [args[0], args[1]],
          functionName: 'allowance',
        })
        const result = await ethCall(controller, token, data)
        return decodeFunctionResult({
          abi: erc20Abi_allowance,
          data: result,
          functionName: 'allowance',
        })
      }
      case 'balanceOf': {
        const data = encodeFunctionData({
          abi: erc20Abi_balanceOf,
          args: [args[0]],
          functionName: 'balanceOf',
        })
        const result = await ethCall(controller, token, data)
        return decodeFunctionResult({
          abi: erc20Abi_balanceOf,
          data: result,
          functionName: 'balanceOf',
        })
      }
      case 'decimals': {
        const data = encodeFunctionData({
          abi: erc20Abi_decimals,
          functionName: 'decimals',
        })
        const result = await ethCall(controller, token, data)
        return BigInt(
          decodeFunctionResult({
            abi: erc20Abi_decimals,
            data: result,
            functionName: 'decimals',
          }),
        )
      }
      case 'totalSupply': {
        const data = encodeFunctionData({
          abi: erc20Abi_totalSupply,
          functionName: 'totalSupply',
        })
        const result = await ethCall(controller, token, data)
        return decodeFunctionResult({
          abi: erc20Abi_totalSupply,
          data: result,
          functionName: 'totalSupply',
        })
      }
    }
  } catch {
    return undefined
  }
}

function ethCall(
  controller: ForkController,
  token: EvmAddress,
  data: Hex,
): Promise<Hex> {
  return controller.requestAdmin<Hex>('eth_call', [
    { data, to: token },
    'latest',
  ])
}

function hasTaxBehavior(behaviors: readonly TokenBehavior[]): boolean {
  return behaviors.some((behavior) =>
    ['buy-sell-tax', 'fee-on-transfer', 'tax-configurable'].includes(behavior),
  )
}

function expectsTransferFee(behaviors: readonly TokenBehavior[]): boolean {
  return behaviors.includes('fee-on-transfer')
}

function appendScreeningReasons(
  token: TestedToken,
  screening: TokenBehaviorScreening,
  reasons: PreflightReason[],
): void {
  if (screening.status === 'unsupported') {
    reasons.push({
      code: 'behavior-screening-unsupported',
      detail: screening.reason,
    })
    return
  }
  if (screening.status === 'unavailable') {
    reasons.push({
      code: 'behavior-screening-unavailable',
      detail: `${screening.failure.kind}: ${screening.failure.message}`,
    })
    return
  }

  const { signals } = screening
  if (signals.honeypot) {
    reasons.push({
      code: 'honeypot-detected',
      detail: 'GoPlus reports that the token may not be sellable.',
    })
  }
  if (signals.cannotBuy) {
    reasons.push({
      code: 'buy-restricted',
      detail: 'GoPlus reports that ordinary DEX buys are blocked.',
    })
  }
  if (signals.cannotSellAll) {
    reasons.push({
      code: 'sell-restricted',
      detail: 'GoPlus reports that holders cannot sell their full balance.',
    })
  }

  const taxes = [
    ['buy', signals.buyTaxBps],
    ['sell', signals.sellTaxBps],
    ['transfer', signals.transferTaxBps],
  ] as const
  const confiscatoryTaxes = taxes
    .filter(([, bps]) => bps === 10_000)
    .map(([kind]) => kind)
  if (confiscatoryTaxes.length > 0) {
    reasons.push({
      code: 'confiscatory-tax',
      detail: `GoPlus reports a 100% ${confiscatoryTaxes.join('/')} tax.`,
    })
  }

  const observedTaxes = taxes.flatMap(([kind, bps]) =>
    bps === undefined ? [] : [{ bps, kind }],
  )
  if (
    !hasTaxBehavior(token.behaviors) &&
    observedTaxes.some(({ bps }) => bps > 0)
  ) {
    reasons.push({
      code: 'behavior-drift',
      detail: `The seed does not describe tax behavior, but GoPlus reports ${observedTaxes.map(({ bps, kind }) => `${kind}=${bps} bps`).join(', ')}.`,
    })
  }
  if (
    token.behaviors.includes('buy-sell-tax') &&
    signals.buyTaxBps === 0 &&
    signals.sellTaxBps === 0
  ) {
    reasons.push({
      code: 'behavior-drift',
      detail:
        'The seed describes buy/sell tax behavior, but GoPlus currently reports zero buy and sell tax.',
    })
  }
  if (
    token.behaviors.includes('fee-on-transfer') &&
    signals.transferTaxBps === 0
  ) {
    reasons.push({
      code: 'behavior-drift',
      detail:
        'The seed describes fee-on-transfer behavior, but GoPlus currently reports zero transfer tax.',
    })
  }
}
