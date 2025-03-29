import {
  type TokenScannerResponse,
  isTokenScannerChainId,
} from '@sushiswap/graph-client/de.fi'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { isTokenSecurityChainId } from 'sushi/config'
import type { Token } from 'sushi/currency'
import { z } from 'zod'

const bit = z
  .union([z.enum(['0', '1']), z.undefined()])
  .transform((val) => {
    if (val === '0') return false
    if (val === '1') return true
    return undefined
  })
  .optional()

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
    buy_tax: z
      .optional(
        z.preprocess(
          (val) => (val === '' ? undefined : val !== '0'),
          z.optional(z.boolean()),
        ),
      )
      .default(undefined),
    sell_tax: z
      .optional(
        z.preprocess(
          (val) => (val === '' ? undefined : val !== '0'),
          z.optional(z.boolean()),
        ),
      )
      .default(undefined),
    cannot_buy: bit,
    cannot_sell_all: bit,
    slippage_modifiable: bit,
    is_honeypot: bit,
    transfer_pausable: bit,
    is_blacklisted: bit,
    is_whitelisted: bit,
    is_anti_whale: bit,
    trading_cooldown: bit,
    is_true_token: bit,
    is_airdrop_scam: bit,
    trust_list: bit,
  })
  .transform(({ cannot_buy, is_true_token, cannot_sell_all, ...data }) => ({
    ...data,
    is_buyable: typeof cannot_buy !== 'undefined' ? !cannot_buy : undefined,
    is_fake_token:
      typeof is_true_token !== 'undefined' ? !is_true_token : undefined,
    is_sell_limit: cannot_sell_all,
  }))

export type TokenSecurity = z.infer<typeof tokenSecuritySchema>

export const TokenSecurityLabel: Record<keyof TokenSecurity, string> = {
  is_open_source: 'Contract Verified',
  is_proxy: 'Proxy Contract',
  is_mintable: 'Mintable',
  can_take_back_ownership: 'Reclaimable Ownership',
  owner_change_balance: 'Balance Modifiable',
  hidden_owner: 'Hidden Owner',
  selfdestruct: 'Includes selfdestruct()',
  external_call: 'Includes External Call',
  gas_abuse: 'Abuses Gas',
  buy_tax: 'Buy Tax',
  sell_tax: 'Sell Tax',
  is_buyable: 'Buyable',
  is_sell_limit: 'Sell Limit',
  slippage_modifiable: 'Slippage Modifiable',
  is_honeypot: 'Honeypot',
  transfer_pausable: 'Transfer Pausable',
  is_blacklisted: 'Includes Blacklist',
  is_whitelisted: 'Includes Whitelist',
  is_anti_whale: 'Anti-whale Mechanism',
  trading_cooldown: 'Trading Cooldown',
  is_fake_token: 'Fake Token',
  is_airdrop_scam: 'Airdrop Scam',
  trust_list: 'Trusted',
}

export const isTokenSecurityIssue = {
  // Contract security
  is_open_source: (value: TokenSecurity['is_open_source']) => value === false,
  is_proxy: (value: TokenSecurity['is_proxy']) => value === true,
  is_mintable: (value: TokenSecurity['is_mintable']) => value === true,
  can_take_back_ownership: (value: TokenSecurity['can_take_back_ownership']) =>
    value === true,
  owner_change_balance: (value: TokenSecurity['owner_change_balance']) =>
    value === true,
  gas_abuse: (value: TokenSecurity['gas_abuse']) => value === true,
  hidden_owner: (value: TokenSecurity['hidden_owner']) => value === true,
  selfdestruct: (value: TokenSecurity['selfdestruct']) => value === true,
  external_call: (value: TokenSecurity['external_call']) => value === true,
  trust_list: (value: TokenSecurity['trust_list']) => value === false,
  // Trading security
  buy_tax: (value: TokenSecurity['buy_tax']) => value === true,
  sell_tax: (value: TokenSecurity['sell_tax']) => value === true,
  is_buyable: (value: TokenSecurity['is_buyable']) => value === false,
  is_sell_limit: (value: TokenSecurity['is_sell_limit']) => value === true,
  slippage_modifiable: (value: TokenSecurity['slippage_modifiable']) =>
    value === true,
  is_honeypot: (value: TokenSecurity['is_honeypot']) => value === true,
  transfer_pausable: (value: TokenSecurity['transfer_pausable']) =>
    value === true,
  is_blacklisted: (value: TokenSecurity['is_blacklisted']) => value === true,
  is_whitelisted: (value: TokenSecurity['is_whitelisted']) => value === true,
  is_anti_whale: (value: TokenSecurity['is_anti_whale']) => value === true,
  trading_cooldown: (value: TokenSecurity['trading_cooldown']) =>
    value === true,
  // Info security
  is_fake_token: (value: TokenSecurity['is_fake_token']) => value === true,
  is_airdrop_scam: (value: TokenSecurity['is_airdrop_scam']) => value === true,
} as Record<
  NonNullable<keyof TokenSecurity>,
  (value: TokenSecurity[keyof TokenSecurity]) => boolean
