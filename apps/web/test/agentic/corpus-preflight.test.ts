import type { EvmAddress } from 'sushi/evm'
import {
  EvmChainId,
  erc20Abi_allowance,
  erc20Abi_balanceOf,
  erc20Abi_decimals,
  erc20Abi_name,
  erc20Abi_symbol,
  erc20Abi_totalSupply,
} from 'sushi/evm'
import { type Hex, encodeFunctionResult } from 'viem'
import { describe, expect, it } from 'vitest'
import {
  createCorpusPreflightAdapters,
  preflightToken,
} from './corpus-preflight'
import type {
  ForkController,
  ForkMetadata,
  ForkSnapshotId,
} from './fork-controller'
import { type JsonValue, isRecord } from './json-rpc'
import type { TestedChainId } from './tested-chains'
import type {
  TokenBehaviorScanner,
  TokenBehaviorScreening,
  TokenBehaviorSignals,
} from './token-behavior-scanner'
import { TOKEN_CORPUS, type TestedToken } from './token-corpus'

const sender = '0x0000000000000000000000000000000000000001'
const spender = '0x0000000000000000000000000000000000000002'
const sta = findToken(EvmChainId.ETHEREUM, 'STA')
const weth = findToken(EvmChainId.ETHEREUM, 'WETH')

describe('token corpus preflight behavior screening', () => {
  it('installs the environment scanner by default and preserves deterministic injection', () => {
    const baseAdapters = {
      async fund() {
        return { ready: true }
      },
      async quote(_token: TestedToken, amount: bigint) {
        return { amount, routeFound: true, upstreamResponse: {} }
      },
    }
    expect(() =>
      createCorpusPreflightAdapters({
        ...baseAdapters,
        environment: { AGENTIC_GOPLUS_TIMEOUT_MS: 'invalid' },
      }),
    ).toThrow('GoPlus timeout must be a positive integer')

    const screen: TokenBehaviorScanner = async (token) =>
      availableScreening(token, {})
    expect(
      createCorpusPreflightAdapters({
        ...baseAdapters,
        environment: { AGENTIC_GOPLUS_TIMEOUT_MS: 'invalid' },
        screen,
      }).screen,
    ).toBe(screen)
  })

  it('quarantines observed cannot-trade behavior', async () => {
    const manifest = await runPreflight(
      sta,
      availableScreening(sta, {
        buyTaxBps: 10_000,
        cannotBuy: true,
        cannotSellAll: true,
        honeypot: true,
        sellTaxBps: 10_000,
        transferTaxBps: 10_000,
      }),
    )

    expect(manifest.disposition).toBe('quarantined')
    expect(manifest.reasons.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        'buy-restricted',
        'confiscatory-tax',
        'honeypot-detected',
        'sell-restricted',
      ]),
    )
    expect(manifest.behaviorScreening).toMatchObject({
      provider: 'goplus',
      status: 'available',
    })
  })

  it('downgrades an unavailable provider without aborting other probes', async () => {
    const screening: TokenBehaviorScreening = {
      address: weth.address,
      chainId: weth.chainId,
      failure: {
        httpStatus: 429,
        kind: 'http-error',
        message: 'GoPlus request failed with HTTP 429.',
      },
      provider: 'goplus',
      sourceUrl: `https://api.gopluslabs.io/api/v1/token_security/${weth.chainId}?contract_addresses=${weth.address}`,
      status: 'unavailable',
    }

    const manifest = await runPreflight(weth, screening)

    expect(manifest.disposition).toBe('discovery-only')
    expect(manifest.funding.ready).toBe(true)
    expect(manifest.quotes.every(({ routeFound }) => routeFound)).toBe(true)
    expect(manifest.reasons).toContainEqual({
      code: 'behavior-screening-unavailable',
      detail: 'http-error: GoPlus request failed with HTTP 429.',
    })
  })

  it('records owner-controlled capabilities without treating dormant controls as active restrictions', async () => {
    const manifest = await runPreflight(
      sta,
      availableScreening(sta, {
        antiWhale: true,
        antiWhaleModifiable: true,
        hasBlacklist: true,
        hasWhitelist: true,
        ownerCanChangeBalance: true,
        personalTaxModifiable: true,
        taxModifiable: true,
        tradingCooldown: true,
        transferPausable: true,
        transferTaxBps: 100,
      }),
    )

    expect(manifest.disposition).toBe('enabled')
    expect(manifest.reasons).toEqual([])
    expect(manifest.behaviorScreening).toMatchObject({
      signals: {
        hasBlacklist: true,
        ownerCanChangeBalance: true,
        taxModifiable: true,
        transferPausable: true,
      },
    })
  })

  it('downgrades an unexpected live tax instead of reporting a product failure', async () => {
    const manifest = await runPreflight(
      weth,
      availableScreening(weth, { sellTaxBps: 50 }),
    )

    expect(manifest.disposition).toBe('discovery-only')
    expect(manifest.reasons).toContainEqual({
      code: 'behavior-drift',
      detail:
        'The seed does not describe tax behavior, but GoPlus reports sell=50 bps.',
    })
  })
})

