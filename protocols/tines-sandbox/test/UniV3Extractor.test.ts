import { UniV3Extractor } from '@sushiswap/extractor'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

it('1 pool', async () => {
  const transport = http(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`)
  const client = createPublicClient({
    chain: mainnet,
    transport,
  })
  const extractor = new UniV3Extractor(client, 'UniswapV3', '0xbfd8137f7d1516d3ea5ca83523914859ec47f573')
  extractor.start([])
})
