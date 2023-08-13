import { routeProcessor2Abi } from '@sushiswap/abi'
import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import { Extractor, FactoryV2, FactoryV3, LogFilterType, MultiCallAggregator, TokenManager } from '@sushiswap/extractor'
import { ConstantProductPoolCode, LiquidityProviders, NativeWrapProvider, PoolCode, Router } from '@sushiswap/router'
import { BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { getBigNumber, RouteStatus } from '@sushiswap/tines'
import {
  POOL_INIT_CODE_HASH,
  SUSHISWAP_V3_INIT_CODE_HASH,
  SushiSwapV3ChainId,
  V3_FACTORY_ADDRESS,
} from '@sushiswap/v3-sdk'
import { config } from '@sushiswap/viem-config'
import { Address, createPublicClient, http, Transport } from 'viem'
import { arbitrum, celo, Chain, mainnet, optimism, polygon, polygonZkEvm } from 'viem/chains'

export const RP3Address = {
  [ChainId.ETHEREUM]: '0x827179dD56d07A7eeA32e3873493835da2866976' as Address,
  [ChainId.POLYGON]: '0x0a6e511Fe663827b9cA7e2D2542b20B37fC217A6' as Address,
  [ChainId.ARBITRUM]: '0xfc506AaA1340b4dedFfd88bE278bEe058952D674' as Address,
  [ChainId.OPTIMISM]: '0x4C5D5234f232BD2D76B96aA33F5AE4FCF0E4BFAb' as Address,
  [ChainId.CELO]: '0x2f686751b19a9d91cc3d57d90150Bc767f050066' as Address,
  [ChainId.POLYGON_ZKEVM]: '0x2f686751b19a9d91cc3d57d90150Bc767f050066' as Address,
  [ChainId.AVALANCHE]: '0x717b7948AA264DeCf4D780aa6914482e5F46Da3e' as Address,
}

export const TickLensContract = {
  [ChainId.ETHEREUM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.POLYGON]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.ARBITRUM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.OPTIMISM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.CELO]: '0x5f115D9113F88e0a0Db1b5033D90D4a9690AcD3D' as Address,
  [ChainId.POLYGON_ZKEVM]: '0x0BE808376Ecb75a5CF9bB6D237d16cd37893d904' as Address,
  [ChainId.AVALANCHE]: '0xDdC1b5920723F774d2Ec2C3c9355251A20819776' as Address,
}

export const UniswapV2FactoryAddress: Record<number, string> = {
  [ChainId.ETHEREUM]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
}
function uniswapV2Factory(chain: ChainId): FactoryV2 {
  return {
    address: UniswapV2FactoryAddress[chain] as Address,
    provider: LiquidityProviders.UniswapV2,
    fee: 0.003,
    initCodeHash: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
  }
}

function sushiswapV2Factory(chain: ChainId): FactoryV2 {
  return {
    address: FACTORY_ADDRESS[chain] as Address,
    provider: LiquidityProviders.SushiSwapV2,
    fee: 0.003,
    initCodeHash: INIT_CODE_HASH[chain],
  }
}

export const UniswapV3FactoryAddress: Record<number, string> = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.POLYGON]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.ARBITRUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.OPTIMISM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.BSC]: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7',
  [ChainId.CELO]: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc',
}
function uniswapV3Factory(chain: ChainId): FactoryV3 {
  return {
    address: UniswapV3FactoryAddress[chain] as Address,
    provider: LiquidityProviders.UniswapV3,
    initCodeHash: POOL_INIT_CODE_HASH,
  }
}

function sushiswapV3Factory(chainId: SushiSwapV3ChainId) {
  return {
    address: V3_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.SushiSwapV3,
    initCodeHash: SUSHISWAP_V3_INIT_CODE_HASH[chainId],
  } as const
}

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

