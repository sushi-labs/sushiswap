import { EvmChainId } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { generatePairwiseScenarios } from './scenario-generator'

const tokenA = '0x0000000000000000000000000000000000000001' as const
const tokenB = '0x0000000000000000000000000000000000000002' as const
const tokenC = '0x0000000000000000000000000000000000000003' as const

describe('generatePairwiseScenarios', () => {
  it('is deterministic, unique, and never emits same-token swaps', () => {
    const space = {
      allowanceStates: ['zero', 'unlimited'] as const,
      amountBuckets: ['safe', 'tiny'] as const,
      chainIds: [EvmChainId.ETHEREUM, EvmChainId.BASE] as const,
      inputTokens: [tokenA, tokenB] as const,
      outputTokens: [tokenA, tokenC] as const,
      rpcFaultProfiles: ['none', 'stale-receipt'] as const,
      seeds: [1, 2] as const,
      slippageModes: ['default', 'tight'] as const,
      viewports: ['desktop', 'mobile'] as const,
      walletModes: ['mock', 'injected'] as const,
    }
    const first = generatePairwiseScenarios('matrix', space)
    const second = generatePairwiseScenarios('matrix', space)

    expect(first).toEqual(second)
    expect(new Set(first.map(({ key }) => key)).size).toBe(first.length)
    expect(
      first.every(({ inputToken, outputToken }) => inputToken !== outputToken),
    ).toBe(true)
    expect(
      first.some(
        ({ chainId, viewport }) =>
          chainId === EvmChainId.BASE && viewport === 'mobile',
      ),
    ).toBe(true)
  })
})
