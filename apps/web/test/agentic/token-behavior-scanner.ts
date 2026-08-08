import * as z from 'zod'
import type { TestedToken } from './token-corpus'

const DEFAULT_GOPLUS_BASE_URL = 'https://api.gopluslabs.io'
const DEFAULT_TIMEOUT_MS = 10_000

const supportedGoPlusChainIds = new Set<number>([
  1, 10, 56, 137, 4663, 8453, 42_161,
])

const taxBpsSchema = z.number().int().min(0).max(10_000)

export const tokenBehaviorSignalsSchema = z.object({
  antiWhale: z.boolean().optional(),
  antiWhaleModifiable: z.boolean().optional(),
  buyTaxBps: taxBpsSchema.optional(),
  cannotBuy: z.boolean().optional(),
  cannotSellAll: z.boolean().optional(),
  hasBlacklist: z.boolean().optional(),
  hasWhitelist: z.boolean().optional(),
  honeypot: z.boolean().optional(),
  ownerCanChangeBalance: z.boolean().optional(),
  personalTaxModifiable: z.boolean().optional(),
  sellTaxBps: taxBpsSchema.optional(),
  taxModifiable: z.boolean().optional(),
  tradingCooldown: z.boolean().optional(),
  transferPausable: z.boolean().optional(),
  transferTaxBps: taxBpsSchema.optional(),
})

const screeningBaseSchema = z.object({
  address: z.string().regex(/^0x[0-9a-f]{40}$/i),
  chainId: z.number().int().positive(),
  provider: z.literal('goplus'),
  sourceUrl: z.string().url(),
})

export const tokenBehaviorScreeningSchema = z.discriminatedUnion('status', [
  screeningBaseSchema.extend({
    providerCode: z.number().int(),
    providerMessage: z.string(),
    signals: tokenBehaviorSignalsSchema,
    status: z.literal('available'),
  }),
  screeningBaseSchema.extend({
    failure: z.object({
      httpStatus: z.number().int().optional(),
      kind: z.enum([
        'http-error',
        'invalid-response',
        'missing-result',
        'network-error',
        'provider-error',
      ]),
      message: z.string().min(1),
    }),
    status: z.literal('unavailable'),
  }),
  screeningBaseSchema.extend({
    reason: z.string().min(1),
    status: z.literal('unsupported'),
  }),
])

export type TokenBehaviorSignals = z.infer<typeof tokenBehaviorSignalsSchema>
export type TokenBehaviorScreening = z.infer<
  typeof tokenBehaviorScreeningSchema
>

export interface GoPlusTokenBehaviorScannerOptions {
  readonly accessToken?: string
  readonly baseUrl?: string
  readonly fetch?: typeof globalThis.fetch
  readonly timeoutMs?: number
}

export type TokenBehaviorScanner = (
  token: TestedToken,
) => Promise<TokenBehaviorScreening>

const responseEnvelopeSchema = z.object({
  code: z.number().int(),
  message: z.string(),
  result: z.record(z.string(), z.unknown()),
})

const responseTokenSchema = z.record(z.string(), z.unknown())

export function createGoPlusTokenBehaviorScanner(
  options: GoPlusTokenBehaviorScannerOptions = {},
): TokenBehaviorScanner {
  const request = options.fetch ?? globalThis.fetch
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error(`GoPlus timeout must be a positive integer: ${timeoutMs}`)
  }

  return async function scan(token): Promise<TokenBehaviorScreening> {
    const sourceUrl = createGoPlusRequestUrl(
      options.baseUrl ?? DEFAULT_GOPLUS_BASE_URL,
      token,
    )
    const base = {
      address: token.address,
      chainId: token.chainId,
      provider: 'goplus' as const,
      sourceUrl: sourceUrl.toString(),
    }

    if (!supportedGoPlusChainIds.has(token.chainId)) {
      return tokenBehaviorScreeningSchema.parse({
        ...base,
        reason: `GoPlus Token Security does not support chain ${token.chainId}.`,
        status: 'unsupported',
      })
    }

    const abortController = new AbortController()
    const timeout = setTimeout(() => abortController.abort(), timeoutMs)
    try {
      const headers = new Headers({ accept: 'application/json' })
      if (options.accessToken) {
        headers.set('authorization', `Bearer ${options.accessToken}`)
      }
      const response = await request(sourceUrl, {
        headers,
        method: 'GET',
        signal: abortController.signal,
      })

      if (!response.ok) {
        return unavailable(base, {
          httpStatus: response.status,
          kind: 'http-error',
          message: `GoPlus request failed with HTTP ${response.status}.`,
        })
      }

      let body: unknown
      try {
        body = await response.json()
      } catch {
        return unavailable(base, {
          kind: 'invalid-response',
          message: 'GoPlus returned a non-JSON response.',
        })
      }

      const envelope = responseEnvelopeSchema.safeParse(body)
      if (!envelope.success) {
        return unavailable(base, {
          kind: 'invalid-response',
          message: 'GoPlus returned an invalid response envelope.',
        })
      }
      if (envelope.data.code !== 1) {
        return unavailable(base, {
          kind: 'provider-error',
          message: redactProviderMessage(
            `GoPlus error ${envelope.data.code}: ${envelope.data.message}`,
            options.accessToken,
          ),
        })
      }

      const matchingEntry = Object.entries(envelope.data.result).find(
        ([address]) => address.toLowerCase() === token.address.toLowerCase(),
      )
      if (!matchingEntry) {
        return unavailable(base, {
          kind: 'missing-result',
          message: 'GoPlus returned no result for the requested token.',
        })
      }

      const providerToken = responseTokenSchema.safeParse(matchingEntry[1])
      if (!providerToken.success) {
        return unavailable(base, {
          kind: 'invalid-response',
          message: 'GoPlus returned an invalid token result.',
        })
      }

      try {
        return tokenBehaviorScreeningSchema.parse({
          ...base,
          providerCode: envelope.data.code,
          providerMessage: redactProviderMessage(
            envelope.data.message,
            options.accessToken,
          ),
          signals: normalizeGoPlusSignals(providerToken.data),
          status: 'available',
        })
      } catch (error) {
        return unavailable(base, {
          kind: 'invalid-response',
          message:
            error instanceof ProviderFieldError
              ? error.message
              : 'GoPlus token signals failed runtime validation.',
        })
      }
    } catch (error) {
      return unavailable(base, {
        kind: 'network-error',
        message: redactProviderMessage(
          error instanceof Error ? error.message : String(error),
          options.accessToken,
        ),
      })
    } finally {
      clearTimeout(timeout)
    }
  }
}

