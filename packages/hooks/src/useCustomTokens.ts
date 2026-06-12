'use client'

import { useCallback, useMemo } from 'react'
import type { TokenFor } from 'sushi'
import {
  type EvmChainId,
  EvmToken,
  isEvmChainId,
  serializedEvmTokenSchema,
} from 'sushi/evm'
import {
  type StellarChainId,
  StellarToken,
  serializedStellarTokenSchema,
} from 'sushi/stellar'
import {
  type SvmChainId,
  SvmToken,
  isSvmChainId,
  serializedSvmTokenSchema,
} from 'sushi/svm'
import { useLocalStorage } from './useLocalStorage'

type CustomTokenChainId = EvmChainId | SvmChainId | StellarChainId

export type CustomTokenMetadata = {
  approved: boolean
  logoUrl?: string
  icon?: string
  domain?: string
}

type CustomToken<TChainId extends CustomTokenChainId = CustomTokenChainId> =
  TokenFor<TChainId, CustomTokenMetadata>

const evmTokenSchema = serializedEvmTokenSchema()
const svmTokenSchema = serializedSvmTokenSchema()
const stellarTokenSchema = serializedStellarTokenSchema()

export function serializeCustomToken(
  currency: TokenFor<CustomTokenChainId, Partial<CustomTokenMetadata>>,
) {
  const serialized = currency.toJSON()
  // `approved` is re-derived on hydration, not persisted
  const { approved: _approved, ...metadata } = serialized.metadata
  return { ...serialized, metadata }
}

export function hydrateCustomToken(data: unknown): CustomToken | undefined {
  const input = normalizeLegacyCustomToken(data)

  const evm = evmTokenSchema.safeParse(input)
  if (evm.success) {
    return EvmToken.fromJSON({
      ...evm.data,
      metadata: hydrateMetadata(evm.data.metadata),
    })
  }

  const svm = svmTokenSchema.safeParse(input)
  if (svm.success) {
    return SvmToken.fromJSON({
      ...svm.data,
      metadata: hydrateMetadata(svm.data.metadata),
    })
  }

  const stellar = stellarTokenSchema.safeParse(input)
  if (stellar.success) {
    return StellarToken.fromJSON({
      ...stellar.data,
      metadata: hydrateMetadata(stellar.data.metadata),
    })
  }

  return undefined
}

export function hydrateCustomTokenMap<TChainId extends CustomTokenChainId>(
  data: unknown,
  options?: { chainId: TChainId | undefined },
): Record<string, CustomToken<TChainId>> {
  if (!isRecord(data)) return {}

  const tokens: Record<string, CustomToken<TChainId>> = {}
  for (const [key, entry] of Object.entries(data)) {
    const token = hydrateCustomToken(entry)
    if (token && isIncludedChainId(token.chainId, options)) {
      tokens[key] = token as CustomToken<TChainId>
    }
  }
  return tokens
}

type UseCustomTokensReturn<TChainId extends CustomTokenChainId> = {
  data: Record<string, CustomToken<TChainId>>
  mutate: (
    type: 'add' | 'remove',
    currencies: TokenFor<TChainId, Partial<CustomTokenMetadata>>[],
  ) => void
  hasToken: (
    currency: TokenFor<TChainId, Partial<CustomTokenMetadata>> | string,
  ) => boolean
}

export function useCustomTokens(): UseCustomTokensReturn<
  EvmChainId | SvmChainId
>
export function useCustomTokens<TChainId extends CustomTokenChainId>(options: {
  chainId: TChainId | undefined
}): UseCustomTokensReturn<TChainId>
export function useCustomTokens<
  TChainId extends CustomTokenChainId = EvmChainId | SvmChainId,
>(options?: {
  chainId: TChainId | undefined
}): UseCustomTokensReturn<TChainId> {
  const [value, setValue] = useLocalStorage<unknown>('sushi.customTokens', {})

  // depend on primitives — `options` is usually an inline literal at call sites
  const hasChainFilter = options !== undefined
  const filterChainId = options?.chainId

  const data = useMemo(
    () =>
      hydrateCustomTokenMap<TChainId>(
        value,
        hasChainFilter ? { chainId: filterChainId } : undefined,
      ),
    [value, hasChainFilter, filterChainId],
  )

  const mutate = useCallback(
    (
      type: 'add' | 'remove',
      currencies: TokenFor<TChainId, Partial<CustomTokenMetadata>>[],
    ) => {
      setValue((prev: unknown) => {
        const next: Record<string, unknown> = isRecord(prev) ? { ...prev } : {}
        for (const currency of currencies) {
          if (type === 'add') {
            next[currency.id] = serializeCustomToken(currency)
          } else {
            delete next[currency.id]
          }
        }
        return next
      })
    },
    [setValue],
  )

  const hasToken = useCallback(
    (currency: TokenFor<TChainId, Partial<CustomTokenMetadata>> | string) => {
      if (typeof currency === 'string' && !currency.includes(':')) {
        throw new Error('Expected a token id (`chainId:address`)')
      }
      const id = typeof currency === 'string' ? currency : currency.id
      return id in data
    },
    [data],
  )

  return useMemo(() => ({ data, mutate, hasToken }), [data, mutate, hasToken])
}

function hydrateMetadata(stored: Record<string, unknown>): CustomTokenMetadata {
  const { logoUrl, icon, domain } = stored
  return {
    approved: false,
    ...(typeof logoUrl === 'string' ? { logoUrl } : {}),
    ...(typeof icon === 'string' ? { icon } : {}),
    ...(typeof domain === 'string' ? { domain } : {}),
  }
}

// entries written before the serialized-token format are flat objects with a
// top-level logoUrl and no `type` discriminator
function normalizeLegacyCustomToken(data: unknown): unknown {
  if (!isRecord(data) || 'type' in data) return data
  return {
    ...data,
    type: 'token',
    metadata: typeof data.logoUrl === 'string' ? { logoUrl: data.logoUrl } : {},
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isIncludedChainId(
  chainId: CustomTokenChainId,
  options: { chainId: CustomTokenChainId | undefined } | undefined,
): boolean {
  // without an explicit chain filter, stay EVM/SVM-only for backwards compatibility
  if (!options) return isEvmChainId(chainId) || isSvmChainId(chainId)
  return chainId === options.chainId
}
