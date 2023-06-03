import { ChainId } from '@sushiswap/chain'
import { USDC, WNATIVE } from '@sushiswap/currency'
import { UniV3Extractor } from '@sushiswap/extractor'
import { UniswapV3Provider } from '@sushiswap/router'
import { network } from 'hardhat'
import { createPublicClient, custom } from 'viem'
import { hardhat } from 'viem/chains'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

it('1 pool', async () => {
  // const transport = http(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`)
  // const client = createPublicClient({
  //   chain: mainnet,
  //   transport,
  // })
  const client = createPublicClient({
    chain: {
      ...hardhat,
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 14353601,
        },
      },
    },
    transport: custom(network.provider),
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

  const uniProvider = new UniswapV3Provider(ChainId.ETHEREUM, client)
  await uniProvider.fetchPoolsForToken(USDC[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], {
    has: (poolAddress: string) => poolAddress.toLowerCase() !== '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
  })
  const providerPools = uniProvider.getCurrentPoolList()

  for (;;) {
    if (extractor.getPoolCodes().length == 1) break
    await delay(500)
  }
  console.log(providerPools[0])
  console.log(extractor.getPoolCodes()[0])
})