export function createGoPlusTokenBehaviorScannerFromEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): TokenBehaviorScanner {
  const timeout = environment.AGENTIC_GOPLUS_TIMEOUT_MS
  return createGoPlusTokenBehaviorScanner({
    accessToken: environment.AGENTIC_GOPLUS_ACCESS_TOKEN,
    baseUrl: environment.AGENTIC_GOPLUS_BASE_URL,
    timeoutMs: timeout === undefined ? undefined : Number(timeout),
  })
}

function createGoPlusRequestUrl(baseUrl: string, token: TestedToken): URL {
  const base = new URL(baseUrl)
  if (base.username || base.password) {
    throw new Error('GoPlus base URL must not contain credentials.')
  }
  const url = new URL(`/api/v1/token_security/${token.chainId}`, base)
  url.searchParams.set('contract_addresses', token.address)
  return url
}

function normalizeGoPlusSignals(
  input: Readonly<Record<string, unknown>>,
): TokenBehaviorSignals {
  return {
    antiWhale: optionalFlag(input, 'is_anti_whale'),
    antiWhaleModifiable: optionalFlag(input, 'anti_whale_modifiable'),
    buyTaxBps: optionalTaxBps(input, 'buy_tax'),
    cannotBuy: optionalFlag(input, 'cannot_buy'),
    cannotSellAll: optionalFlag(input, 'cannot_sell_all'),
    hasBlacklist: optionalFlag(input, 'is_blacklisted'),
    hasWhitelist: optionalFlag(input, 'is_whitelisted'),
    honeypot: optionalFlag(input, 'is_honeypot'),
    ownerCanChangeBalance: optionalFlag(input, 'owner_change_balance'),
    personalTaxModifiable: optionalFlag(input, 'personal_slippage_modifiable'),
    sellTaxBps: optionalTaxBps(input, 'sell_tax'),
    taxModifiable: optionalFlag(input, 'slippage_modifiable'),
    tradingCooldown: optionalFlag(input, 'trading_cooldown'),
    transferPausable: optionalFlag(input, 'transfer_pausable'),
    transferTaxBps: optionalTaxBps(input, 'transfer_tax'),
  }
}

function optionalFlag(
  input: Readonly<Record<string, unknown>>,
  field: string,
): boolean | undefined {
  const value = input[field]
  if (value === undefined || value === null || value === '') return undefined
  if (value === '0') return false
  if (value === '1') return true
  throw new ProviderFieldError(
    `GoPlus field ${field} must be "0", "1", empty, or absent.`,
  )
}

function optionalTaxBps(
  input: Readonly<Record<string, unknown>>,
  field: string,
): number | undefined {
  const value = input[field]
  if (value === undefined || value === null || value === '') return undefined
  if (
    typeof value !== 'string' ||
    !/^(?:0(?:\.\d{1,18})?|1(?:\.0{1,18})?)$/.test(value)
  ) {
    throw new ProviderFieldError(
      `GoPlus field ${field} must be a decimal string between 0 and 1.`,
    )
  }
  const [whole, fraction = ''] = value.split('.')
  const denominator = 10n ** BigInt(fraction.length)
  const numerator = BigInt(whole) * denominator + BigInt(fraction || '0')
  return Number((numerator * 10_000n + denominator / 2n) / denominator)
}

function unavailable(
  base: {
    readonly address: TestedToken['address']
    readonly chainId: TestedToken['chainId']
    readonly provider: 'goplus'
    readonly sourceUrl: string
  },
  failure: Extract<
    TokenBehaviorScreening,
    { status: 'unavailable' }
  >['failure'],
): TokenBehaviorScreening {
  return tokenBehaviorScreeningSchema.parse({
    ...base,
    failure,
    status: 'unavailable',
  })
}

function redactProviderMessage(message: string, accessToken?: string): string {
  let redacted = message.replaceAll(
    /authorization\s*:?\s*bearer\s+[^\s,;]+/gi,
    'Authorization: Bearer [REDACTED]',
  )
  if (accessToken) redacted = redacted.replaceAll(accessToken, '[REDACTED]')
  return redacted || 'GoPlus request failed without an error message.'
}

class ProviderFieldError extends Error {}