async function startInfinitTest(args: {
  transport?: Transport
  providerURL?: string
  chain: Chain
  factoriesV2: FactoryV2[]
  factoriesV3: FactoryV3[]
  tickHelperContract: Address
  cacheDir: string
  logDepth: number
  logType?: LogFilterType
  logging?: boolean
  maxCallsInOneBatch?: number
  RP3Address: Address
  account?: Address
}) {
  const transport = args.transport ?? http(args.providerURL)
  const client = createPublicClient({
    chain: args.chain,
    transport: transport,
  })
  const chainId = client.chain?.id as ChainId

  const extractor = new Extractor({ ...args, client })
  await extractor.start(BASES_TO_CHECK_TRADES_AGAINST[chainId])

  const nativeProvider = new NativeWrapProvider(chainId, client)
  const tokenManager = new TokenManager(
    extractor.extractorV2?.multiCallAggregator || (extractor.extractorV3?.multiCallAggregator as MultiCallAggregator),
    __dirname,
    `tokens-${client.chain?.id}`
  )
  await tokenManager.addCachedTokens()
  const tokens = BASES_TO_CHECK_TRADES_AGAINST[chainId].concat(Array.from(tokenManager.tokens.values()).slice(0, 100))
  for (;;) {
    for (let i = 1; i < tokens.length; ++i) {
      await delay(1000)
      const time0 = performance.now()
      const pools0 = extractor.getPoolCodesForTokens(BASES_TO_CHECK_TRADES_AGAINST[chainId].concat([tokens[i]]))
      const time1 = performance.now()
      const pools1 = await extractor.getPoolCodesForTokensAsync(
        BASES_TO_CHECK_TRADES_AGAINST[chainId].concat([tokens[i]]),
        2000
      )
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
      nativeProvider.getCurrentPoolList().forEach((p) => poolMap.set(p.pool.address, p))
      const fromToken = Native.onChain(chainId),
        toToken = tokens[i]
      const route = Router.findBestRoute(poolMap, chainId, fromToken, getBigNumber(1e18), toToken, 30e9)
      if (route.status == RouteStatus.NoWay) {
        console.log(`Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status} ` + timingLine)
        continue
      }
      const rpParams = Router.routeProcessor2Params(
        poolMap,
        route,
        fromToken,
        toToken,
        args.RP3Address,
        args.RP3Address
      )
      if (rpParams === undefined) {
        console.log(`Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status} ROUTE CREATION FAILED !!!`)
        continue
      }
      try {
        const amountOutReal = await client.readContract({
          address: args.RP3Address,
          abi: routeProcessor2Abi,
          // @ts-ignore
          functionName: 'processRoute',
          args: [
            rpParams.tokenIn as Address,
            BigInt(rpParams.amountIn.toString()),
            rpParams.tokenOut as Address,
            0n,
            rpParams.to as Address,
            rpParams.routeCode as Address, // !!!!
          ],
          value: BigInt(rpParams.value?.toString() as string),
          account: args.account,
        })
        const amountOutExp = BigInt(route.amountOutBI.toString())
        const diff =
          amountOutExp == 0n ? amountOutReal - amountOutExp : Number(amountOutReal - amountOutExp) / route.amountOut
        console.log(
          `Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.legs.length - 1} pools ` +
            timingLine +
            ` diff = ${diff > 0 ? '+' : ''}${diff} `
        )
        if (Math.abs(Number(diff)) > 0.001) console.log('Routing: TOO BIG DIFFERENCE !!!!!!!!!!!!!!!!!!!!!')
      } catch (e) {
        console.log('Routing failed. No connection ?')
      }
    }
  }
}

it.skip('Extractor Ethereum infinit work test', async () => {
  await startInfinitTest({
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
    factoriesV2: [uniswapV2Factory(ChainId.ETHEREUM), sushiswapV2Factory(ChainId.ETHEREUM)],
    factoriesV3: [uniswapV3Factory(ChainId.ETHEREUM)],
    tickHelperContract: TickLensContract[ChainId.ETHEREUM],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: RP3Address[ChainId.ETHEREUM],
  })
})

it.skip('Extractor Polygon infinit work test', async () => {
  await startInfinitTest({
    providerURL: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: polygon,
    factoriesV2: [
      sushiswapV2Factory(ChainId.POLYGON),
      {
        address: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
        provider: LiquidityProviders.QuickSwap,
        fee: 0.003,
        initCodeHash: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      },
    ],
    factoriesV3: [uniswapV3Factory(ChainId.POLYGON)],
    tickHelperContract: TickLensContract[ChainId.POLYGON],
    cacheDir: './cache',
    logDepth: 100,
    logging: true,
    RP3Address: RP3Address[ChainId.POLYGON],
  })
})

it.skip('Extractor Arbitrum infinit work test', async () => {
  await startInfinitTest({
    providerURL: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: arbitrum,
    factoriesV2: [],
    factoriesV3: [uniswapV3Factory(ChainId.ARBITRUM)],
    tickHelperContract: TickLensContract[ChainId.ARBITRUM],
    cacheDir: './cache',
    logDepth: 300,
    logType: LogFilterType.MultiCall,
    logging: true,
    RP3Address: RP3Address[ChainId.ARBITRUM],
  })
})

