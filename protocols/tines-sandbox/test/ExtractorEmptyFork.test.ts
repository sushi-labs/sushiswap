import { routeProcessor2Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { Native, Token } from '@sushiswap/currency'
import {
  Extractor,
  FactoryAlgebra,
  FactoryV2,
  FactoryV3,
  LogFilterType,
  MultiCallAggregator,
  TokenManager,
} from '@sushiswap/extractor'
import { ConstantProductPoolCode, LiquidityProviders, NativeWrapProvider, PoolCode, Router } from '@sushiswap/router'
import { findMultiRouteExactIn, getBigInt, RouteStatus, RToken } from '@sushiswap/tines'
import { Abi, Address, createPublicClient, custom, Hex, http, Transport, walletActions } from 'viem'
import { Chain, hardhat } from 'viem/chains'

import {
  approveTestTokensToAlgebraPerifery,
  approveTestTokensToContract,
  createAlgebraIntegralPeriphery,
  createHardhatProviderEmptyBlockchain,
  createRandomAlgebraPool,
  createTestTokens,
  getDeploymentAddress,
} from '../src'
import MultiCall3 from './Multicall3.sol/Multicall3.json'
import RouteProcessor4 from './RouteProcessor4.sol/RouteProcessor4.json'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

async function startInfinitTest(args: {
  transport?: Transport
  providerURL?: string
  chain: Chain
  factoriesV2?: FactoryV2[]
  factoriesV3?: FactoryV3[]
  factoriesAlgebra?: FactoryAlgebra[]
  tickHelperContract: Address
  cacheDir: string
  logDepth: number
  logType?: LogFilterType
  logging?: boolean
  maxCallsInOneBatch?: number
  RP4Address: Address
  account?: Address
  tokens: Token[]
  testEnvironment?: boolean
}) {
  const transport = args.transport ?? http(args.providerURL)
  const client = createPublicClient({
    chain: args.chain,
    transport: transport,
  })
  const chainId = client.chain?.id as ChainId

  const extractor = new Extractor({ ...args, client })
  await extractor.start(args.tokens)

  const nativeProvider = args.testEnvironment ? undefined : new NativeWrapProvider(chainId, client)
  const tokenManager = new TokenManager(
    extractor.extractorV2?.multiCallAggregator || (extractor.extractorV3?.multiCallAggregator as MultiCallAggregator),
    __dirname,
    `tokens-${client.chain?.id}`
  )
  await tokenManager.addCachedTokens()
  const tokens = args.tokens
  for (;;) {
    for (let i = 0; i < tokens.length; ++i) {
      await delay(1000)
      const time0 = performance.now()
      const pools0 = extractor.getPoolCodesForTokens(tokens)
      const time1 = performance.now()
      const pools1 = await extractor.getPoolCodesForTokensAsync(tokens, 2000)
      const time2 = performance.now()
      const pools0_2 = pools0.filter((p) => p instanceof ConstantProductPoolCode).length
      const pools0_3 = pools0.length - pools0_2
      const pools1_2 = pools1.filter((p) => p instanceof ConstantProductPoolCode).length
      const pools1_3 = pools1.length - pools1_2
      const timingLine =
        `sync: (${pools0_2}, ${pools0_3}) pools ${Math.round(time1 - time0)}ms` +
        `, async: (${pools1_2}, ${pools1_3}) pools ${Math.round(time2 - time1)}ms`

      const pools = pools1
      const poolMap = new Map<string, PoolCode>()
      pools.forEach((p) => poolMap.set(p.pool.address, p))
      if (nativeProvider) nativeProvider.getCurrentPoolList().forEach((p) => poolMap.set(p.pool.address, p))
      const fromToken = args.testEnvironment ? tokens[(i + 1) % tokens.length] : Native.onChain(chainId),
        toToken = tokens[i]
      const route = args.testEnvironment
        ? findMultiRouteExactIn(
            fromToken as RToken,
            toToken as RToken,
            1e12,
            pools.map((p) => p.pool),
            args.tokens[0] as RToken,
            30e9
          )
        : Router.findBestRoute(poolMap, chainId, fromToken, getBigInt(1e18), toToken, 30e9)
      if (route.status === RouteStatus.NoWay) {
        console.log(`Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status} ` + timingLine)
        continue
      }
      const rpParams = Router.routeProcessor2Params(
        poolMap,
        route,
        fromToken,
        toToken,
        args.RP4Address,
        args.RP4Address
      )
      if (rpParams === undefined) {
        console.log(`Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status} ROUTE CREATION FAILED !!!`)
        continue
      }
      try {
        const { result: amountOutReal } = await client.simulateContract({
          address: args.RP4Address,
          abi: routeProcessor2Abi,
          // @ ts-ignore
          functionName: 'processRoute',
          args: [
            rpParams.tokenIn as Address,
            BigInt(rpParams.amountIn.toString()),
            rpParams.tokenOut as Address,
            0n,
            rpParams.to as Address,
            rpParams.routeCode as Address, // !!!!
          ],
          value: rpParams.value,
          account: args.account,
        })
        const amountOutExp = BigInt(route.amountOutBI.toString())
        const diff =
          amountOutExp === 0n ? amountOutReal - amountOutExp : Number(amountOutReal - amountOutExp) / route.amountOut
        console.log(
          `Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.legs.length - 1} pools ` +
            timingLine +
            ` diff = ${diff > 0 ? '+' : ''}${diff} `
        )
        if (Math.abs(Number(diff)) > 0.001) console.log('Routing: TOO BIG DIFFERENCE !!!!!!!!!!!!!!!!!!!!!')
      } catch (e) {
        console.log(`Routing failed. No connection ? ${e}`)
      }
    }
  }
}

async function createEmptyAlgebraEnvorinment(
  poolNumber: number,
  positionNumber: number
): Promise<{
  transport: Transport
  //chain: Chain
  factory: Address
  tickLens: Address
  RP4: Address
  MultiCall3: Address
  tokenOwner: Address
  tokens: Token[]
}> {
  const tokenNumber = Math.ceil(0.5 + Math.sqrt(1 + 8 * poolNumber) / 2)
  const { provider, chainId } = await createHardhatProviderEmptyBlockchain()
  const transport = custom(provider)
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
    transport,
  }).extend(walletActions)
  const env = await createAlgebraIntegralPeriphery(client)
  const testTokens = await createTestTokens(client, tokenNumber)
  await approveTestTokensToAlgebraPerifery(client, env, testTokens)
  for (let i = 0; i < poolNumber; ++i) {
    await createRandomAlgebraPool(client, env, testTokens, testTokens.owner, 'full extractor test', positionNumber)
  }

  const RP4 = await getDeploymentAddress(
    client,
    client.deployContract({
      chain: null,
      abi: RouteProcessor4.abi as Abi,
      bytecode: RouteProcessor4.bytecode as Hex,
      account: env.deployer as Address,
      args: ['0x0000000000000000000000000000000000000000', []],
    })
  )
  await approveTestTokensToContract(client, RP4, testTokens)

  const MultiCall3Address = await getDeploymentAddress(
    client,
    client.deployContract({
      chain: null,
      abi: MultiCall3.abi as Abi,
      bytecode: MultiCall3.bytecode as Hex,
      account: env.deployer as Address,
    })
  )

  return {
    transport,
    //chain,
    factory: env.factoryAddress,
    tickLens: env.TickLensAddress,
    RP4,
    MultiCall3: MultiCall3Address,
    tokens: testTokens.tokens,
    tokenOwner: testTokens.owner,
  }
}

it('Extractor Hardhat Algebra test', async () => {
  const { transport, factory, tickLens, RP4, tokens, tokenOwner, MultiCall3 } = await createEmptyAlgebraEnvorinment(
    3,
    10
  )
  await startInfinitTest({
    transport,
    chain: {
      ...hardhat,
      contracts: {
        multicall3: {
          address: MultiCall3,
          blockCreated: 1,
        },
      },
    },
    factoriesAlgebra: [{ address: factory, provider: LiquidityProviders.AlgebraIntegral }],
    tickHelperContract: tickLens,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP4Address: RP4,
    tokens,
    testEnvironment: true,
    account: tokenOwner,
  })
})
