import { Amount } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { STELLAR_USDT0, StellarChainId } from 'sushi/stellar'
import { SvmChainId } from 'sushi/svm'
import { describe, expect, it } from 'vitest'
import type { ValueTransferChain, ValueTransferToken } from './schemas'
import {
  getValueTransferChainId,
  getValueTransferCurrencyKey,
  getValueTransferCurrencyParam,
  mapValueTransferToken,
} from './tokens'

const nativeEth: ValueTransferToken = {
  chainKey: 'base',
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  decimals: 18,
  symbol: 'ETH',
  name: 'Ether',
  isSupported: true,
}
const base: ValueTransferChain = {
  name: 'Base',
  shortName: 'Base',
  chainKey: 'base',
  chainType: 'EVM',
  chainId: EvmChainId.BASE,
  nativeCurrency: nativeEth,
}
const nativeSol: ValueTransferToken = {
  chainKey: 'solana',
  address: 'So11111111111111111111111111111111111111111',
  decimals: 9,
  symbol: 'SOL',
  name: 'Solana',
  isSupported: true,
}
const solana: ValueTransferChain = {
  name: 'Solana',
  shortName: 'Solana',
  chainKey: 'solana',
  chainType: 'SOLANA',
  // LayerZero uses 1 here; this is not Ethereum's chain ID.
  chainId: 1,
  nativeCurrency: nativeSol,
}
const stellar: ValueTransferChain = {
  name: 'Stellar',
  shortName: 'Stellar',
  chainKey: 'stellar',
  chainType: 'STELLAR',
  chainId: '7ac33997544e3175d266bd022439b22cdb16508c01163f26e5cb2a3e1045a979',
  nativeCurrency: {
    chainKey: 'stellar',
    address: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
    decimals: 7,
    symbol: 'XLM',
    name: 'Lumen',
  },
}

describe('Value Transfer currency catalog', () => {
  it('resolves VM identity before numerical chain IDs', () => {
    expect(getValueTransferChainId(solana)).toBe(SvmChainId.SOLANA)
    expect(getValueTransferChainId(stellar)).toBe(StellarChainId.STELLAR)
    expect(
      getValueTransferChainId({
        ...base,
        chainId: 999,
        chainType: 'HYPERCORE',
        chainKey: 'hypercore',
      }),
    ).toBeUndefined()
    expect(
      getValueTransferChainId({
        ...base,
        chainId: 999,
        chainType: 'EVM',
        chainKey: 'hyperliquid',
      }),
    ).toBe(EvmChainId.HYPEREVM)
    expect(
      getValueTransferChainId({ ...solana, chainKey: 'unknown-solana-fork' }),
    ).toBeUndefined()
  })

  it('matches EVM native placeholders without depending on checksum casing', () => {
    const entry = mapValueTransferToken(
      { ...nativeEth, address: nativeEth.address.toLowerCase() },
      base,
    )
    expect(entry?.currency.type).toBe('native')
    expect(entry?.currency.chainId).toBe(EvmChainId.BASE)
    expect(entry && getValueTransferCurrencyParam(entry.currency)).toBe(
      'NATIVE',
    )
  })

  it('normalizes EVM catalog lookup casing without changing non-EVM addresses', () => {
    const checksum = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    expect(getValueTransferCurrencyKey(EvmChainId.BASE, checksum)).toBe(
      getValueTransferCurrencyKey(EvmChainId.BASE, checksum.toLowerCase()),
    )
    expect(
      getValueTransferCurrencyKey(SvmChainId.SOLANA, nativeSol.address),
    ).not.toBe(
      getValueTransferCurrencyKey(
        SvmChainId.SOLANA,
        nativeSol.address.toLowerCase(),
      ),
    )
  })

  it.each([false, undefined])(
    'does not expose tokens unless the upstream explicitly supports them (%s)',
    (isSupported) => {
      expect(
        mapValueTransferToken({ ...nativeEth, isSupported }, base),
      ).toBeUndefined()
    },
  )

  it('does not map tokens onto a different chain or an unsupported wallet VM', () => {
    expect(
      mapValueTransferToken({ ...nativeEth, chainKey: 'arbitrum' }, base),
    ).toBeUndefined()
    expect(
      mapValueTransferToken(nativeEth, { ...base, chainType: 'STARKNET' }),
    ).toBeUndefined()
    expect(
      mapValueTransferToken({ ...nativeEth, address: nativeSol.address }, base),
    ).toBeUndefined()
  })

  it('keeps Solana native SOL and wrapped SOL distinct', () => {
    const native = mapValueTransferToken(nativeSol, solana)
    const wrapped = mapValueTransferToken(
      {
        ...nativeSol,
        address: 'So11111111111111111111111111111111111111112',
        symbol: 'WSOL',
        name: 'Wrapped SOL',
      },
      solana,
    )
    expect(native?.currency.type).toBe('native')
    expect(wrapped?.currency.type).toBe('token')
    expect(native?.currency.id).not.toBe(wrapped?.currency.id)
    expect(wrapped && getValueTransferCurrencyParam(wrapped.currency)).toBe(
      'So11111111111111111111111111111111111111112',
    )
  })

  it('preserves provider decimals and metadata when constructing Sushi tokens', () => {
    const token: ValueTransferToken = {
      chainKey: 'base',
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
      isSupported: true,
      icon: 'https://example.com/usdc.png',
      price: { usd: 0.9998 },
    }
    const entry = mapValueTransferToken(token, base)
    expect(entry?.currency.decimals).toBe(6)
    expect(entry?.currency.symbol).toBe('USDC')
    expect(entry?.currency.metadata?.icon).toBe(token.icon)
    expect(entry && Amount.fromHuman(entry.currency, '1.000001').amount).toBe(
      1_000_001n,
    )
    expect(entry?.token.price?.usd).toBe(0.9998)
  })

  it('retains logoUrl while keeping provider tokens subject to import checks', () => {
    const token = {
      ...nativeEth,
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      logoUrl: 'https://example.com/token.png',
    }
    expect(mapValueTransferToken(token, base)?.currency.metadata).toMatchObject(
      { icon: token.logoUrl, approved: false, approvalStatus: 'UNKNOWN' },
    )
  })

  it('reuses known Stellar USDT0 identity when the upstream calls it USDT', () => {
    const known = STELLAR_USDT0[StellarChainId.STELLAR]
    const entry = mapValueTransferToken(
      {
        chainKey: 'stellar',
        address: known.address,
        decimals: 7,
        symbol: 'USDT',
        name: 'USD₮0',
        isSupported: true,
      },
      stellar,
    )
    expect(entry?.currency).toMatchObject({
      id: known.id,
      issuer: known.issuer,
      symbol: known.symbol,
      metadata: { approved: false, approvalStatus: 'UNKNOWN' },
    })
    expect(entry?.currency.decimals).toBe(7)
  })
})
