import {
  LiquidityProviders,
  PoolCode,
  Router,
  UniV3PoolCode,
} from '@sushiswap/router'
import {
  approve,
  approveTestTokensToAlgebraPerifery,
  createAlgebraIntegralPeriphery,
  createHardhatProviderEmptyBlockchain,
  createRandomAlgebraPool,
  createTestTokens,
  deployContract,
  expectCloseValues,
} from '@sushiswap/tines-sandbox'
import { Address, createPublicClient, custom, walletActions } from 'viem'
import { hardhat } from 'viem/chains'

import RouteProcessor4 from '../artifacts/contracts/RouteProcessor4.sol/RouteProcessor4.json'

it('AlgebraIntegral RP4 Solo', async () => {
  const { provider, chainId } = await createHardhatProviderEmptyBlockchain(1)
  const client = createPublicClient({
    chain: {
      ...hardhat,
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 25770160,
        },
      },
      id: chainId,
    },
    transport: custom(provider),
  }).extend(walletActions)
  const env = await createAlgebraIntegralPeriphery(client)
  const testTokens = await createTestTokens(client, 2)
  await approveTestTokensToAlgebraPerifery(client, env, testTokens)
  const pool = await createRandomAlgebraPool(
    client,
    env,
    testTokens,
    env.deployer,
    'algebra test',
    100,
  )
  const rpAddress = await deployContract(
    client,
    RouteProcessor4,
    ['0x0000000000000000000000000000000000000000', []],
    env.deployer,
  )
  const user = testTokens.owner

  const pcMap: Map<string, PoolCode> = new Map()
  pcMap.set(
    pool.pool.address,
    new UniV3PoolCode(
      pool.pool,
      LiquidityProviders.AlgebraIntegral,
      LiquidityProviders.AlgebraIntegral,
    ),
  )
  const fromToken = testTokens.tokens[0]
  const toToken = testTokens.tokens[1]
  const amountIn = BigInt(10e18)

  const route = Router.findBestRoute(
    pcMap,
    chainId,
    fromToken,
    amountIn,
    toToken,
    50e9,
  )
  const rpParams = Router.routeProcessor4Params(
    pcMap,
    route,
    fromToken,
    toToken,
    user,
    rpAddress,
  )

  await approve(client, fromToken, user, rpAddress, amountIn)
  const amountOut = (await client.readContract({
    address: rpAddress,
    abi: RouteProcessor4.abi,
    functionName: 'processRoute',
    args: [
      rpParams.tokenIn as Address,
      rpParams.amountIn,
      rpParams.tokenOut as Address,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode,
    ],
    account: user,
  })) as bigint

  expectCloseValues(amountOut, route.amountOut, 1e-6)
})
