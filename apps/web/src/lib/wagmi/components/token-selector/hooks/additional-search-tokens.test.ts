import { Amount } from 'sushi'
import { EvmChainId, EvmNative, EvmToken, USDC } from 'sushi/evm'
import { STELLAR_USDT0, StellarChainId, StellarToken } from 'sushi/stellar'
import { SvmChainId, SvmToken, svmAddress } from 'sushi/svm'
import { describe, expect, it } from 'vitest'
import { shouldBypassTokenSecurityCheck } from '../token-lists/common/token-security-import-policy'
import {
  matchesCurrencySearch,
  mergeAdditionalSearchTokens,
} from './additional-search-tokens'
import { createTokenListToken } from './token-list-token'

const ethereum = EvmChainId.ETHEREUM
const token = new EvmToken({
  ...USDC[ethereum].toJSON(),
  metadata: {
    icon: 'https://example.com/token.png',
    approved: true,
    approvalStatus: 'APPROVED',
  },
})
const solana = new SvmToken({
  chainId: SvmChainId.SOLANA,
  address: svmAddress('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
})

describe('additional token discovery', () => {
  it('preserves Sushi primitives and icon metadata while requiring normal token import checks', () => {
    const [added] = mergeAdditionalSearchTokens(ethereum, [], [token])
    expect(added).toBeInstanceOf(EvmToken)
    expect(added.metadata).toMatchObject({
      approved: false,
      approvalStatus: 'UNKNOWN',
      icon: 'https://example.com/token.png',
    })
    expect(
      shouldBypassTokenSecurityCheck({
        chainId: ethereum,
        approvalStatus: added.metadata.approvalStatus,
      }),
    ).toBe(false)
    expect(Amount.fromHuman(added, '1.000001').amount).toBe(1_000_001n)
    expect(token.metadata.approved).toBe(true)
  })
  it('keeps authoritative listed metadata and deduplicates repeated discoveries', () => {
    const listed = createTokenListToken(ethereum, {
      ...USDC[ethereum].toJSON(),
      chainId: ethereum,
      approved: true,
      approvalStatus: 'APPROVED',
    })
    expect(
      mergeAdditionalSearchTokens(ethereum, [listed], [token, token]),
    ).toEqual([listed])
    const additions = mergeAdditionalSearchTokens(ethereum, [], [token, token])
    expect(additions).toHaveLength(1)
    expect(additions[0].metadata.approvalStatus).toBe('UNKNOWN')
  })
  it('excludes another chain and native currencies from additional token results', () => {
    expect(
      mergeAdditionalSearchTokens(
        ethereum,
        [],
        [USDC[EvmChainId.BASE], EvmNative.fromChainId(ethereum), solana],
      ),
    ).toEqual([])
  })
  it('searches symbols and names without case sensitivity, and matches EVM addresses regardless of casing', () => {
    for (const search of [' usdc ', 'USD COIN', token.address.toUpperCase()]) {
      expect(
        mergeAdditionalSearchTokens(ethereum, [], [token], search),
      ).toHaveLength(1)
    }
    expect(
      mergeAdditionalSearchTokens(ethereum, [], [token], 'unrelated'),
    ).toEqual([])
  })
  it('keeps Solana addresses case sensitive while retaining symbol search', () => {
    expect(
      mergeAdditionalSearchTokens(
        SvmChainId.SOLANA,
        [],
        [solana],
        solana.address,
      ),
    ).toHaveLength(1)
    expect(
      mergeAdditionalSearchTokens(
        SvmChainId.SOLANA,
        [],
        [solana],
        solana.address.toLowerCase(),
      ),
    ).toEqual([])
    expect(matchesCurrencySearch(solana, 'usd coin')).toBe(true)
    expect(
      mergeAdditionalSearchTokens(SvmChainId.SOLANA, [], [solana])[0],
    ).toBeInstanceOf(SvmToken)
  })
  it('preserves Stellar issuer metadata and uses exact address matching for custom lists', () => {
    const original = STELLAR_USDT0[StellarChainId.STELLAR]
    const [added] = mergeAdditionalSearchTokens(
      StellarChainId.STELLAR,
      [],
      [original],
    )
    expect(added).toBeInstanceOf(StellarToken)
    expect(added).toMatchObject({
      issuer: original.issuer,
      metadata: { approved: false, approvalStatus: 'UNKNOWN' },
    })
    expect(matchesCurrencySearch(original, original.address)).toBe(true)
    expect(
      matchesCurrencySearch(original, original.address.toLowerCase()),
    ).toBe(false)
  })
})
