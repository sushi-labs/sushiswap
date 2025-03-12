import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { isTokenSecurityChainId } from 'sushi/config'
import type { Token } from 'sushi/currency'
import { z } from 'zod'

const bit = z.optional(z.enum(['0', '1']).transform((val) => val !== '0'))

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
    buy_tax: z.optional(
      z.preprocess(
        (val) => (val === '' ? undefined : val !== '0'),
        z.optional(z.boolean()),
      ),
    ),
    sell_tax: z.optional(
      z.preprocess(
        (val) => (val === '' ? undefined : val !== '0'),
        z.optional(z.boolean()),
      ),
    ),
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

export type GoPlusTokenScanner = z.infer<typeof tokenSecuritySchema>

export type GoPlusTokenScannerResponse = Record<string, GoPlusTokenScanner>

type GoPlusAPIResponse = Record<
  string,
  Record<keyof GoPlusTokenScanner, string>
>

export const GoPlusTokenSecurityLabel: Record<
  keyof GoPlusTokenScanner,
  string
> = {
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

export const isGoPlusTokenSecurityIssue = {
  // Contract security
  is_open_source: (value: GoPlusTokenScanner['is_open_source']) =>
    value === false,
  is_proxy: (value: GoPlusTokenScanner['is_proxy']) => value === true,
  is_mintable: (value: GoPlusTokenScanner['is_mintable']) => value === true,
  can_take_back_ownership: (
    value: GoPlusTokenScanner['can_take_back_ownership'],
  ) => value === true,
  owner_change_balance: (value: GoPlusTokenScanner['owner_change_balance']) =>
    value === true,
  gas_abuse: (value: GoPlusTokenScanner['gas_abuse']) => value === true,
  hidden_owner: (value: GoPlusTokenScanner['hidden_owner']) => value === true,
  selfdestruct: (value: GoPlusTokenScanner['selfdestruct']) => value === true,
  external_call: (value: GoPlusTokenScanner['external_call']) => value === true,
  trust_list: (value: GoPlusTokenScanner['trust_list']) => value === false,
  // Trading security
  buy_tax: (value: GoPlusTokenScanner['buy_tax']) => value === true,
  sell_tax: (value: GoPlusTokenScanner['sell_tax']) => value === true,
  is_buyable: (value: GoPlusTokenScanner['is_buyable']) => value === false,
  is_sell_limit: (value: GoPlusTokenScanner['is_sell_limit']) => value === true,
  slippage_modifiable: (value: GoPlusTokenScanner['slippage_modifiable']) =>
    value === true,
  is_honeypot: (value: GoPlusTokenScanner['is_honeypot']) => value === true,
  transfer_pausable: (value: GoPlusTokenScanner['transfer_pausable']) =>
    value === true,
  is_blacklisted: (value: GoPlusTokenScanner['is_blacklisted']) =>
    value === true,
  is_whitelisted: (value: GoPlusTokenScanner['is_whitelisted']) =>
    value === true,
  is_anti_whale: (value: GoPlusTokenScanner['is_anti_whale']) => value === true,
  trading_cooldown: (value: GoPlusTokenScanner['trading_cooldown']) =>
    value === true,
  // Info security
  is_fake_token: (value: GoPlusTokenScanner['is_fake_token']) => value === true,
  is_airdrop_scam: (value: GoPlusTokenScanner['is_airdrop_scam']) =>
    value === true,
} as Record<
  NonNullable<keyof GoPlusTokenScanner>,
  (value: GoPlusTokenScanner[keyof GoPlusTokenScanner]) => boolean
>

export const GoPlusTokenSecurityMessage: Record<
  keyof GoPlusTokenScanner,
  string
> = {
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

const fetchTokenSecurityQueryFn = async (currencies: (Token | undefined)[]) => {
  const supportedCurrencies = currencies.filter(
    (currency) => currency && isTokenSecurityChainId(currency.chainId),
  ) as Token[]

  if (supportedCurrencies.length === 0) return {} as GoPlusTokenScannerResponse

  const tokenSecurity = await Promise.all(
    supportedCurrencies.map((currency) =>
      fetch(
        `https://api.gopluslabs.io/api/v1/token_security/${currency.chainId}?contract_addresses=${currency.address}`,
      )
        .then(
          (response) =>
            response.json() as Promise<{ result?: GoPlusAPIResponse }>,
        )
        .then((data) => data?.result?.[currency.address.toLowerCase()])
        .then((tokenSecurityResponse) =>
          tokenSecuritySchema.parse(tokenSecurityResponse),
        ),
    ),
  )

  return supportedCurrencies.reduce((prev, cur, i) => {
    prev[cur.address] = tokenSecurity[i] as GoPlusTokenScanner
    return prev
  }, {} as GoPlusTokenScannerResponse)
}

export const useGoPlusTokenScanner = ({
  currencies,
  enabled = true,
}: {
  enabled?: boolean
  currencies: (Token | undefined)[]
}) => {
  return useQuery({
    queryKey: [
      'useGoPlusTokenScanner',
      currencies?.map((currency) => currency?.id),
    ],
    queryFn: () => fetchTokenSecurityQueryFn(currencies),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 900000, // 15 mins
    gcTime: 86400000, // 24hs
  })
}
