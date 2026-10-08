import { describe, expect, it } from 'vitest'
import { isValueTransferHypeRoute } from './hype-route'

const hypeRoute = {
  chainId0: 999,
  token0Param: 'NATIVE',
  chainId1: 4663,
  token1Param: '0xd6AdcE5eac5F40d29e2101436C38cF1ceE8F4856',
}

describe('HYPE Value Transfer preference', () => {
  it('matches OFT addresses regardless of casing', () => {
    expect(
      isValueTransferHypeRoute({
        chainId0: 42161,
        token0Param: '0x0e867974275cd31c25015c2753c9d75f9f355379',
        chainId1: 4663,
        token1Param: hypeRoute.token1Param.toLowerCase(),
      }),
    ).toBe(true)
  })

  it.each([
    ['missing source token', { token0Param: undefined }],
    ['missing destination token', { token1Param: undefined }],
    ['missing destination chain', { chainId1: undefined }],
    ['native token on another chain', { chainId0: 1 }],
    ['OFT address on another chain', { chainId1: 42161 }],
    [
      'adapter instead of native HYPE',
      { token0Param: '0x0e867974275Cd31C25015C2753C9d75F9f355379' },
    ],
    [
      'wrapped HYPE instead of native HYPE',
      { token0Param: '0x5555555555555555555555555555555555555555' },
    ],
    ['native token instead of an OFT', { token1Param: 'NATIVE' }],
    [
      'another destination token',
      { token1Param: '0x1111111111111111111111111111111111111111' },
    ],
    ['same-chain transfer', { chainId1: 999, token1Param: 'NATIVE' }],
  ])('does not override routing for %s', (_name, overrides) => {
    expect(isValueTransferHypeRoute({ ...hypeRoute, ...overrides })).toBe(false)
  })
})
