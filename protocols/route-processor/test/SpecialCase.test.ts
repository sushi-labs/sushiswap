import { DataFetcher, LiquidityProviders, Router } from '@sushiswap/router'
import { ChainId } from 'sushi/chain'
import { FRAX, USDC } from 'sushi/currency'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const liquidityProviders = [
  LiquidityProviders.CurveSwap,
  //LiquidityProviders.SushiSwapV2  // No ETH pools if this line commented off
]

it('Router returns 0 gas spent ((', async () => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(
      `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    ),
  })
  const dataFetcher = new DataFetcher(ChainId.ETHEREUM, client)
  dataFetcher.startDataFetching(liquidityProviders)
  const fromToken = FRAX[ChainId.ETHEREUM]
  const toToken = USDC[ChainId.ETHEREUM]
  await dataFetcher.fetchPoolsForToken(fromToken, toToken)
  const pcMap = dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)
  debugger
  const route = Router.findBestRoute(
    pcMap,
    ChainId.ETHEREUM,
    fromToken,
    10_000_000_000_000_000_000n,
    toToken,
    30e9,
    liquidityProviders,
  )
  console.log(route)
})
