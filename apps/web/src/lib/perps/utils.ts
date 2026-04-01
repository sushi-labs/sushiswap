import {
  formatPrice as formatPriceHl,
  formatSize as formatSizeHl,
} from '@nktkas/hyperliquid/utils'
import type { EvmAddress } from 'sushi/evm'
import type { PerpOrSpotAsset } from './subscription/use-asset-list'

export const getTextColorClass = (value: number) => {
  if (value >= 0) return 'text-green dark:text-green-500'
  if (value < 0) return 'text-red dark:text-red-500'
  return ''
}
export const getTextColorClassForHover = (value: number) => {
  if (value >= 0)
    return 'text-green-300 hover:text-green dark:text-green-200 hover:dark:text-green-500'
  if (value < 0)
    return 'text-red-300 hover:text-red dark:text-red-200 hover:dark:text-red-500'
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

export const getPerpsDexAndCoin = (coinString: string) => {
  if (coinString.includes('@')) {
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
