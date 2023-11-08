import { getBuiltGraphSDK } from '../.graphclient/index.js'

describe('Pairs', () => {
  const sdk = getBuiltGraphSDK()
  const chainIds = [1, 137]
  it.skip('should return pairs for multiple chain ids', async () => {
    const { pairs } = await sdk.PairsByChainIds({ chainIds })
    expect(
      chainIds.every((chainId) =>
        pairs.find((token) => chainId === token.chainId),
      ),
    ).toBe(true)
  })
  it.skip('should return 2000 tokens for multiple chain ids', async () => {
    const { pairs } = await sdk.PairsByChainIds({ chainIds, first: 1000 })
    expect(pairs.length).toBe(2000)
  })
})