>

export const TokenSecurityMessage: Record<keyof TokenSecurity, string> = {
  //Contract Security
  is_open_source:
    'Whether or not this token contract is open source. You can check the contract code for details. Unsourced token contracts are likely to have malicious functions to defraud their users of their assets.',
  is_proxy:
    'Whether or not there is a proxy in the contract. The proxy contract means contract owner can modifiy the function of the token and possibly effect the price.',
  is_mintable:
    'Whether or not this contract contains a visible mint function. Hidden mint functions may increase the amount of tokens in circulation and effect the price of the token.',
  can_take_back_ownership:
    'Whether or not this contract contains a function that allows the project owner to regain ownership even after relinquishing it.',
  owner_change_balance:
    'Whether or not the contract owner is found to have the authority to modify the balance of tokens at other addresses.',
  hidden_owner:
    'Whether or not a hidden owner address was found for the token. For contract with a hidden owner, developer can still manipulate the contract even if the ownership has been abandoned.',
  selfdestruct:
    'If a self-destruct function exists and is triggered, the contract will be destroyed, all functions will be unavailable, and all related assets will be erased.',
  external_call:
    'External calls would cause this token contract to be highly dependent on other contracts, which may be a potential risk.',
  gas_abuse:
    'Indicates whether any gas abuse activity has been detected in this contract.',
  //Trading security
  buy_tax:
    'Whether or not this token contract includes a buy tax. A buy tax will cause the actual token value received to be less than the amount paid. An excessive buy tax may lead to heavy losses.',
  sell_tax:
    'Whether or not this token contract includes a sell tax. A sell tax will cause the actual value received when selling a token to be less than expected, and too much sell tax may lead to large losses.',
  is_buyable:
    'Whether or not this token can be purchased directly by users. Generally, these unbuyable tokens would be found in Reward Tokens. Such tokens are issued as rewards for some on-chain applications.',
  is_sell_limit:
    'Whether or not a user can sell all of their tokens in a single sale.',
  slippage_modifiable:
    'Whether or not the contract owner can modify the buy tax or sell tax of the token. This may cause some losses, especially since some contracts have unlimited modifiable tax rates, which would make the token untradeable.',
  is_honeypot:
    "Whether or not the token is a honeypot, meaning that the token maybe cannot be sold because of the token contract's function, or the token contains malicious code.",
  transfer_pausable:
    "Indicating the contract owner's ability to suspend trading, preventing users from selling, except for those with special authority.",
  is_blacklisted:
    'Whether or not a blacklist function is included. If there is a blacklist, some addresses may not be able to trade normally (honeypot risk).',
  is_whitelisted:
    'Whether or not a whitelist function is included. If there is a whitelist, some addresses may not be able to trade normally (honeypot risk).',
  is_anti_whale:
    'Whether the contract has the function to limit the maximum amount of transactions or the maximum token position for a single address.',
  trading_cooldown:
    'Whether the contract has a trading-cool-down mechanism that can limit the minimum time between two transactions.',
  //Info security
  is_fake_token: 'Whether or not this token is fake or real.',
  is_airdrop_scam: 'Whether or not this token is an airdrop scam',
  trust_list: 'Whether or not this token is a famous and trustworthy one.',
}

