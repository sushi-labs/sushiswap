import type {
  AllPerpMetasResponse,
  SpotClearinghouseStateResponse,
  SpotMetaResponse,
  SubAccounts2Response,
} from '@nktkas/hyperliquid'
import {
  formatPrice as formatPriceHl,
  formatSize as formatSizeHl,
} from '@nktkas/hyperliquid/utils'
import type { EvmAddress } from 'sushi/evm'
import { formatUnits, parseUnits } from 'viem'
import { getCollateralTokenForDex } from './info/perp-meta'
import type { PerpOrSpotAsset } from './subscription/use-asset-list'

type Balance = SpotClearinghouseStateResponse['balances'][number]

export type TokenBalance = Extract<Balance, { token: number }>

export const getTextColorClass = (value: number) => {
  if (value >= 0) return 'text-perps-green dark:text-perps-green'
  if (value < 0) return 'text-perps-red dark:text-perps-red'
  return ''
}
export const getTextColorClassForHover = (value: number) => {
  if (value >= 0)
    return 'text-perps-green/[50%] hover:text-perps-green dark:text-perps-green/[50%] hover:dark:text-perps-green'
  if (value < 0)
    return 'text-perps-red/[50%] hover:text-perps-red dark:text-perps-red/[50%] hover:dark:text-perps-red'
  return ''
}

export const getSignForValue = (value: number) => {
  if (value >= 0) return '+'
  return ''
}

export const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export const formatPerpsPercent = (
  value: number | string,
  decimals?: number,
) => {
  const num = typeof value === 'string' ? Number.parseFloat(value) : value
  if (Number.isNaN(num)) return '0.00%'
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: decimals ?? 2,
    minimumFractionDigits: decimals ?? 2,
  })
  return formatter.format(num)
}

export const perpsNumberFormatter = ({
  value,
  maxFraxDigits,
  minFraxDigits,
}: {
  value: number | string
  maxFraxDigits?: number
  minFraxDigits?: number
}) => {
  const num = typeof value === 'string' ? Number.parseFloat(value) : value
  if (Number.isNaN(num)) return '0'
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFraxDigits ?? 8,
    minimumFractionDigits: minFraxDigits ?? 0,
  })
  return formatter.format(num)
}

export const formatPrice = (
  price: string | number,
  decimals: number,
  marketType?: 'perp' | 'spot',
) => {
  try {
    return formatPriceHl(price, decimals, marketType)
  } catch {
    return '0'
  }
}

export const formatSize = (price: string | number, decimals: number) => {
  try {
    return formatSizeHl(price, decimals)
  } catch {
    return '0'
  }
}

export const isSpotCoinString = (coinString: string) => {
  return coinString.includes('@') || coinString === 'PURR/USDC'
}

export const getPerpsDexAndCoin = (coinString: string) => {
  if (isSpotCoinString(coinString)) {
    return { perpsDex: null, coin: coinString, type: 'spot' as const }
  }

  if (coinString.includes(':')) {
    const [perpsDex, coin] = coinString.split(':')
    return { perpsDex, coin, type: 'perp' as const }
  }
  return { perpsDex: null, coin: coinString, type: 'perp' as const }
}

export const getHyperliquidExplorerUrl = (
  type: 'token' | 'txn',
  value: string,
) => {
  const base = 'https://app.hyperliquid.xyz/explorer/'

  switch (type) {
    case 'token':
      return `${base}asset/${value}`
    case 'txn':
      return `${base}tx/${value}`
    default:
      throw new Error('Invalid type for explorer URL')
  }
}

export function getHyperliquidCoinIconUrl(
  asset: PerpOrSpotAsset | undefined,
): string {
  if (!asset) return ''

  const { dex = '', marketType, symbol = '', name = '' } = asset

  const prefix = dex !== '' ? `${dex}:` : ''

  let baseSymbol =
    marketType === 'spot'
      ? symbol.split('/')?.[0]
      : dex
        ? symbol.split('-')?.[0]
        : name

  const suffix = marketType === 'spot' ? '_spot' : ''
  if (SPOT_ASSETS_TO_REWRITE.has(baseSymbol)) {
    baseSymbol = SPOT_ASSETS_TO_REWRITE.get(baseSymbol) ?? baseSymbol
  } else if (baseSymbol === 'USDT0') {
    baseSymbol = 'USDT'
  }

  return `https://app.hyperliquid.xyz/coins/${prefix}${baseSymbol}${suffix}.svg`
}

