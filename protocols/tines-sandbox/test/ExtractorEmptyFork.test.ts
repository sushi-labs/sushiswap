import {
  Extractor,
  FactoryAlgebra,
  FactoryV2,
  FactoryV3,
  LogFilterType,
  getAlgebraPoolAddress,
} from '@sushiswap/extractor'
import { routeProcessor2Abi } from 'sushi/abi'
import { Token } from 'sushi/currency'
import {
  ConstantProductPoolCode,
  LiquidityProviders,
  PoolCode,
  Router,
} from 'sushi/router'
import { RToken, RouteStatus, findMultiRouteExactIn } from 'sushi/tines'
import {
  Abi,
  Address,
  Hex,
  PublicClient,
  Transport,
  WalletClient,
  createPublicClient,
  custom,
  walletActions,
} from 'viem'
import { Chain, hardhat } from 'viem/chains'
import {
  AlgebraIntegralPeriphery,
  TestTokens,
  algebraPoolBurn,
  algebraPoolMint,
  algebraPoolSwap,
  algebraPoolTickLiquidityPrice,
  approveTestTokensToAlgebraPerifery,
  approveTestTokensToContract,
  createAlgebraIntegralPeriphery,
  createHardhatProviderEmptyBlockchain,
  createRandomAlgebraPool,
  createTestTokens,
  getDeploymentAddress,
  getInitCodeHash,
} from '../src/index.js'
import MultiCall3 from './Multicall3.sol/Multicall3.json' assert {
  type: 'json',
}
import RouteProcessor4 from './RouteProcessor4.sol/RouteProcessor4.json' assert {
  type: 'json',
}

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

async function startInfinitTest(args: {
  transport: Transport
  chain: Chain
  factoriesV2?: FactoryV2[]
  factoriesV3?: FactoryV3[]
  factoriesAlgebra?: FactoryAlgebra[]
  tickHelperContractV3: Address
  tickHelperContractAlgebra: Address
  cacheDir: string
  logDepth: number
  logType?: LogFilterType
  logging?: boolean
  maxCallsInOneBatch?: number
  RP4Address: Address
  account?: Address
  tokens: Token[]
}) {
  const client = createPublicClient({
    chain: args.chain,
    transport: args.transport,
  })

  const extractor = new Extractor({ ...args, client })
  await extractor.start(args.tokens)

  const tokens = args.tokens
  for (;;) {
    for (let i = 0; i < tokens.length; ++i) {
      for (let j = 0; j < tokens.length; ++j) {
        if (i === j) continue
        await delay(1000)
        const time0 = performance.now()
        const pools0 = extractor.getPoolCodesForTokens(tokens)
        const time1 = performance.now()
        const pools1 = await extractor.getPoolCodesForTokensAsync(tokens, 2000)
        const time2 = performance.now()
        const pools0_2 = pools0.filter(
          (p) => p instanceof ConstantProductPoolCode,
        ).length
        const pools0_3 = pools0.length - pools0_2
        const pools1_2 = pools1.filter(
          (p) => p instanceof ConstantProductPoolCode,
        ).length
        const pools1_3 = pools1.length - pools1_2
        const timingLine = `sync: (${pools0_2}, ${pools0_3}) pools ${Math.round(
          time1 - time0,
        )}ms, async: (${pools1_2}, ${pools1_3}) pools ${Math.round(
          time2 - time1,
        )}ms`

        const pools = pools1
        const poolMap = new Map<string, PoolCode>()
        pools.forEach((p) => poolMap.set(p.pool.address, p))
        const fromToken = tokens[i]
        const toToken = tokens[j]
        const route = findMultiRouteExactIn(
          fromToken as RToken,
          toToken as RToken,
          1e12,
          pools.map((p) => p.pool),
          tokens[0] as RToken,
          30e9,
        )
        if (route.status === RouteStatus.NoWay) {
          console.log(
            `Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status} ${timingLine}`,
          )
          continue
        }
        const rpParams = Router.routeProcessor2Params(
          poolMap,
          route,
          fromToken,
          toToken,
          args.RP4Address,
          args.RP4Address,
        )
        if (rpParams === undefined) {
          console.log(
            `Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status} ROUTE CREATION FAILED !!!`,
          )
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
            amountOutExp === 0n
              ? amountOutReal - amountOutExp
              : Number(amountOutReal - amountOutExp) / route.amountOut
          console.log(
            `Routing: ${fromToken.symbol} => ${toToken.symbol} ${
              route.legs.length - 1
            } pools ${timingLine} diff = ${diff > 0 ? '+' : ''}${diff} `,
          )
          if (Math.abs(Number(diff)) > 0.001)
            console.log('Routing: TOO BIG DIFFERENCE !!!!!!!!!!!!!!!!!!!!!')
        } catch (e) {
          console.log(`Routing failed. No connection ? ${e}`)
        }
      }
    }
  }
}

