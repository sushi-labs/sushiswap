import { getIdFromChainIdAddress } from 'sushi'
import { EvmChainId, USDC } from 'sushi/evm'
import { STELLAR_USDC, StellarChainId } from 'sushi/stellar'
import { SvmChainId, svmAddress } from 'sushi/svm'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getTokenListMock = vi.hoisted(() => vi.fn())

vi.mock('@sushiswap/graph-client/data-api', async (importOriginal) => {
  const dataApi =
    await importOriginal<typeof import('@sushiswap/graph-client/data-api')>()

  return {
    ...dataApi,
    getTokenList: getTokenListMock,
  }
})

import { getCrossmintCheckoutTokenEntries } from './crossmint-checkout-token-catalog'

const SOLANA_TOKEN_ADDRESS = svmAddress(
  '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN',
)
const BASE_TOKEN_ADDRESS = '0xa4a2e2ca3fbfe21aed83471d28b6f65a233c6e00'
const STELLAR_TOKEN = STELLAR_USDC[StellarChainId.STELLAR]
const FEATURES = { creditCardPayment: true } as const

describe('Crossmint checkout token catalog', () => {
  beforeEach(() => {
    getTokenListMock.mockReset()
  })

  it('hydrates a token outside the approved list through customTokens', async () => {
    getTokenListMock.mockResolvedValue([
      {
        address: SOLANA_TOKEN_ADDRESS,
        approved: false,
        approvalStatus: 'PERMISSIONLESS',
        chainId: SvmChainId.SOLANA,
        decimals: 6,
        id: getIdFromChainIdAddress(SvmChainId.SOLANA, SOLANA_TOKEN_ADDRESS),
        name: 'Example Meme',
        stellarMetadata: null,
        symbol: 'MEME',
      },
    ])

    const [entry] = await getCrossmintCheckoutTokenEntries({
      availabilities: [
        {
          available: true,
          features: FEATURES,
          token: `solana:${SOLANA_TOKEN_ADDRESS}`,
        },
      ],
      chainIds: [SvmChainId.SOLANA],
      environment: 'production',
    })

    expect(getTokenListMock).toHaveBeenCalledWith({
      approvalStatuses: ['PERMISSIONLESS'],
      chainId: SvmChainId.SOLANA,
      customTokens: [SOLANA_TOKEN_ADDRESS],
      first: 100,
    })
    expect(entry).toMatchObject({
      available: true,
      features: FEATURES,
      locator: `solana:${SOLANA_TOKEN_ADDRESS}`,
      token: {
        address: SOLANA_TOKEN_ADDRESS,
        chainId: SvmChainId.SOLANA,
        decimals: 6,
        name: 'Example Meme',
        symbol: 'MEME',
      },
    })
    expect(entry?.token.metadata).toEqual({
      approved: false,
      approvalStatus: 'PERMISSIONLESS',
    })
  })

  it('batches token metadata requests by chain and preserves Crossmint order', async () => {
    getTokenListMock.mockImplementation(
      async ({ chainId }: { chainId: EvmChainId | SvmChainId }) => {
        if (chainId === EvmChainId.BASE) {
          return [
            {
              address: BASE_TOKEN_ADDRESS,
              approved: true,
              approvalStatus: 'APPROVED',
              chainId,
              decimals: 18,
              id: getIdFromChainIdAddress(chainId, BASE_TOKEN_ADDRESS),
              name: 'Base Meme',
              stellarMetadata: null,
              symbol: 'BASEMEME',
            },
          ]
        }

        return [
          {
            address: SOLANA_TOKEN_ADDRESS,
            approved: false,
            approvalStatus: 'PERMISSIONLESS',
            chainId,
            decimals: 6,
            id: getIdFromChainIdAddress(chainId, SOLANA_TOKEN_ADDRESS),
            name: 'Solana Meme',
            stellarMetadata: null,
            symbol: 'SOLMEME',
          },
        ]
      },
    )

    const entries = await getCrossmintCheckoutTokenEntries({
      availabilities: [
        {
          available: true,
          features: FEATURES,
          token: `solana:${SOLANA_TOKEN_ADDRESS}`,
        },
        {
          available: true,
          features: FEATURES,
          token: `base:${BASE_TOKEN_ADDRESS}`,
        },
      ],
      chainIds: [EvmChainId.BASE, SvmChainId.SOLANA],
      environment: 'production',
    })

    expect(getTokenListMock).toHaveBeenCalledTimes(2)
    expect(entries.map(({ locator }) => locator)).toEqual([
      `solana:${SOLANA_TOKEN_ADDRESS}`,
      `base:${BASE_TOKEN_ADDRESS}`,
    ])
  })

  it('hydrates Stellar contract tokens with issuer and domain metadata', async () => {
    getTokenListMock.mockResolvedValue([
      {
        address: STELLAR_TOKEN.address,
        approved: true,
        approvalStatus: 'APPROVED',
        chainId: StellarChainId.STELLAR,
        decimals: 7,
        id: getIdFromChainIdAddress(
          StellarChainId.STELLAR,
          STELLAR_TOKEN.address,
        ),
        name: 'USD Coin',
        stellarMetadata: {
          domain: 'circle.com',
          issuer: STELLAR_TOKEN.issuer,
        },
        symbol: 'USDC',
      },
    ])

    const [entry] = await getCrossmintCheckoutTokenEntries({
      availabilities: [
        {
          available: true,
          features: FEATURES,
          token: `stellar:${STELLAR_TOKEN.address}`,
        },
      ],
      chainIds: [StellarChainId.STELLAR],
      environment: 'production',
    })

    expect(getTokenListMock).toHaveBeenCalledWith({
      approvalStatuses: ['PERMISSIONLESS'],
      chainId: StellarChainId.STELLAR,
      customTokens: [STELLAR_TOKEN.address],
      first: 100,
    })
    expect(entry).toMatchObject({
      available: true,
      features: FEATURES,
      locator: `stellar:${STELLAR_TOKEN.address}`,
      token: {
        address: STELLAR_TOKEN.address,
        chainId: StellarChainId.STELLAR,
        decimals: 7,
        issuer: STELLAR_TOKEN.issuer,
        name: 'USD Coin',
        symbol: 'USDC',
      },
    })
    expect(entry?.token.metadata).toEqual({
      approved: true,
      approvalStatus: 'APPROVED',
      domain: 'circle.com',
    })
  })

  it('uses static metadata for Crossmint staging fixtures', async () => {
    const [baseEntry, xmemeEntry, stellarEntry] =
      await getCrossmintCheckoutTokenEntries({
        availabilities: [
          {
            available: true,
            features: FEATURES,
            token: 'base-sepolia:0x036cbd53842c5426634e7929541ec2318f3dcf7e',
          },
          {
            available: true,
            features: FEATURES,
            token: 'solana:7EivYFyNfgGj8xbUymR7J4LuxUHLKRzpLaERHLvi7Dgu',
          },
          {
            available: true,
            features: FEATURES,
            token:
              'stellar:CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
          },
        ],
        chainIds: [EvmChainId.BASE, SvmChainId.SOLANA, StellarChainId.STELLAR],
        environment: 'staging',
      })

    expect(getTokenListMock).not.toHaveBeenCalled()
    expect(baseEntry?.token).toEqual(USDC[EvmChainId.BASE])
    expect(xmemeEntry?.token).toMatchObject({
      chainId: SvmChainId.SOLANA,
      decimals: 9,
      name: 'Crossmint Meme',
      symbol: 'XMEME',
    })
    expect(stellarEntry?.token).toMatchObject({
      address: STELLAR_TOKEN.address,
      chainId: StellarChainId.STELLAR,
      decimals: 7,
      issuer: STELLAR_TOKEN.issuer,
      symbol: 'USDC',
    })
  })

  it('excludes unavailable, malformed, and disapproved tokens', async () => {
    getTokenListMock.mockResolvedValue([
      {
        address: BASE_TOKEN_ADDRESS,
        approved: false,
        approvalStatus: 'DISAPPROVED',
        chainId: EvmChainId.BASE,
        decimals: 18,
        id: getIdFromChainIdAddress(EvmChainId.BASE, BASE_TOKEN_ADDRESS),
        name: 'Blocked token',
        stellarMetadata: null,
        symbol: 'BLOCKED',
      },
    ])

    await expect(
      getCrossmintCheckoutTokenEntries({
        availabilities: [
          {
            available: false,
            features: FEATURES,
            token: `base:${BASE_TOKEN_ADDRESS}`,
          },
          {
            available: true,
            features: FEATURES,
            token: 'not-a-locator',
          },
          {
            available: true,
            features: FEATURES,
            token: `base:${BASE_TOKEN_ADDRESS}`,
          },
        ],
        chainIds: [EvmChainId.BASE],
        environment: 'production',
      }),
    ).resolves.toEqual([])
  })
})
