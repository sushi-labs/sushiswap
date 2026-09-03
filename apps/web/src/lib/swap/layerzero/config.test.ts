import {
  STELLAR_USDC,
  STELLAR_USDT0,
  STELLAR_XLM,
  StellarChainId,
} from 'sushi/stellar'
import { describe, expect, it } from 'vitest'
import {
  LAYERZERO_SUPPORTED_CHAIN_IDS,
  LAYERZERO_USDT0_EVM_DEPLOYMENTS,
  getLayerZeroDecimals,
  getLayerZeroTokenAddress,
  isLayerZeroChainId,
  isLayerZeroUsdt0Route,
} from './config'
import { getLayerZeroCurrency } from './tokens'

const stellarUsdt0 = STELLAR_USDT0[StellarChainId.STELLAR]
const ethereumUsdt = LAYERZERO_USDT0_EVM_DEPLOYMENTS[1].tokenAddress

describe('LayerZero USDT0 routing', () => {
  it('supports both directions for native USDT0 deployments', () => {
    for (const chainId of LAYERZERO_SUPPORTED_CHAIN_IDS) {
      if (chainId === StellarChainId.STELLAR) continue
      const address = getLayerZeroTokenAddress(chainId)
      expect(
        isLayerZeroUsdt0Route(-4, chainId, stellarUsdt0.address, address),
      ).toBe(true)
      expect(
        isLayerZeroUsdt0Route(chainId, -4, address, stellarUsdt0.address),
      ).toBe(true)
    }
  })

  it('leaves EVM pairs, Stellar XLM and Stellar USDC on their existing providers', () => {
    expect(
      isLayerZeroUsdt0Route(
        1,
        42161,
        ethereumUsdt,
        getLayerZeroTokenAddress(42161),
      ),
    ).toBe(false)
    expect(
      isLayerZeroUsdt0Route(-4, 1, STELLAR_XLM[-4].address, ethereumUsdt),
    ).toBe(false)
    expect(
      isLayerZeroUsdt0Route(1, -4, ethereumUsdt, STELLAR_USDC[-4].address),
    ).toBe(false)
    expect(
      isLayerZeroUsdt0Route(-4, -4, stellarUsdt0.address, stellarUsdt0.address),
    ).toBe(false)
  })

  it('does not route arbitrary assets or unsupported chains through LayerZero', () => {
    expect(isLayerZeroUsdt0Route(1, -4, 'NATIVE', stellarUsdt0.address)).toBe(
      false,
    )
    expect(
      isLayerZeroUsdt0Route(8453, -4, ethereumUsdt, stellarUsdt0.address),
    ).toBe(false)
    expect(isLayerZeroChainId(8453)).toBe(false)
  })

  it('allows the matching EVM token to default after a network change', () => {
    expect(isLayerZeroUsdt0Route(1, -4, undefined, stellarUsdt0.address)).toBe(
      true,
    )
    expect(isLayerZeroUsdt0Route(-4, 1, stellarUsdt0.address, undefined)).toBe(
      true,
    )
    expect(isLayerZeroUsdt0Route(1, -4, ethereumUsdt, undefined)).toBe(false)
  })

  it('keeps the Stellar SAC, issuer and decimals from the Sushi token configuration', () => {
    for (const chainId of LAYERZERO_SUPPORTED_CHAIN_IDS) {
      expect(getLayerZeroTokenAddress(chainId)).toBe(
        getLayerZeroCurrency(chainId).address,
      )
    }
    expect(getLayerZeroCurrency(-4)).toBe(stellarUsdt0)
    expect(getLayerZeroDecimals(-4)).toBe(7)
    expect(getLayerZeroDecimals(1)).toBe(6)
    expect(getLayerZeroCurrency(1).address.toLowerCase()).toBe(
      ethereumUsdt.toLowerCase(),
    )
    expect(LAYERZERO_USDT0_EVM_DEPLOYMENTS[1].oftAddress).not.toBe(ethereumUsdt)
  })
})