async function runPreflight(
  token: TestedToken,
  screening: TokenBehaviorScreening,
) {
  const controller = new MetadataForkController(token)
  const screen: TokenBehaviorScanner = async () => screening
  return preflightToken({
    adapters: createCorpusPreflightAdapters({
      async fund() {
        return { method: 'set-erc20-balance', ready: true }
      },
      async quote(_token, amount) {
        return { amount, routeFound: true, upstreamResponse: { status: 'ok' } }
      },
      screen,
      async transfer(_token, _sender, amount) {
        const fee = token.behaviors.includes('fee-on-transfer')
          ? amount / 100n
          : 0n
        return { actualReceived: amount - fee, amountSent: amount }
      },
    }),
    controller,
    sender,
    spender,
    token,
  })
}

function availableScreening(
  token: TestedToken,
  signals: TokenBehaviorSignals,
): TokenBehaviorScreening {
  return {
    address: token.address,
    chainId: token.chainId,
    provider: 'goplus',
    providerCode: 1,
    providerMessage: 'OK',
    signals,
    sourceUrl: `https://api.gopluslabs.io/api/v1/token_security/${token.chainId}?contract_addresses=${token.address}`,
    status: 'available',
  }
}

function findToken(chainId: TestedChainId, symbol: string): TestedToken {
  const token = TOKEN_CORPUS.find(
    (entry) => entry.chainId === chainId && entry.symbol === symbol,
  )
  if (!token) throw new Error(`Missing ${chainId}:${symbol} corpus token`)
  return token
}

class MetadataForkController implements ForkController {
  readonly backend = 'anvil' as const
  readonly chainId: TestedChainId
  readonly metadata: ForkMetadata
  readonly mutations = []

  constructor(private readonly token: TestedToken) {
    this.chainId = token.chainId
    this.metadata = {
      backend: this.backend,
      chainId: token.chainId,
      forkBlockNumber: 100n,
      forkId: 'fixture',
      publicRpcUrl: 'http://rpc.invalid',
      startedAt: new Date(0).toISOString(),
    }
  }

  async create(): Promise<ForkMetadata> {
    return this.metadata
  }

  async destroy(): Promise<void> {}
  async impersonate(_address: EvmAddress): Promise<void> {}
  async mine(_blocks?: number): Promise<void> {}

  async requestAdmin<T>(
    method: string,
    params: readonly JsonValue[] = [],
  ): Promise<T> {
    if (method === 'eth_getCode') return '0x6000' as T
    if (method !== 'eth_call') throw new Error(`Unexpected ${method}`)

    const call = params[0]
    if (!isRecord(call) || typeof call.data !== 'string') {
      throw new Error('Malformed fixture eth_call')
    }
    const selector = call.data.slice(0, 10)
    const results: Readonly<Record<string, Hex>> = {
      '0x06fdde03': encodeFunctionResult({
        abi: erc20Abi_name,
        functionName: 'name',
        result: this.token.name,
      }),
      '0x18160ddd': encodeFunctionResult({
        abi: erc20Abi_totalSupply,
        functionName: 'totalSupply',
        result: 1_000_000n * 10n ** BigInt(this.token.decimals),
      }),
      '0x313ce567': encodeFunctionResult({
        abi: erc20Abi_decimals,
        functionName: 'decimals',
        result: this.token.decimals,
      }),
      '0x70a08231': encodeFunctionResult({
        abi: erc20Abi_balanceOf,
        functionName: 'balanceOf',
        result: 10n ** BigInt(this.token.decimals),
      }),
      '0x95d89b41': encodeFunctionResult({
        abi: erc20Abi_symbol,
        functionName: 'symbol',
        result: this.token.symbol,
      }),
      '0xdd62ed3e': encodeFunctionResult({
        abi: erc20Abi_allowance,
        functionName: 'allowance',
        result: 0n,
      }),
    }
    const result = results[selector]
    if (!result) throw new Error(`Unexpected fixture selector ${selector}`)
    return result as T
  }

  async revert(_snapshotId: ForkSnapshotId): Promise<void> {}

  async setErc20Balance(
    _token: EvmAddress,
    _account: EvmAddress,
    _amount: bigint,
  ): Promise<boolean> {
    return true
  }

  async setNativeBalance(
    _account: EvmAddress,
    _amount: bigint,
  ): Promise<void> {}

  async snapshot(): Promise<ForkSnapshotId> {
    return '0x1'
  }

  async stopImpersonating(_address: EvmAddress): Promise<void> {}
}
