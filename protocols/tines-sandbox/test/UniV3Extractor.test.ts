import { ChainId } from '@sushiswap/chain'
import { USDC, WNATIVE } from '@sushiswap/currency'
import { UniV3Extractor } from '@sushiswap/extractor'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

it('1 pool', async () => {
  const transport = http(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`)
  const client = createPublicClient({
    chain: mainnet,
    transport,
  })
  debugger
  const extractor = new UniV3Extractor(client, 'UniswapV3', '0xbfd8137f7d1516d3ea5ca83523914859ec47f573')
  extractor.start([
    {
      address: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
      token0: USDC[ChainId.ETHEREUM],
      token1: WNATIVE[ChainId.ETHEREUM],
      fee: 500,
    },
  ])
})