export const getAssetIdForConverter = (asset: PerpOrSpotAsset) => {
  let id
  if (asset.marketType === 'perp') {
    id = asset.name // BTC perp  "xyz:GOLD" builder dex
  } else {
    id = asset?.untouchedSymbol //USOL/USDC - spot
  }
  return id
}

export const SPOT_ASSETS_TO_REWRITE = new Map<string, string>([
  ['UBTC', 'BTC'],
  ['UETH', 'ETH'],
  ['USOL', 'SOL'],
  ['UPUMP', 'PUMP'],
  ['UFART', 'FARTCOIN'],
  ['UMON', 'MON'],
  ['UXPL', 'XPL'],
  ['UENA', 'ENA'],
  ['UUUSPX', 'SPX'],
  ['HPENGU', 'PENGU'],
  ['HFUN', 'FUN'],
  ['UBONK', 'BONK'],
  ['HREKT', 'REKT'],
  ['HWAVE', 'WAVE'],
  ['USPYX', 'SPYX'],
  ['XAUT0', 'XAUT'],
])

export const DEX_NAME_TO_COIN: Map<string, string> = new Map([
  ['', 'USDC (Perps)'],
  ['xyz', 'USDC (Perps)'],
  ['cash', 'USDT0 (Perps)'],
  ['flx', 'USDH (Perps)'],
  ['hyna', 'USDE (Perps)'],
  ['km', 'USDH (Perps)'],
  ['vntl', 'USDH (Perps)'],
])

export const toFixedTrim = (x: number, maxDp = 10) => {
  // stable display, no trailing zeros
  const s = x.toFixed(maxDp)
  return s.replace(/\.?0+$/, '')
}

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)

  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':')
}

export const getEvmDestinationAddress = (tokenIndex: number): EvmAddress => {
  // HYPE is a special case
  if (tokenIndex === 150) {
    return '0x2222222222222222222222222222222222222222'
  }

  // Format: 0x20 + zero-padded token index (big-endian, 19 bytes = 38 hex chars)
  const hexIndex = tokenIndex.toString(16).padStart(38, '0')
  return `0x20${hexIndex}`
}

export function isTokenBalance(balance: Balance): balance is TokenBalance {
  return 'token' in balance
}

export type SubAccountTransferAsset = {
  token: string
  symbol: string
  decimals: number
  balance: string
}

export type SubAccountTransferDirection = 'to-sub-account' | 'to-master'

function getDecimalPlaces(value: string): number {
  if (!/^-?\d+(?:\.\d+)?$/.test(value)) {
    throw new Error('Unable to read the available spot balance.')
  }
  return value.split('.')[1]?.length ?? 0
}

export const getSubAccountTransferAssets = (
  state: SpotClearinghouseStateResponse,
  meta: SpotMetaResponse,
): SubAccountTransferAsset[] => {
  const tokens = new Map(meta.tokens.map((token) => [token.index, token]))
  const maintenanceLimits = new Map(state.tokenToAvailableAfterMaintenance)
  const assets: SubAccountTransferAsset[] = []

  for (const balance of state.balances) {
    if (!isTokenBalance(balance)) continue
    const token = tokens.get(balance.token)
    if (!token) continue

    const limit = maintenanceLimits.get(balance.token)
    const decimals = Math.max(
      token.weiDecimals,
      getDecimalPlaces(balance.total),
      getDecimalPlaces(balance.hold),
      limit === undefined ? 0 : getDecimalPlaces(limit),
    )
    let available =
      parseUnits(balance.total, decimals) - parseUnits(balance.hold, decimals)
    if (limit !== undefined) {
      const maintenanceAvailable = parseUnits(limit, decimals)
      if (maintenanceAvailable < available) available = maintenanceAvailable
    }

    // Round down only after subtracting holds and applying margin limits.
    const availableWei = available / 10n ** BigInt(decimals - token.weiDecimals)
    if (availableWei <= 0n) continue

    assets.push({
      token: `${token.name}:${token.tokenId}`,
      symbol: token.name,
      decimals: token.weiDecimals,
      balance: formatUnits(availableWei, token.weiDecimals),
    })
  }

  return assets.sort((a, b) => a.symbol.localeCompare(b.symbol))
}

