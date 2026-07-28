import type {
  LaunchpadToken,
  LaunchpadTokenConnection,
} from '@sushiswap/graph-client/data-api'
import { describe, expect, it } from 'vitest'
import {
  getLaunchpadDiscoverJsonLd,
  getLaunchpadTokenJsonLd,
  serializeLaunchpadJsonLd,
} from './launchpad-seo'

const token: LaunchpadToken = {
  id: '4663:0x1111111111111111111111111111111111111111',
  chainId: 4663,
  address: '0x1111111111111111111111111111111111111111',
  creator: '0x2222222222222222222222222222222222222222',
  factoryAddress: '0x3333333333333333333333333333333333333333',
  name: 'Test Token',
  symbol: 'TEST',
  decimals: 18,
  initialSupply: '1000000000000000000000000000',
  feeSplit: {
    sushiFeeBps: 50,
    creatorFeeBps: 50,
  },
  indexingStatus: 'CONFIRMED',
  pool: {
    address: '0x4444444444444444444444444444444444444444',
    feeTier: 3000,
    quoteToken: {
      address: '0x5555555555555555555555555555555555555555',
      symbol: 'USDG',
      name: 'Global Dollar',
      decimals: 6,
    },
  },
  positions: [],
  metadata: {
    description: 'A test launchpad token.',
    links: [
      {
        kind: 'homepage',
        url: 'https://example.com',
        label: null,
      },
    ],
    revision: 1,
    updatedAt: '2026-07-25T11:00:00.000Z',
  },
  metrics: {
    version: '1',
    priceUsd: 0.004218,
    marketcap: 4_218_000,
    fullyDilutedValuationUsd: 4_218_000,
    currentTvlUsd: 842_100,
    volumeUsd: {
      h1: 10_000,
      h6: 200_000,
      h12: 600_000,
      h24: 1_240_000,
    },
    tvlChangePercent: {
      h1: 1,
      h6: 2,
      h12: 3,
      h24: 4,
    },
    asOf: '2026-07-25T12:00:00.000Z',
    source: 'launchpad',
    isStale: false,
  },
  creationTransactionHash:
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  createdAt: '2026-07-24T12:00:00.000Z',
}

describe('launchpad JSON-LD', () => {
  it('describes a token page and its live market dataset', () => {
    const jsonLd = getLaunchpadTokenJsonLd(token)

    expect(jsonLd).toEqual(
      expect.objectContaining({
        '@context': 'https://schema.org',
        '@graph': expect.arrayContaining([
          expect.objectContaining({
            '@type': 'ItemPage',
            name: 'Test Token (TEST)',
          }),
          expect.objectContaining({
            '@type': 'FinancialProduct',
            name: 'Test Token',
            alternateName: 'TEST',
          }),
          expect.objectContaining({
            '@type': 'Dataset',
            name: 'TEST market data',
            variableMeasured: expect.arrayContaining([
              expect.objectContaining({
                '@type': 'PropertyValue',
                name: 'Price',
                value: 0.004218,
                unitText: 'USD',
              }),
              expect.objectContaining({
                name: '24-hour trading volume',
                value: 1_240_000,
              }),
              expect.objectContaining({
                name: 'Liquidity',
                value: 842_100,
              }),
            ]),
          }),
        ]),
      }),
    )
  })

  it('describes the discover page as an ordered token collection', () => {
    const connection: LaunchpadTokenConnection = {
      edges: [{ cursor: 'cursor', node: token }],
      pageInfo: { endCursor: 'cursor', hasNextPage: true },
      totalCount: 42,
    }

    expect(getLaunchpadDiscoverJsonLd(4663, connection)).toEqual(
      expect.objectContaining({
        '@graph': expect.arrayContaining([
          expect.objectContaining({
            '@type': 'CollectionPage',
            name: 'Sushi Launchpad on Robinhood Chain',
          }),
          expect.objectContaining({
            '@type': 'ItemList',
            numberOfItems: 42,
            itemListElement: [
              expect.objectContaining({
                '@type': 'ListItem',
                position: 1,
                item: expect.objectContaining({
                  '@type': 'FinancialProduct',
                  name: 'Test Token',
                }),
              }),
            ],
          }),
        ]),
      }),
    )
  })

  it('escapes token metadata before embedding it in a script element', () => {
    const unsafeToken: LaunchpadToken = {
      ...token,
      metadata: {
        ...token.metadata,
        description: '</script><script>alert("xss")</script>',
      },
    }

    const serialized = serializeLaunchpadJsonLd(
      getLaunchpadTokenJsonLd(unsafeToken),
    )

    expect(serialized).not.toContain('</script>')
    expect(serialized).toContain('\\u003c/script>')
  })
})