async function simulateUserActivity(
  client: PublicClient & WalletClient,
  env: AlgebraIntegralPeriphery,
  testTokens: TestTokens,
  delayValue: number,
) {
  const tokens = testTokens.tokens
  const codeInitHash = (await getInitCodeHash(client, env)) as Hex
  for (;;) {
    for (let i = 0; i < tokens.length; ++i)
      for (let j = 0; j < tokens.length; ++j) {
        if (i === j) continue
        await delay(delayValue)
        try {
          const amountIn = BigInt(1e12)
          const amountOut = await algebraPoolSwap(
            client,
            env,
            tokens[i],
            tokens[j],
            testTokens.owner,
            amountIn,
          )
          console.log(
            `Swap simulation: ${amountIn} ${tokens[i].symbol} => ${amountOut} ${tokens[j].symbol} `,
          )
        } catch (_e) {
          //
        }
      }
    const positions: { tokenId: bigint; liquidity: bigint }[] = []
    for (let i = 0; i < tokens.length; ++i)
      for (let j = i + 1; j < tokens.length; ++j) {
        await delay(delayValue)
        try {
          const poolAddress = getAlgebraPoolAddress(
            env.poolDeployerAddress,
            tokens[i].address as Address,
            tokens[j].address as Address,
            codeInitHash,
          )
          const amountIn = BigInt(1e12)
          const { tick } = await algebraPoolTickLiquidityPrice(
            client,
            poolAddress,
          )
          const closestSpacingTick = Math.round(Number(tick) / 120) * 120
          const range = {
            from: closestSpacingTick - 120,
            to: closestSpacingTick + 120,
            val: amountIn,
          }
          const { tokenId, liquidityActual } = await algebraPoolMint(
            client,
            env,
            tokens[i],
            tokens[j],
            testTokens.owner,
            range,
          )
          positions.push({ tokenId, liquidity: liquidityActual })
          console.log(
            `Mint simulation: ${tokens[i].symbol} => ${tokens[j].symbol} tokenId=${tokenId}`,
          )
        } catch (_e) {
          // console.log(e)
        }
      }
    for (let i = 0; i < positions.length; ++i) {
      await delay(delayValue)
      try {
        await algebraPoolBurn(
          client,
          env,
          testTokens.owner,
          positions[i].tokenId,
          positions[i].liquidity,
        )
        console.log(`Burn simulation: ${positions[i].tokenId}`)
      } catch (_e) {
        // console.log(e)
      }
    }
  }
}

async function createEmptyAlgebraEnvorinment(
  poolNumber: number,
  positionNumber: number,
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
    await createRandomAlgebraPool(
      client,
      env,
      testTokens,
      testTokens.owner,
      `full extractor test ${i}`,
      positionNumber,
    )
  }

  const RP4 = await getDeploymentAddress(
    client,
    client.deployContract({
      chain: null,
      abi: RouteProcessor4.abi as Abi,
      bytecode: RouteProcessor4.bytecode as Hex,
      account: env.deployer as Address,
      args: ['0x0000000000000000000000000000000000000000', []],
    }),
  )
  await approveTestTokensToContract(client, RP4, testTokens)

  const MultiCall3Address = await getDeploymentAddress(
    client,
    client.deployContract({
      chain: null,
      abi: MultiCall3.abi as Abi,
      bytecode: MultiCall3.bytecode as Hex,
      account: env.deployer as Address,
    }),
  )

  // no awaiting - let's work in parallel
  simulateUserActivity(client, env, testTokens, 5000)

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
  const { transport, factory, tickLens, RP4, tokens, tokenOwner, MultiCall3 } =
    await createEmptyAlgebraEnvorinment(3, 10)
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
    factoriesAlgebra: [
      { address: factory, provider: LiquidityProviders.AlgebraIntegral },
    ],
    tickHelperContractV3: '' as Address,
    tickHelperContractAlgebra: tickLens,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP4Address: RP4,
    tokens,
    account: tokenOwner,
  })
})
