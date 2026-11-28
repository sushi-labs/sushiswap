import { isTokenScannerChainId } from '@sushiswap/graph-client/de.fi'
import { useQuery } from '@tanstack/react-query'
import {
  type TokenSecurity,
  type TokenSecurityResponse,
  summarizeTokenSecurity,
} from 'src/lib/token-security'
import { EvmToken, isTokenSecurityChainId } from 'sushi/evm'
import type { SvmToken } from 'sushi/svm'
import * as z from 'zod'

const bit = z.unknown().transform((value): boolean | null => {
  if (value === '0' || value === 0 || value === false) return false
  if (value === '1' || value === 1 || value === true) return true
  return null
})

const hasFee = z.unknown().transform((value): boolean | null => {
  if (
    typeof value !== 'number' &&
    (typeof value !== 'string' || !value.trim())
  ) {
    return null
  }

  const rate = Number(value)
  return Number.isFinite(rate) && rate >= 0 ? rate > 0 : null
})

const solanaBit = z.preprocess(
  (value) =>
    value && typeof value === 'object' && 'status' in value
      ? value.status
      : value,
  bit,
)

const trusted = bit.transform((value) => value || null)
const currentTransferFee = z
  .object({ fee_rate: hasFee, maximum_fee: hasFee })
  .transform(({ fee_rate, maximum_fee }) => {
    if (fee_rate === false || maximum_fee === false) return false
    return fee_rate && maximum_fee
  })
  .nullish()
  .catch(null)

const scanTimeoutMs = 10_000

function invertCheck(value: boolean | null): boolean | null {
  return value === null ? null : !value
}

const goPlusResponseSchema = z.object({
  result: z.record(z.string(), z.unknown()),
})

const tokenSecuritySchema = z
  .object({
    is_open_source: bit,
    is_proxy: bit,
    is_mintable: bit,
    can_take_back_ownership: bit,
    owner_change_balance: bit,
    hidden_owner: bit,
    selfdestruct: bit,
    external_call: bit,
    gas_abuse: bit,
    buy_tax: hasFee,
    sell_tax: hasFee,
    transfer_tax: hasFee,
    cannot_buy: bit,
    cannot_sell_all: bit,
    slippage_modifiable: bit,
    is_honeypot: bit,
    transfer_pausable: bit,
    is_blacklisted: bit,
    is_whitelisted: bit,
    is_anti_whale: bit,
    trading_cooldown: bit,
    fake_token: z.object({ value: bit }).nullish().catch(null),
    is_airdrop_scam: bit,
    trust_list: trusted,
  })
  .transform<TokenSecurity>(
    ({ cannot_buy, fake_token, cannot_sell_all, transfer_tax, ...data }) => ({
      ...data,
      is_buyable: invertCheck(cannot_buy),
      is_fake_token: fake_token?.value,
      is_sell_limit: cannot_sell_all,
      transfer_fee: transfer_tax,
    }),
  )

const solanaTokenSecuritySchema = z
  .object({
    mintable: solanaBit,
    freezable: solanaBit,
    non_transferable: bit,
    transfer_fee: z
      .object({ current_fee_rate: currentTransferFee })
      .nullish()
      .catch(null),
    trusted_token: trusted,
  })
  .transform<TokenSecurity>((data) => ({
    is_mintable: data.mintable,
    freezable: data.freezable,
    non_transferable: data.non_transferable,
    transfer_fee: data.transfer_fee?.current_fee_rate,
    trust_list: data.trusted_token,
  }))

async function fetchGoPlusResponse(currency: EvmToken): Promise<TokenSecurity> {
  const url = new URL(
    `https://api.gopluslabs.io/api/v1/token_security/${currency.chainId}`,
  )
  url.searchParams.set('contract_addresses', currency.address)

  const response = await fetch(url, {
    signal: AbortSignal.timeout(scanTimeoutMs),
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`)
  }

  const { result } = goPlusResponseSchema.parse(await response.json())

  return tokenSecuritySchema.parse(result[currency.address.toLowerCase()])
}

async function fetchGoPlusSolanaResponse(
  currency: SvmToken,
): Promise<TokenSecurity> {
  const url = new URL('https://api.gopluslabs.io/api/v1/solana/token_security')
  url.searchParams.set('contract_addresses', currency.address)

  const response = await fetch(url, {
    signal: AbortSignal.timeout(scanTimeoutMs),
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`)
  }

  const { result } = goPlusResponseSchema.parse(await response.json())

  return solanaTokenSecuritySchema.parse(result[currency.address])
}