it.skip('Extractor Optimism infinit work test', async () => {
  await startInfinitTest({
    providerURL: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: optimism,
    factoriesV2: [],
    factoriesV3: [uniswapV3Factory(ChainId.OPTIMISM)],
    tickHelperContract: TickLensContract[ChainId.OPTIMISM],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: RP3Address[ChainId.OPTIMISM],
    account: '0x4200000000000000000000000000000000000006', // just a whale because optimism eth_call needs gas (
  })
})

it.skip('Extractor Celo infinit work test', async () => {
  await startInfinitTest({
    providerURL: `https://forno.celo.org`,
    chain: celo,
    factoriesV2: [sushiswapV2Factory(ChainId.CELO)],
    factoriesV3: [uniswapV3Factory(ChainId.CELO)],
    tickHelperContract: TickLensContract[ChainId.CELO],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: RP3Address[ChainId.CELO],
  })
})

it.skip('Extractor Polygon zkevm infinit work test', async () => {
  await startInfinitTest({
    providerURL: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: polygonZkEvm,
    factoriesV2: [],
    factoriesV3: [
      sushiswapV3Factory(ChainId.POLYGON_ZKEVM),
      {
        address: '0xdE474Db1Fa59898BC91314328D29507AcD0D593c' as Address,
        provider: LiquidityProviders.DovishV3,
        initCodeHash: '0xd3e7f58b9af034cfa7a0597e539bae7c6b393817a47a6fc1e1503cd6eaffe22a',
      },
    ],
    tickHelperContract: TickLensContract[ChainId.POLYGON_ZKEVM],
    cacheDir: './cache',
    logDepth: 1000,
    logType: LogFilterType.SelfFilter,
    logging: true,
    maxCallsInOneBatch: 5,
    RP3Address: RP3Address[ChainId.POLYGON_ZKEVM],
  })
})

it.skip('Extractor AVALANCH infinit work test', async () => {
  await startInfinitTest({
    transport: config[ChainId.AVALANCHE].transport,
    chain: config[ChainId.AVALANCHE].chain as Chain,
    factoriesV2: [
      sushiswapV2Factory(ChainId.AVALANCHE),
      {
        address: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10' as Address,
        provider: LiquidityProviders.TraderJoe,
        fee: 0.003,
        initCodeHash: '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91',
      },
    ],
    factoriesV3: [sushiswapV3Factory(ChainId.AVALANCHE)],
    tickHelperContract: TickLensContract[ChainId.AVALANCHE],
    cacheDir: './cache',
    logDepth: 100,
    logging: true,
    RP3Address: RP3Address[ChainId.AVALANCHE],
  })
})

// have been fixed in 1.4.2
it.skip('viem issue #1', async () => {
  const client = createPublicClient({
    chain: polygonZkEvm,
    transport: http(`https://polygonzkevm-mainnet.g.alchemy.com/v2/demo`),
  })
  const res = await client.multicall({
    allowFailure: true,
    contracts: [
      {
        address: '0x6aa981bff95edfea36bdae98c26b274ffcafe8d3',
        abi: [
          {
            inputs: [],
            name: 'liquidity',
            outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'liquidity',
      },
    ],
  })
  console.log(res)
  // const r = await fetch(`https://polygonzkevm-mainnet.g.alchemy.com/v2/demo`, {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     jsonrpc: '2.0',
  //     id: 1,
  //     method: 'eth_blockNumber',
  //     params: [],
  //   }),
  // })
  // const res = await r.json()
  // console.log(r.status, res)
})

it.skip('Alchemy issue #1', async () => {
  // const client = createPublicClient({
  //   chain: polygonZkEvm,
  //   transport: http(`https://polygonzkevm-mainnet.g.alchemy.com/v2/demo`),
  // })
  // const UniV3EventsAbi = parseAbiItem(
  //   'event Mint(address sender, address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)'
  // )
  // const res = await client.getLogs({
  //   blockHash: '0x17695bbbc7cb24f056472d70db4725a0ccb91aa1d8a3863c5c1fadba2916b966',
  //   event: UniV3EventsAbi,
  // })
  // console.log(res.map((e) => e.eventName))

  const r = await fetch(`https://polygonzkevm-mainnet.g.alchemy.com/v2/demo`, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getLogs',
      params: [
        {
          blockHash: '0x17695bbbc7cb24f056472d70db4725a0ccb91aa1d8a3863c5c1fadba2916b966',
          topics: ['0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde'],
        },
      ],
    }),
  })
  const res = await r.json()
  console.log(r.status, res.result.length)
})