const fetchGoPlusResponse = async (currency: Token) => {
  const url = new URL(
    `https://api.gopluslabs.io/api/v1/token_security/${currency.chainId}`,
  )
  url.searchParams.set('contract_addresses', currency.address)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`)
  }

  const json = await response.json()

  return tokenSecuritySchema.parse(json.result[currency.address.toLowerCase()])
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

const fetchDeFiResponse = async (currency: Token) => {
  const url = new URL('/api/token-scanner', window.location.origin)
  url.searchParams.set('chainId', `${currency.chainId}`)
  url.searchParams.set('address', `${currency.address}`)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`)
  }

  const json = (await response.json()) as TokenScannerResponse

  const issues = [...json.coreIssues, ...json.generalIssues].reduce(
    (accum, cur) => {
      accum[cur.scwId] = cur
      return accum
    },
    {} as Record<string, TokenScannerResponse['generalIssues'][number]>,
  )

  return {
    is_open_source:
      issues[DeFiScannerIssue.VERIFIED_CONTRACT].issues.length === 0,
    is_proxy: issues[DeFiScannerIssue.UPGRADABLE_CONTRACT].issues.length > 0,
    is_mintable: issues[DeFiScannerIssue.IS_MINTABLE].issues.length > 0,
    can_take_back_ownership:
      issues[DeFiScannerIssue.VULNERABLE_OWNERSHIP].issues.length > 0,
    owner_change_balance:
      issues[DeFiScannerIssue.HAS_BALANCE_CONTROLS].issues.length > 0,
    hidden_owner: issues[DeFiScannerIssue.HIDDEN_OWNERSHIP].issues.length > 0,
    selfdestruct: issues[DeFiScannerIssue.SELF_DESTRUCT].issues.length > 0,
    external_call:
      issues[DeFiScannerIssue.HAS_EXTERNAL_CALLS].issues.length > 0,
    gas_abuse: issues[DeFiScannerIssue.GAS_ABUSE].issues.length > 0,
    buy_tax: issues[DeFiScannerIssue.TRANSFER_FEES].issues.length > 0,
    sell_tax: issues[DeFiScannerIssue.TRANSFER_FEES].issues.length > 0,
    cannot_buy: issues[DeFiScannerIssue.TRANSFER_LIMITS].issues.length > 0,
    cannot_sell_all: issues[DeFiScannerIssue.TRANSFER_LIMITS].issues.length > 0,
    transfer_pausable:
      issues[DeFiScannerIssue.TRANSFER_PAUSABLE].issues.length > 0,
    is_blacklisted: issues[DeFiScannerIssue.HAS_BLACKLIST].issues.length > 0,
    is_whitelisted: issues[DeFiScannerIssue.HAS_WHITELIST].issues.length > 0,
    trading_cooldown:
      issues[DeFiScannerIssue.TRANSFER_COOLDOWN].issues.length > 0,
    is_airdrop_scam: issues[DeFiScannerIssue.AIRDROP].issues.length > 0,
    is_buyable: issues[DeFiScannerIssue.TRANSFER_LIMITS].issues.length === 0,
    is_sell_limit: issues[DeFiScannerIssue.TRANSFER_LIMITS].issues.length > 0,
    is_fake_token: undefined,
    slippage_modifiable: undefined,
    is_honeypot: undefined,
    is_anti_whale: undefined,
    trust_list: undefined,
  } as TokenSecurity
}

const fetchTokenSecurityQueryFn = async (currency: Token | undefined) => {
  if (!currency) {
    throw new Error()
  }

  const [goPlusResponseResult, deFiResponseResult] = await Promise.allSettled([
    isTokenSecurityChainId(currency.chainId)
      ? fetchGoPlusResponse(currency)
      : Promise.resolve(undefined),
    isTokenScannerChainId(currency.chainId)
      ? fetchDeFiResponse(currency)
      : Promise.resolve(undefined),
  ])

  const goPlusResponse =
    goPlusResponseResult.status === 'fulfilled'
      ? goPlusResponseResult.value
      : undefined
  const deFiResponse =
    deFiResponseResult.status === 'fulfilled'
      ? deFiResponseResult.value
      : undefined

  return Object.keys(goPlusResponse ?? {}).reduce(
    (acc, key) => {
      type SecurityKey = keyof TokenSecurity
      const field = key as SecurityKey

      acc[field] = {
        goPlus: goPlusResponse?.[field],
        deFi: deFiResponse?.[field],
      }
      return acc
    },
    {} as Record<keyof TokenSecurity, { goPlus?: boolean; deFi?: boolean }>,
  )
}

export type TokenSecurityResponse = Awaited<
  ReturnType<typeof fetchTokenSecurityQueryFn>
>

export const useTokenSecurity = ({
  currency,
  enabled = true,
}: {
  enabled?: boolean
  currency: Token | undefined
}) => {
  return useQuery({
    queryKey: ['useTokenSecurity', currency?.id],
    queryFn: () => fetchTokenSecurityQueryFn(currency),
    enabled: Boolean(enabled && currency),
    placeholderData: keepPreviousData,
    staleTime: 900000, // 15 mins
    gcTime: 86400000, // 24hs
  })
}
