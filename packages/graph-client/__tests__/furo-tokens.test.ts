import { FURO_SUBGRAPH_URL } from '@sushiswap/graph-config'
import { getBuiltGraphSDK } from '../.graphclient/index.js'

describe('Furo Tokens', () => {
  const sdk = getBuiltGraphSDK()
  const chainIds = Object.keys(FURO_SUBGRAPH_URL).map((key) => Number(key))

  it.skip('should return some tokens with liquidity', async () => {
    const { tokens } = await sdk.furoTokensByChainIds({
      chainIds,
      where: { liquidityShares_gt: 0 },
    })
    expect(tokens.length).toBeGreaterThanOrEqual(1)
  })
})
