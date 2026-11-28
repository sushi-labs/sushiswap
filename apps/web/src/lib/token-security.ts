export const TokenSecurityLabel = {
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
  transfer_fee: 'Transfer Fee',
  transfer_limit: 'Transfer Limit',
  is_buyable: 'Buyable',
  is_sell_limit: 'Sell Limit',
  slippage_modifiable: 'Slippage Modifiable',
  is_honeypot: 'Honeypot',
  transfer_pausable: 'Transfer Pausable',
  freezable: 'Can Freeze Accounts',
  non_transferable: 'Non-transferable',
  is_blacklisted: 'Includes Blacklist',
  is_whitelisted: 'Includes Whitelist',
  is_anti_whale: 'Anti-whale Mechanism',
  trading_cooldown: 'Trading Cooldown',
  is_fake_token: 'Fake Token',
  is_airdrop_scam: 'Airdrop Scam',
  trust_list: 'GoPlus Trust List',
}

export const TokenSecurityMessage: Record<TokenSecurityCheck, string> = {
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
  transfer_fee: 'The scanner reported a fee on token transfers.',
  transfer_limit:
    'The scanner reported a limit on the amount that can be transferred.',
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
  freezable: 'A freeze authority can freeze individual Solana token accounts.',
  non_transferable:
    'This Solana mint prevents tokens from moving between accounts.',
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
  trust_list: 'GoPlus identified this token as widely recognized.',
}

export type TokenSecurityCheck = keyof typeof TokenSecurityLabel
export type TokenSecurity = Partial<Record<TokenSecurityCheck, boolean | null>>

interface TokenSecurityRow {
  check: TokenSecurityCheck
  goPlus: boolean | null
  deFi: boolean | null
  isIssue: boolean
}

export interface TokenSecurityResponse {
  isAvailable: boolean
  rows: TokenSecurityRow[]
  issueCount: number
  isHoneypot: boolean
  isFoT: boolean
  isRisky: boolean
}

export function isTokenSecurityIssue(
  check: TokenSecurityCheck,
  value: boolean | null,
): boolean {
  if (check === 'trust_list') return false
  if (check === 'is_open_source' || check === 'is_buyable')
    return value === false
  return value === true
}

const securityChecks = Object.keys(TokenSecurityLabel) as TokenSecurityCheck[]

export function summarizeTokenSecurity(
  goPlus?: TokenSecurity,
  deFi?: TokenSecurity,
): TokenSecurityResponse {
  const issues: TokenSecurityRow[] = []
  const otherChecks: TokenSecurityRow[] = []

  for (const check of securityChecks) {
    const goPlusValue = goPlus?.[check] ?? null
    const deFiValue = deFi?.[check] ?? null
    if (goPlusValue === null && deFiValue === null) continue

    const isIssue =
      isTokenSecurityIssue(check, goPlusValue) ||
      isTokenSecurityIssue(check, deFiValue)
    const rows = isIssue ? issues : otherChecks
    rows.push({ check, goPlus: goPlusValue, deFi: deFiValue, isIssue })
  }

  return {
    isAvailable: issues.length + otherChecks.length > 0,
    rows: [...issues, ...otherChecks],
    issueCount: issues.length,
    isHoneypot: issues.some(({ check }) => check === 'is_honeypot'),
    isFoT: issues.some(
      ({ check }) =>
        check === 'buy_tax' || check === 'sell_tax' || check === 'transfer_fee',
    ),
    isRisky: issues.length > 0,
  }
}
