import type {
  AllPerpMetasResponse,
  SpotClearinghouseStateResponse,
  SubAccounts2Response,
} from '@nktkas/hyperliquid'
import { getCollateralTokenForDex } from '../../../../../../lib/perps/info/perp-meta'
import type { PerpOrSpotAsset } from '../../../../../../lib/perps/subscription/use-asset-list'

function parseFiniteNumber(value: string | null | undefined): number | null {
  if (!value?.trim()) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export function getSpotTokenPrices(
  assetList: ReadonlyMap<string, PerpOrSpotAsset> | undefined,
): Map<number, number> {
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

export function getSpotAccountEquity(
  spotState: SpotClearinghouseStateResponse | undefined,
  tokenPrices: ReadonlyMap<number, number>,
): number | null {
  if (!spotState) return null

  let equity = 0
  for (const balance of spotState.balances) {
    const total = parseFiniteNumber(balance.total)
    if (total === null) return null
    if (total === 0) continue
    if (!('token' in balance)) return null
    const price = tokenPrices.get(balance.token)
    if (price === undefined || !Number.isFinite(price) || price <= 0) {
      return null
    }
    // total already includes balances held in open orders.
    equity += total * price
  }

  return Number.isFinite(equity) ? equity : null
}

export function getPerpsAccountEquity(
  clearinghouseStates:
    | NonNullable<SubAccounts2Response>[number]['dexToClearinghouseState']
    | undefined,
  allPerpMetas: AllPerpMetasResponse | undefined,
  tokenPrices: ReadonlyMap<number, number>,
): number | null {
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
