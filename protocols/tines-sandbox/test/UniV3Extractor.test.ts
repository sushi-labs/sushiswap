import { ChainId } from '@sushiswap/chain'
import { DAI, USDC, WBTC, WETH9, WNATIVE } from '@sushiswap/currency'
import { PoolInfo, UniV3Extractor } from '@sushiswap/extractor'
import { UniswapV3Provider } from '@sushiswap/router'
import { expect } from 'chai'
import { network } from 'hardhat'
import { createPublicClient, custom } from 'viem'
import { hardhat } from 'viem/chains'

import { comparePoolCodes } from '../src/ComparePoolCodes'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

const pools: PoolInfo[] = [
  {
    address: '0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168',
    token0: DAI[ChainId.ETHEREUM],
    token1: USDC[ChainId.ETHEREUM],
    fee: 100,
  },
  {
    address: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640',
    token0: USDC[ChainId.ETHEREUM],
    token1: WNATIVE[ChainId.ETHEREUM],
    fee: 500,
  },
  {
    address: '0xCBCdF9626bC03E24f779434178A73a0B4bad62eD',
    token0: WBTC[ChainId.ETHEREUM],
    token1: WETH9[ChainId.ETHEREUM],
    fee: 3000,
  },
]

const poolSet = new Set(pools.map((p) => p.address.toLowerCase()))

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

  const extractor = new UniV3Extractor(client, 'UniswapV3', '0xbfd8137f7d1516d3ea5ca83523914859ec47f573')
  extractor.start(pools)

  const uniProvider = new UniswapV3Provider(ChainId.ETHEREUM, client)
  await uniProvider.fetchPoolsForToken(USDC[ChainId.ETHEREUM], WETH9[ChainId.ETHEREUM], {
    has: (poolAddress: string) => !poolSet.has(poolAddress.toLowerCase()),
  })
  const providerPools = uniProvider.getCurrentPoolList()

  for (;;) {
    if (extractor.getStablePoolCodes().length == pools.length) break
    await delay(500)
  }
  const extractorPools = extractor.getStablePoolCodes()

  providerPools.forEach((pp) => {
    const ep = extractorPools.find((p) => p.pool.address == pp.pool.address)
    expect(ep).not.undefined
    if (ep) comparePoolCodes(pp, ep)
  })
})