enum DeFiScannerIssue {
  VERIFIED_CONTRACT = '185',
  UPGRADABLE_CONTRACT = '193',
  IS_MINTABLE = '186',
  VULNERABLE_OWNERSHIP = '230',
  HAS_BALANCE_CONTROLS = '220',
  HIDDEN_OWNERSHIP = '231',
  SELF_DESTRUCT = '106',
  HAS_EXTERNAL_CALLS = '210-b',
  GAS_ABUSE = '179',
  TRANSFER_FEES = '209',
  TRANSFER_LIMITS = '211',
  TRANSFER_PAUSABLE = '189',
  HAS_BLACKLIST = '208',
  HAS_WHITELIST = '237',
  TRANSFER_COOLDOWN = '219',
  AIRDROP = '10004',
}

const scannerIssueGroups = z
  .array(
    z.object({
      scwId: z.string().nullish(),
      issues: z.array(z.unknown()).nullish(),
    }),
  )
  .nullish()

const scannerResponseSchema = z.object({
  coreIssues: scannerIssueGroups,
  generalIssues: scannerIssueGroups,
})

async function fetchDeFiResponse(currency: EvmToken): Promise<TokenSecurity> {
  const url = new URL('/api/token-scanner', window.location.origin)
  url.searchParams.set('chainId', `${currency.chainId}`)
  url.searchParams.set('address', `${currency.address}`)

  const response = await fetch(url, {
    signal: AbortSignal.timeout(scanTimeoutMs),
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`)
  }

  const { coreIssues, generalIssues } = scannerResponseSchema.parse(
    await response.json(),
  )
  const issuesById = new Map<string, boolean>()
  for (const { scwId, issues } of [
    ...(coreIssues ?? []),
    ...(generalIssues ?? []),
  ]) {
    if (scwId && issues) {
      issuesById.set(scwId, issuesById.get(scwId) === true || issues.length > 0)
    }
  }

  const hasIssue = (id: DeFiScannerIssue) => issuesById.get(id) ?? null

  return {
    is_open_source: invertCheck(hasIssue(DeFiScannerIssue.VERIFIED_CONTRACT)),
    is_proxy: hasIssue(DeFiScannerIssue.UPGRADABLE_CONTRACT),
    is_mintable: hasIssue(DeFiScannerIssue.IS_MINTABLE),
    can_take_back_ownership: hasIssue(DeFiScannerIssue.VULNERABLE_OWNERSHIP),
    owner_change_balance: hasIssue(DeFiScannerIssue.HAS_BALANCE_CONTROLS),
    hidden_owner: hasIssue(DeFiScannerIssue.HIDDEN_OWNERSHIP),
    selfdestruct: hasIssue(DeFiScannerIssue.SELF_DESTRUCT),
    external_call: hasIssue(DeFiScannerIssue.HAS_EXTERNAL_CALLS),
    gas_abuse: hasIssue(DeFiScannerIssue.GAS_ABUSE),
    transfer_fee: hasIssue(DeFiScannerIssue.TRANSFER_FEES),
    transfer_limit: hasIssue(DeFiScannerIssue.TRANSFER_LIMITS),
    transfer_pausable: hasIssue(DeFiScannerIssue.TRANSFER_PAUSABLE),
    is_blacklisted: hasIssue(DeFiScannerIssue.HAS_BLACKLIST),
    is_whitelisted: hasIssue(DeFiScannerIssue.HAS_WHITELIST),
    trading_cooldown: hasIssue(DeFiScannerIssue.TRANSFER_COOLDOWN),
    is_airdrop_scam: hasIssue(DeFiScannerIssue.AIRDROP),
  }
}

async function fetchTokenSecurityQueryFn(
  currency: EvmToken | SvmToken | undefined,
): Promise<TokenSecurityResponse> {
  if (!currency) {
    throw new Error('A token is required for a security scan')
  }

  const goPlusResponsePromise =
    currency instanceof EvmToken
      ? isTokenSecurityChainId(currency.chainId)
        ? fetchGoPlusResponse(currency)
        : Promise.resolve(undefined)
      : fetchGoPlusSolanaResponse(currency)

  const deFiResponsePromise =
    currency instanceof EvmToken && isTokenScannerChainId(currency.chainId)
      ? fetchDeFiResponse(currency)
      : Promise.resolve(undefined)

  const [goPlusResponseResult, deFiResponseResult] = await Promise.allSettled([
    goPlusResponsePromise,
    deFiResponsePromise,
  ])

  const goPlusResponse =
    goPlusResponseResult.status === 'fulfilled'
      ? goPlusResponseResult.value
      : undefined
  const deFiResponse =
    deFiResponseResult.status === 'fulfilled'
      ? deFiResponseResult.value
      : undefined

  return summarizeTokenSecurity(goPlusResponse, deFiResponse)
}

export function useTokenSecurity({
  currency,
  enabled = true,
}: {
  enabled?: boolean
  currency: EvmToken | SvmToken | undefined
}) {
  return useQuery({
    queryKey: ['useTokenSecurity', currency?.id],
    queryFn: () => fetchTokenSecurityQueryFn(currency),
    enabled: Boolean(enabled && currency),
    staleTime: 900000, // 15 mins
    gcTime: 86400000, // 24hs
  })
}
