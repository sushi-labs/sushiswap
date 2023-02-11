import { ChainId } from '@sushiswap/chain'
import { Native, Token, Type, WNATIVE } from '@sushiswap/currency'
import { DataFetcher, Router } from '@sushiswap/router'
import { getBigNumber, RouteStatus } from '@sushiswap/tines'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'

const RouteProcessorAddr = '0x9B3fF703FA9C8B467F5886d7b61E61ba07a9b51c'

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
      [
        rpParams.tokenIn,
        0, //rpParams.amountIn,
        rpParams.tokenOut,
        rpParams.amountOutMin,
        rpParams.to,
        //rpParams.routeCode,
        //'0x04471EcE3750Da237f93B8E339c536989b8978a438014DA9471c101e0cac906E52DF4f00943b21863efFffff0a4DA9471c101e0cac906E52DF4f00943b21863efF471EcE3750Da237f93B8E339c536989b8978a438010000000000000000000000000000000000000001',
        '0x05471EcE3750Da237f93B8E339c536989b8978a43800',
      ]
    )
    const callData = '0x2646478b' + callArgs.substring(2)

    // Simple one pool swap code
    // 04 471EcE3750Da237f93B8E339c536989b8978a438 01 4DA9471c101e0cac906E52DF4f00943b21863efF ffff
    // distributeERC20Shares<celo_token>01<pool addr><share>
    // 0a 4DA9471c101e0cac906E52DF4f00943b21863efF 471EcE3750Da237f93B8E339c536989b8978a438 01 471EcE3750Da237f93B8E339c536989b8978a438
    // swapUniswapPool pool celo direction to(celo)

    const val = '0x' + Number(parseInt(rpParams.value?.toString() as string)).toString(16)

    const call = await ethers.utils.fetchJson(
      `https://celo-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      JSON.stringify({
        method: 'eth_call',
        params: [
          {
            from,
            to: RouteProcessorAddr,
            value: val,
            data: callData,
          },
          'latest',
        ],
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
    it.only('Celo test', async () => {
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
