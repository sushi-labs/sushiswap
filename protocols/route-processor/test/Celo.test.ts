import { ChainId } from '@sushiswap/chain'
import { Native, Token, Type, WNATIVE } from '@sushiswap/currency'
import { DataFetcher, Router } from '@sushiswap/router'
import { getBigNumber, RouteStatus } from '@sushiswap/tines'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'

//const RouteProcessorAddr = '0x9B3fF703FA9C8B467F5886d7b61E61ba07a9b51c'
const RouteProcessorAddr = '0x3e1116eA5034f5D73a7B530071709D54A4109F5f' // new Route Processor

const cUSD = new Token({
  chainId: ChainId.CELO,
  address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
  decimals: 18,
  symbol: 'cUSD',
  name: 'Celo Dollar',
})

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

async function makeSwap(
  dataFetcher: DataFetcher,
  fromToken: Type,
  toToken: Type,
  from: string,
  to: string,
  amountIn: BigNumber
): Promise<number | undefined> {
  let route
  for (let i = 0; i < 10; ++i) {
    // try to find a route
    route = Router.findBestRoute(dataFetcher, fromToken, amountIn, toToken, 50 * 1e9)
    if (route.status == RouteStatus.Success) break
    await delay(1000)
  }
  expect(route?.status).equal(RouteStatus.Success)

  if (route) {
    const rpParams = Router.routeProcessorParams(dataFetcher, route, fromToken, toToken, to, RouteProcessorAddr)

    const coder = new ethers.utils.AbiCoder()
    const callArgs = coder.encode(
      ['address', 'uint256', 'address', 'uint256', 'address', 'bytes'],
      [rpParams.tokenIn, rpParams.amountIn, rpParams.tokenOut, rpParams.amountOutMin, rpParams.to, rpParams.routeCode]
    )
    const callData = '0x2646478b' + callArgs.substring(2)
    const params: Record<string, string> = {
      from,
      to: RouteProcessorAddr,
      data: callData,
    }
    if (rpParams.value !== undefined) {
      const val = '0x' + Number(parseInt(rpParams.value?.toString() as string)).toString(16)
      params.value = val
    }

    const call = await ethers.utils.fetchJson(
      `https://celo-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      JSON.stringify({
        method: 'eth_call',
        params: [params, 'latest'],
        id: 1,
        jsonrpc: '2.0',
      })
    )
    if (call.result) {
      return parseInt(call.result)
    }
    console.log(call)
  }
}

if (process.env.INFURA_API_KEY) {
  describe('Celo test', () => {
    it('Celo test', async () => {
      const chainId = ChainId.CELO

      const provider = new ethers.providers.JsonRpcProvider(
        `https://celo-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        42220
      )

      const dataFetcher = new DataFetcher(provider, chainId)
      dataFetcher.startDataFetching()

      const amountOut = await makeSwap(
        dataFetcher,
        Native.onChain(chainId),
        cUSD,
        WNATIVE[chainId].address,
        '0x0000000000000000000000000000000000000001',
        getBigNumber(10 * 1e18)
      )

      console.log(amountOut)
    })
  })
}
