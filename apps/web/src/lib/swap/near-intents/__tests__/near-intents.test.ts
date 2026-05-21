import { TokenResponse } from '@defuse-protocol/one-click-sdk-typescript'
import {
  SUPPORTED_NEAR_INTENTS_CHAIN_IDS,
  getNearIntentsChainId,
  isNearIntentsChainId,
} from 'src/lib/swap/near-intents/chains'
import {
  NEAR_INTENTS_UI_FEE_BIPS,
  NEAR_INTENTS_UI_FEE_DECIMAL,
  NEAR_INTENTS_UI_FEE_PERCENT,
  buildNearIntentsAppFees,
} from 'src/lib/swap/near-intents/fees'
import {
  NEAR_INTENTS_PREVIEW_STELLAR_ADDRESS_PLACEHOLDER,
  getNearIntentsFeeRecipient,
  getPreviewAddressPlaceholder,
} from 'src/lib/swap/near-intents/placeholders'
import {
  filterSupportedTokens,
  getCurrencyParam,
  getDefaultTokenForChain,
  getNearIntentsAssetId,
  getStellarTokenMetadata,
  getTokenKind,
  mapEvmErc20Token,
  mapEvmNativeToken,
  mapNearIntentsTokensToCurrencyEntries,
  mapStellarTokenToNearIntents,
  normalizeSdkToken,
} from 'src/lib/swap/near-intents/tokens'
import { getDepositMode } from 'src/lib/swap/near-intents/utils'
import { STELLAR_USDC, STELLAR_XLM, StellarChainId } from 'sushi/stellar'
import { describe, expect, it } from 'vitest'

const xlmToken = STELLAR_XLM[StellarChainId.STELLAR]

const usdcToken = STELLAR_USDC[StellarChainId.STELLAR]

describe('near-intents chains', () => {
  it('maps supported blockchain keys back to chain ids', () => {
    expect(getNearIntentsChainId(TokenResponse.blockchain.ETH)).toBe(1)
    expect(getNearIntentsChainId(TokenResponse.blockchain.ARB)).toBe(42161)
    expect(getNearIntentsChainId('stellar')).toBe(-4)
    expect(getNearIntentsChainId(TokenResponse.blockchain.NEAR)).toBeUndefined()
  })

  it('reports the supported chain boundary explicitly', () => {
    expect(isNearIntentsChainId(1)).toBe(true)
    expect(isNearIntentsChainId(-4)).toBe(true)
    expect(isNearIntentsChainId(5)).toBe(false)
    expect(SUPPORTED_NEAR_INTENTS_CHAIN_IDS).toHaveLength(13)
  })
})

describe('near-intents fees and placeholders', () => {
  it('reuses the current 35 bps UI fee for NEAR Intents', () => {
    expect(NEAR_INTENTS_UI_FEE_BIPS).toBe(35)
    expect(NEAR_INTENTS_UI_FEE_PERCENT).toBe(0.35)
    expect(NEAR_INTENTS_UI_FEE_DECIMAL).toBe(0.0035)
  })

  it('builds appFees with the EVM UI fee collector recipient', () => {
    expect(buildNearIntentsAppFees({ fromChainId: 1, toChainId: -4 })).toEqual([
      {
        recipient: getNearIntentsFeeRecipient({
          fromChainId: 1,
          toChainId: -4,
        }),
        fee: 35,
      },
    ])
  })

  it('returns chain-specific preview placeholders', () => {
    expect(getPreviewAddressPlaceholder(1)).toBe(
      getNearIntentsFeeRecipient({ fromChainId: 1, toChainId: -4 }),
    )
    expect(getPreviewAddressPlaceholder(-4)).toBe(
      NEAR_INTENTS_PREVIEW_STELLAR_ADDRESS_PLACEHOLDER,
    )
  })
})

