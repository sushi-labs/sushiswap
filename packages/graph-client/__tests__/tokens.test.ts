import { getBuiltGraphSDK } from '../.graphclient/index.js'

// TOKENS BY CHAIN IDS
// ;(async () => {
//   const chainIds = [1, 137]
//   const { tokens } = await sdk.TokensByChainIds({ chainIds: [1, 137] })
//   console.log(`Tokens by chainIds ${chainIds.join(', ')}`, tokens)
// })()

// // TOKEN BY CHAIN ID
// ;(async () => {
//   const chainId = 1
//   const { tokens } = await sdk.TokensByChainId({ chainId })
//   console.log(`Tokens by chainId ${chainId}`, tokens)
// })()

// // TOKEN BY ID (chainId:address)
// ;(async () => {
//   // ETHEREUM-WETH
//   const id = '1:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
//   const { token } = await sdk.TokenById({ id })
//   console.log(`Token by id ${id}`, token)
// })()

describe('Tokens', () => {
  const sdk = getBuiltGraphSDK()
  const chainIds = [1, 137]
  it.skip('should return tokens for multiple chain ids', async () => {
    const { tokens } = await sdk.TokensByChainIds({ chainIds })
    expect(
      chainIds.every((chainId) =>
        tokens.find((token) => chainId === token.chainId),
      ),
    ).toBe(true)
  })
  it.skip('should return 2000 tokens for multiple chain ids', async () => {
    const { tokens } = await sdk.TokensByChainIds({ chainIds, first: 1000 })
    // console.log({ tokens })
    expect(tokens.length).toBe(2000)
  })
})