export const getSubAccountTransferAmountError = (
  amount: string,
  asset: SubAccountTransferAsset | undefined,
): string | undefined => {
  if (!asset) return 'Select an available spot asset.'
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(amount)) {
    return 'Enter an amount greater than zero.'
  }
  const fractionalDigits = (amount.split('.')[1] ?? '').replace(/0+$/, '')
  if (fractionalDigits.length > asset.decimals) {
    return `Use no more than ${asset.decimals} decimal places.`
  }
  const amountWei = parseUnits(amount, asset.decimals)
  if (amountWei <= 0n) return 'Enter an amount greater than zero.'
  if (amountWei > parseUnits(asset.balance, asset.decimals)) {
    return 'Insufficient available balance.'
  }
  return undefined
}

export const getSubAccountTransferRoute = ({
  masterAddress,
  subAccountAddress,
  direction,
}: {
  masterAddress: EvmAddress
  subAccountAddress: EvmAddress
  direction: SubAccountTransferDirection
}): {
  sourceAddress: EvmAddress
  destination: EvmAddress
  sourceDex: 'spot'
  destinationDex: 'spot'
  fromSubAccount?: EvmAddress
} => {
  return {
    sourceAddress:
      direction === 'to-sub-account' ? masterAddress : subAccountAddress,
    destination:
      direction === 'to-sub-account' ? subAccountAddress : masterAddress,
    sourceDex: 'spot',
    destinationDex: 'spot',
    fromSubAccount: direction === 'to-master' ? subAccountAddress : undefined,
  }
}

function parseFiniteNumber(value: string | null | undefined): number | null {
  if (!value?.trim()) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export const getSpotTokenPrices = (
  assetList: ReadonlyMap<string, PerpOrSpotAsset> | undefined,
): Map<number, number> => {
  const prices = new Map([[0, 1]])
  const markets = Array.from(assetList?.values() ?? []).filter(
    (asset) => asset.marketType === 'spot',
  )

  // Resolve non-USDC quotes after their own USD price becomes available.
  let updated = true
  while (updated) {
    updated = false
    for (const asset of markets) {
      const [base, quote] = asset.tokens ?? []
      if (!base || !quote || prices.has(base.index)) continue
      const quotePrice = prices.get(quote.index)
      if (quotePrice === undefined) continue

      const markPrice = parseFiniteNumber(asset.markPrice)
      const price =
        markPrice !== null && markPrice > 0
          ? markPrice
          : parseFiniteNumber(asset.lastPrice)
      if (price === null || price <= 0) continue

      const usdPrice = price * quotePrice
      if (!Number.isFinite(usdPrice) || usdPrice <= 0) continue
      prices.set(base.index, usdPrice)
      updated = true
    }
  }

  return prices
}

export const getSpotAccountEquity = (
  spotState: SpotClearinghouseStateResponse | undefined,
  tokenPrices: ReadonlyMap<number, number>,
): number | null => {
  if (!spotState) return null

  let equity = 0
  for (const balance of spotState.balances) {
    const total = parseFiniteNumber(balance.total)
    if (total === null) return null
    if (total === 0) continue
    if (!isTokenBalance(balance)) return null
    const price = tokenPrices.get(balance.token)
    if (price === undefined || !Number.isFinite(price) || price <= 0) {
      return null
    }
    // total already includes balances held in open orders.
    equity += total * price
  }

  return Number.isFinite(equity) ? equity : null
}

export const getPerpsAccountEquity = (
  clearinghouseStates:
    | NonNullable<SubAccounts2Response>[number]['dexToClearinghouseState']
    | undefined,
  allPerpMetas: AllPerpMetasResponse | undefined,
  tokenPrices: ReadonlyMap<number, number>,
): number | null => {
  if (!clearinghouseStates) return null

  let equity = 0
  for (const [dex, state] of clearinghouseStates) {
    const accountValue = parseFiniteNumber(state.marginSummary.accountValue)
    if (accountValue === null) return null
    if (accountValue === 0) continue
    const collateralToken = getCollateralTokenForDex(allPerpMetas, dex)
    if (collateralToken === undefined) return null
    const price = tokenPrices.get(collateralToken)
    if (price === undefined || !Number.isFinite(price) || price <= 0) {
      return null
    }
    equity += accountValue * price
  }

  return Number.isFinite(equity) ? equity : null
}
