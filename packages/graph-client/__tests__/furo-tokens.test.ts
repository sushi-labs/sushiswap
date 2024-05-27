import { getBuiltGraphSDK } from '../.graphclient/index.js'
import { FURO_SUPPORTED_CHAIN_IDS } from 'sushi/config'

describe('Furo Tokens', () => {
  const sdk = getBuiltGraphSDK()

  it.skip('should return some tokens with liquidity', async () => {
    const { tokens } = await sdk.furoTokensByChainIds({
      chainIds: FURO_SUPPORTED_CHAIN_IDS,
      where: { liquidityShares_gt: 0 },
    })
    expect(tokens.length).toBeGreaterThanOrEqual(1)
  })
})
