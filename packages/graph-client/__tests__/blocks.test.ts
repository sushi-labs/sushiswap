import { getBuiltGraphSDK } from '..'

describe('Blocks', () => {
  const sdk = getBuiltGraphSDK()
  const chainIds = [1, 137]
  it.skip('should return blocks for multiple chain ids', async () => {
    const { blocks } = await sdk.BlocksByChainIds({ chainIds })
    expect(
      chainIds.every((chainId) =>
        blocks.find((block) => chainId === block.chainId),
      ),
    ).toBe(true)
  })
})
