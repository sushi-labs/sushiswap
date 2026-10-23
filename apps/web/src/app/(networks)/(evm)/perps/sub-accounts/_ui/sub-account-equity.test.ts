import type {
  AllPerpMetasResponse,
  ClearinghouseStateResponse,
  SpotClearinghouseStateResponse,
  SpotMetaResponse,
} from '@nktkas/hyperliquid'
import { describe, expect, it } from 'vitest'
import type { PerpOrSpotAsset } from '../../../../../../lib/perps/subscription/use-asset-list'
import {
  getPerpsAccountEquity,
  getSpotAccountEquity,
  getSpotTokenPrices,
} from './sub-account-equity'

function token(index: number): SpotMetaResponse['tokens'][number] {
  return {
    name: `TOKEN${index}`,
    index,
    szDecimals: 4,
    weiDecimals: 8,
    tokenId: '0x00000000000000000000000000000000',
    isCanonical: true,
    evmContract: null,
    fullName: null,
    deployerTradingFeeShare: '0',
  }
}

function market(
  base: number,
  quote: number,
  price: string,
  overrides: Partial<PerpOrSpotAsset> = {},
): PerpOrSpotAsset {
  return {
    symbol: `${base}/${quote}`,
    untouchedSymbol: `${base}/${quote}`,
    name: `${base}/${quote}`,
    marketType: 'spot',
    dex: '',
    tokens: [token(base), token(quote)],
    lastPrice: price,
    markPrice: price,
    funding8hPct: '',
    openInterestUsd: '',
    maxLeverage: undefined,
    isCanonical: true,
    isDelisted: false,
    marginTableId: undefined,
    decimals: 4,
    formatParseDecimals: 6,
    ...overrides,
  }
}

function balance(
  token: number,
  total: string,
  hold = '0',
): SpotClearinghouseStateResponse['balances'][number] {
  return { token, coin: `TOKEN${token}`, total, hold, entryNtl: '0' }
}

function clearinghouse(accountValue: string): ClearinghouseStateResponse {
  const summary = {
    accountValue,
    totalNtlPos: '0',
    totalRawUsd: accountValue,
    totalMarginUsed: '0',
  }
  return {
    marginSummary: summary,
    crossMarginSummary: summary,
    crossMaintenanceMarginUsed: '0',
    withdrawable: accountValue,
    assetPositions: [],
    time: 0,
  }
}

const metas: AllPerpMetasResponse = [
  { collateralToken: 0, universe: [], marginTables: [] },
  {
    collateralToken: 1,
    universe: [
      { name: 'xyz:ABC', maxLeverage: 10, marginTableId: 1, szDecimals: 4 },
    ],
    marginTables: [],
  },
]

describe('getSpotTokenPrices', () => {
  it('prices the base token without confusing quotes or perp collateral', () => {
    const prices = getSpotTokenPrices(
      new Map([
        ['perp', market(3, 0, '90000', { marketType: 'perp' })],
        ['spot', market(1, 0, '25', { lastPrice: '26' })],
      ]),
    )

    expect(prices).toEqual(
      new Map([
        [0, 1],
        [1, 25],
      ]),
    )
  })

  it('converts non-USDC quotes even when markets arrive out of order', () => {
    const prices = getSpotTokenPrices(
      new Map([
        ['cross', market(2, 1, '3')],
        ['usd', market(1, 0, '20')],
      ]),
    )

    expect(prices.get(2)).toBe(60)
  })

  it('falls back to a valid last price and skips invalid or unpriced markets', () => {
    const prices = getSpotTokenPrices(
      new Map([
        ['fallback', market(1, 0, '5', { markPrice: 'NaN' })],
        ['invalid', market(2, 0, 'Infinity')],
        ['zero', market(3, 0, '0')],
        ['missing-quote', market(4, 5, '100')],
      ]),
    )

    expect(prices).toEqual(
      new Map([
        [0, 1],
        [1, 5],
      ]),
    )
    expect(getSpotTokenPrices(undefined)).toEqual(new Map([[0, 1]]))
  })
})

describe('getSpotAccountEquity', () => {
  const prices = new Map([
    [0, 1],
    [1, 20],
  ])

  it('includes held funds once and values each account using its own totals', () => {
    expect(
      getSpotAccountEquity(
        { balances: [balance(0, '10', '4'), balance(1, '2', '1')] },
        prices,
      ),
    ).toBe(50)
  })

  it('distinguishes unavailable data from an empty account', () => {
    expect(getSpotAccountEquity(undefined, prices)).toBeNull()
    expect(getSpotAccountEquity({ balances: [] }, prices)).toBe(0)
    expect(getSpotAccountEquity({ balances: [balance(2, '0')] }, prices)).toBe(
      0,
    )
  })

  it('does not silently omit unpriced or malformed balances', () => {
    for (const total of ['1', 'NaN', '', 'Infinity']) {
      expect(
        getSpotAccountEquity(
          { balances: [balance(0, '10'), balance(2, total)] },
          prices,
        ),
      ).toBeNull()
    }
    expect(
      getSpotAccountEquity(
        { balances: [{ coin: '+1', total: '1', hold: '0', entryNtl: '0' }] },
        prices,
      ),
    ).toBeNull()
  })
})

describe('getPerpsAccountEquity', () => {
  const prices = new Map([
    [0, 1],
    [1, 20],
  ])

  it('sums all DEX equity in dollars using each DEX collateral token', () => {
    expect(
      getPerpsAccountEquity(
        [
          ['', clearinghouse('10')],
          ['XYZ', clearinghouse('3')],
        ],
        metas,
        prices,
      ),
    ).toBe(70)
  })

  it('does not need prices or metadata for zero-equity DEXs', () => {
    expect(
      getPerpsAccountEquity(
        [['unknown', clearinghouse('0')]],
        undefined,
        new Map(),
      ),
    ).toBe(0)
    expect(getPerpsAccountEquity([], undefined, prices)).toBe(0)
  })

  it('returns unavailable for missing state, metadata, prices, or invalid equity', () => {
    expect(getPerpsAccountEquity(undefined, metas, prices)).toBeNull()
    expect(
      getPerpsAccountEquity([['', clearinghouse('10')]], undefined, prices),
    ).toBeNull()
    expect(
      getPerpsAccountEquity(
        [['xyz', clearinghouse('10')]],
        metas,
        new Map([[0, 1]]),
      ),
    ).toBeNull()
    expect(
      getPerpsAccountEquity([['', clearinghouse('NaN')]], metas, prices),
    ).toBeNull()
  })
})
