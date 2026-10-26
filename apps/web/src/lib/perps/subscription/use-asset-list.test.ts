import type {
  AllPerpMetasResponse,
  SpotClearinghouseStateResponse,
  SpotMetaResponse,
} from '@nktkas/hyperliquid'
import type { SpotAssetCtxsEvent } from '@nktkas/hyperliquid/api/subscription'
import { describe, expect, it, vi } from 'vitest'
import { getSpotAccountEquity, getSpotTokenPrices } from '../utils'
import { getSpotAssetMetadata } from './spot-asset-metadata'
import { formatPerpCtxs, formatSpotCtxs } from './use-asset-list'

vi.mock('../transports', () => ({
  hlHttpTransport: {},
  hlWebSocketTransport: {},
}))

function token(
  index: number,
  name: string,
): SpotMetaResponse['tokens'][number] {
  return {
    name,
    index,
    szDecimals: 1,
    weiDecimals: 8,
    tokenId: `0x${index.toString(16).padStart(32, '0')}`,
    isCanonical: false,
    evmContract: null,
    fullName: null,
    deployerTradingFeeShare: '0',
  }
}

function context(coin: string, markPx: string): SpotAssetCtxsEvent[number] {
  return {
    coin,
    markPx,
    midPx: markPx,
    prevDayPx: markPx,
    dayNtlVlm: '0',
    dayBaseVlm: '0',
    circulatingSupply: '1',
    totalSupply: '1',
  }
}

describe('asset contexts with sparse token metadata indices', () => {
  const usdc = token(0, 'USDC')
  const max = token(734, 'MAX')
  const meta: SpotMetaResponse = {
    tokens: [usdc, max],
    universe: [
      { name: '@591', index: 591, tokens: [734, 0], isCanonical: false },
    ],
  }

  it('resolves spot tokens by index and contexts by market index', () => {
    const contexts: SpotAssetCtxsEvent = []
    contexts[0] = context('OTHER/USDC', '100')
    contexts[591] = context('@591', '0.0000001')
    const asset = formatSpotCtxs(meta, contexts).get('@591')

    expect(asset?.tokens).toEqual([max, usdc])
    expect(asset?.markPrice).toBe('1e-7')
    expect(asset?.baseTokenId).toBe(max.tokenId)
    expect(getSpotAssetMetadata(meta, meta.universe[0])).toEqual({
      isCanonical: false,
      spotId: max.tokenId,
      baseTokenId: max.tokenId,
      quoteTokenId: usdc.tokenId,
    })
  })

  it('resolves perpetual collateral using its token index', () => {
    const perpsMeta: AllPerpMetasResponse = [
      {
        collateralToken: 734,
        marginTables: [],
        universe: [
          { name: 'BTC', szDecimals: 3, marginTableId: 1, maxLeverage: 10 },
        ],
      },
    ]
    const asset = formatPerpCtxs(meta, perpsMeta, { ctxs: [['', []]] }).get(
      'BTC',
    )

    expect(asset?.tokens).toEqual([max])
    expect(asset?.symbol).toBe('BTC-MAX')
  })

  it('values the master balance snapshot including its sparse-index MAX dust', () => {
    // Public account snapshot: sparse token records coexist with index-addressed contexts.
    const snapshot: [number, string, string, number, string][] = [
      [0, 'USDC', '172.90569892', -1, '1'],
      [1, 'PURR', '0.72852', 0, '0.098184'],
      [150, 'HYPE', '0.00002759', 107, '78.635'],
      [197, 'UBTC', '0.0000093685', 142, '81649'],
      [221, 'UETH', '0.000095364', 151, '2407'],
      [235, 'USDE', '0.00698359', 150, '0.9994'],
      [254, 'USOL', '0.0007747', 156, '104.55'],
      [268, 'USDT0', '0.00880666', 166, '0.99901'],
      [269, 'UFART', '0.012237', 162, '0.14748'],
      [320, 'UBONK', '1713.43257', 194, '0.0000033'],
      [360, 'USDH', '0.015035', 230, '0.99848'],
      [421, 'AMZN', '0.000066468', 280, '195'],
      [443, 'UVIRT', '0.094785', 290, '0.65986'],
      [734, 'MAX', '1309.338459', 591, '0.0000001'],
    ]
    const sparseMeta: SpotMetaResponse = {
      tokens: snapshot.map(([index, name]) => token(index, name)),
      universe: snapshot
        .filter(([index]) => index !== 0)
        .map(([index, , , marketIndex]) => ({
          name: `@${marketIndex}`,
          index: marketIndex,
          tokens: [index, 0],
          isCanonical: false,
        })),
    }
    const contexts: SpotAssetCtxsEvent = []
    for (const [index, , , marketIndex, price] of snapshot) {
      if (index !== 0) contexts[marketIndex] = context(`@${marketIndex}`, price)
    }
    const state: SpotClearinghouseStateResponse = {
      balances: snapshot.map(([token, coin, total]) => ({
        token,
        coin,
        total,
        hold: '0',
        entryNtl: '0',
      })),
    }

    const prices = getSpotTokenPrices(formatSpotCtxs(sparseMeta, contexts))
    expect(prices.get(734)).toBe(0.0000001)
    expect(getSpotAccountEquity(state, prices)).toBeCloseTo(174.17, 2)
  })
})
