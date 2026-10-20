import { EvmChainId, EvmNative, EvmToken, SUSHI, USDC } from 'sushi/evm'
import { SvmChainId } from 'sushi/svm'
import { describe, expect, it } from 'vitest'
import { isSushiToken, isSushiTokenChainId } from './functions'

describe('isSushiTokenChainId', () => {
  it('recognizes chains with registered SUSHI deployments', () => {
    for (const chainId of [
      EvmChainId.ETHEREUM,
      EvmChainId.ARBITRUM,
      EvmChainId.ROBINHOOD,
    ]) {
      expect(isSushiTokenChainId(chainId)).toBe(true)
    }
  })

  it('rejects chains without a registered SUSHI deployment', () => {
    expect(isSushiTokenChainId(EvmChainId.BASE)).toBe(false)
    expect(isSushiTokenChainId(SvmChainId.SOLANA)).toBe(false)
  })
})

describe('isSushiToken', () => {
  it.each([
    EvmChainId.ETHEREUM,
    EvmChainId.ARBITRUM,
    EvmChainId.ROBINHOOD,
  ] as const)('recognizes canonical SUSHI on chain %s', (chainId) => {
    expect(isSushiToken(SUSHI[chainId])).toBe(true)
  })

  it('does not identify a token by its SUSHI name or symbol', () => {
    const token = new EvmToken({
      ...USDC[EvmChainId.ETHEREUM].toJSON(),
      symbol: 'SUSHI',
      name: 'SushiToken',
    })

    expect(isSushiToken(token)).toBe(false)
  })

  it('requires the SUSHI address for the selected chain', () => {
    const token = new EvmToken({
      ...SUSHI[EvmChainId.ETHEREUM].toJSON(),
      chainId: EvmChainId.ARBITRUM,
    })

    expect(isSushiToken(token)).toBe(false)
  })

  it('rejects tokens on chains without a registered SUSHI deployment', () => {
    const token = new EvmToken({
      ...SUSHI[EvmChainId.ETHEREUM].toJSON(),
      chainId: EvmChainId.BASE,
    })

    expect(isSushiToken(token)).toBe(false)
  })

  it('rejects native and missing currencies', () => {
    expect(isSushiToken(EvmNative.fromChainId(EvmChainId.ETHEREUM))).toBe(false)
    expect(isSushiToken(undefined)).toBe(false)
  })
})