describe('near-intents token mapping', () => {
  it('detects native, erc20, stellar-native, and stellar-issued token kinds', () => {
    expect(
      getTokenKind({
        assetId: 'eth:native',
        decimals: 18,
        blockchain: TokenResponse.blockchain.ETH,
        symbol: 'ETH',
        price: 2000,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
      }),
    ).toBe('native')

    expect(
      getTokenKind({
        assetId: 'eth:usdc',
        decimals: 6,
        blockchain: TokenResponse.blockchain.ETH,
        symbol: 'USDC',
        price: 1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
        contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      }),
    ).toBe('erc20')

    expect(
      getTokenKind({
        assetId: 'stellar:native',
        decimals: 7,
        blockchain: 'stellar',
        symbol: 'XLM',
        price: 0.1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
      }),
    ).toBe('stellar-native')

    expect(
      getTokenKind({
        assetId: 'stellar:usdc',
        decimals: 7,
        blockchain: 'stellar',
        symbol: 'USDC',
        price: 1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
        contractAddress: usdcToken.address,
      }),
    ).toBe('stellar-issued')
  })

  it('drops unsupported Stellar issued assets that cannot be mapped safely', () => {
    expect(
      normalizeSdkToken({
        assetId: 'stellar:UNKNOWN',
        decimals: 7,
        blockchain: 'stellar',
        symbol: 'UNKNOWN',
        price: 1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
        contractAddress: 'GUNKNOWNUNKNOWNUNKNOWNUNKNOWNUNKNOWNUNKNOWNUNKNOWN',
      }),
    ).toBeUndefined()
  })

  it('normalizes XLM into the local token shape', () => {
    expect(
      normalizeSdkToken({
        assetId: 'stellar:XLM',
        decimals: 7,
        blockchain: 'stellar',
        symbol: 'XLM',
        price: 0.1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
      }),
    ).toEqual({
      assetId: 'stellar:XLM',
      chainId: -4,
      blockchain: 'stellar',
      symbol: 'XLM',
      name: xlmToken.name,
      decimals: 7,
      priceUSD: '0.1',
      priceUpdatedAt: '2024-01-01T00:00:00Z',
      logoURI:
        'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
      kind: 'stellar-native',
    })
  })

  it('normalizes Stellar USDC into the local token shape', () => {
    expect(
      normalizeSdkToken({
        assetId: 'stellar:USDC',
        decimals: 7,
        blockchain: 'stellar',
        symbol: 'USDC',
        price: 1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
        contractAddress: usdcToken.address,
        assetIssuer: usdcToken.issuer,
      }),
    ).toEqual({
      assetId: 'stellar:USDC',
      chainId: -4,
      blockchain: 'stellar',
      symbol: 'USDC',
      name: usdcToken.name,
      decimals: 7,
      priceUSD: '1',
      priceUpdatedAt: '2024-01-01T00:00:00Z',
      contractAddress: usdcToken.address,
      assetIssuer: usdcToken.issuer,
      logoURI:
        'https://stellar.myfilebase.com/ipfs/QmNcfZxs8e9uVyhEa3xoPWCsj3ZogGirtixMEC9Km4Fjm2',
      kind: 'stellar-issued',
    })
  })

  it('maps explicit EVM native and ERC20 helpers', () => {
    expect(
      mapEvmNativeToken(1, 'ETH', 18, {
        assetId: 'eth:native',
        decimals: 18,
        blockchain: TokenResponse.blockchain.ETH,
        symbol: 'ETH',
        price: 2000,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
      }),
    ).toMatchObject({
      assetId: 'eth:native',
      chainId: 1,
      symbol: 'ETH',
      kind: 'native',
    })

    expect(
      mapEvmErc20Token(
        1,
        'USDC',
        6,
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        {
          assetId: 'eth:usdc',
          decimals: 6,
          blockchain: TokenResponse.blockchain.ETH,
          symbol: 'USDC',
          price: 1,
          priceUpdatedAt: '2024-01-01T00:00:00Z',
          contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        },
      ),
    ).toMatchObject({
      assetId: 'eth:usdc',
      chainId: 1,
      symbol: 'USDC',
      kind: 'erc20',
    })
  })

  it('maps existing Stellar tokens directly when needed', () => {
    expect(mapStellarTokenToNearIntents(xlmToken)).toMatchObject({
      chainId: -4,
      symbol: 'XLM',
      kind: 'stellar-native',
    })

    expect(mapStellarTokenToNearIntents(usdcToken)).toMatchObject({
      chainId: -4,
      symbol: 'USDC',
      kind: 'stellar-issued',
      contractAddress: usdcToken.address,
      assetIssuer: usdcToken.issuer,
    })
  })

  it('enriches 1Click Stellar tokens with local icons', () => {
    expect(
      normalizeSdkToken({
        assetId: 'stellar:XLM',
        decimals: 7,
        blockchain: 'stellar',
        symbol: 'XLM',
        price: 0.1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
      }),
    ).toMatchObject({
      symbol: 'XLM',
      logoURI: expect.stringContaining('Stellar_symbol'),
    })

    expect(
      normalizeSdkToken({
        assetId: 'stellar:USDC',
        decimals: 7,
        blockchain: 'stellar',
        symbol: 'USDC',
        price: 1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
        contractAddress: usdcToken.issuer,
      }),
    ).toMatchObject({
      symbol: 'USDC',
      logoURI: expect.stringContaining('stellar.myfilebase.com'),
    })
  })

  it('filters token lists down to supported and safely mappable tokens', () => {
    expect(
      filterSupportedTokens([
        {
          assetId: 'eth:native',
          decimals: 18,
          blockchain: TokenResponse.blockchain.ETH,
          symbol: 'ETH',
          price: 2000,
          priceUpdatedAt: '2024-01-01T00:00:00Z',
        },
        {
          assetId: 'stellar:USDC',
          decimals: 7,
          blockchain: 'stellar',
          symbol: 'USDC',
          price: 1,
          priceUpdatedAt: '2024-01-01T00:00:00Z',
          contractAddress: usdcToken.address,
          assetIssuer: usdcToken.issuer,
        },
        {
          assetId: 'near:native',
          decimals: 24,
          blockchain: TokenResponse.blockchain.NEAR,
          symbol: 'NEAR',
          price: 5,
          priceUpdatedAt: '2024-01-01T00:00:00Z',
        },
      ]),
    ).toHaveLength(2)
  })

  it('prefers native EVM tokens and XLM as chain defaults', () => {
    const tokens = filterSupportedTokens([
      {
        assetId: 'eth:usdc',
        decimals: 6,
        blockchain: TokenResponse.blockchain.ETH,
        symbol: 'USDC',
        price: 1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
        contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
      {
        assetId: 'eth:native',
        decimals: 18,
        blockchain: TokenResponse.blockchain.ETH,
        symbol: 'ETH',
        price: 2000,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
      },
      {
        assetId: 'stellar:USDC',
        decimals: 7,
        blockchain: 'stellar',
        symbol: 'USDC',
        price: 1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
        contractAddress: usdcToken.address,
        assetIssuer: usdcToken.issuer,
      },
      {
        assetId: 'stellar:XLM',
        decimals: 7,
        blockchain: 'stellar',
        symbol: 'XLM',
        price: 0.1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
      },
    ])

    expect(getDefaultTokenForChain(tokens, 1)?.symbol).toBe('ETH')
    expect(getDefaultTokenForChain(tokens, -4)?.symbol).toBe('XLM')
  })

  it('maps serializable token DTOs to app-native currency entries', () => {
    const tokens = filterSupportedTokens([
      {
        assetId: 'eth:native',
        decimals: 18,
        blockchain: TokenResponse.blockchain.ETH,
        symbol: 'ETH',
        price: 2000,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
      },
      {
        assetId: 'stellar:USDC',
        decimals: 7,
        blockchain: 'stellar',
        symbol: 'USDC',
        price: 1,
        priceUpdatedAt: '2024-01-01T00:00:00Z',
        contractAddress: usdcToken.address,
        assetIssuer: usdcToken.issuer,
      },
    ])

    const entries = mapNearIntentsTokensToCurrencyEntries(tokens)

    expect(entries).toHaveLength(2)
    expect(entries[0]?.assetId).toBe('eth:native')
    expect(getCurrencyParam(entries[0]!.currency)).toBe('NATIVE')
    expect(entries[1]?.currency).toMatchObject({
      address: usdcToken.address,
      issuer: usdcToken.issuer,
      symbol: 'USDC',
    })
    expect(getNearIntentsAssetId(entries, entries[1]?.currency)).toBe(
      'stellar:USDC',
    )
  })
})

describe('near-intents quote helpers', () => {
  it('uses MEMO deposits for Stellar and SIMPLE for EVM', () => {
    expect(getDepositMode(1)).toBe('SIMPLE')
    expect(getDepositMode(-4)).toBe('MEMO')
  })
})
