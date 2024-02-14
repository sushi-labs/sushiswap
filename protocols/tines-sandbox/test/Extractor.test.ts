import {
  Extractor,
  FactoryV2,
  FactoryV3,
  LogFilterType,
  MultiCallAggregator,
  TokenManager,
} from '@sushiswap/extractor'
import {
  ConstantProductPoolCode,
  LiquidityProviders,
  NativeWrapProvider,
  PoolCode,
  Router,
} from '@sushiswap/router'
import { BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { RouteStatus, getBigInt } from '@sushiswap/tines'
import {
  SUSHISWAP_V2_FACTORY_ADDRESS,
  SUSHISWAP_V2_INIT_CODE_HASH,
} from '@sushiswap/v2-sdk'
import {
  PANCAKESWAP_V3_DEPLOYER_ADDRESS,
  PANCAKESWAP_V3_FACTORY_ADDRESS,
  PANCAKESWAP_V3_FEE_SPACING_MAP,
  PANCAKESWAP_V3_INIT_CODE_HASH,
  POOL_INIT_CODE_HASH,
  PancakeSwapV3ChainId,
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_INIT_CODE_HASH,
  SUSHISWAP_V3_TICK_LENS,
  SushiSwapV3ChainId,
} from '@sushiswap/v3-sdk'
import { config } from '@sushiswap/viem-config'
import { routeProcessor2Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { Native, Token } from 'sushi/currency'
import { http, Address, Transport, createPublicClient } from 'viem'
import {
  Chain,
  arbitrum,
  arbitrumNova,
  celo,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
} from 'viem/chains'

export const RP3Address = {
  [ChainId.ETHEREUM]: '0x827179dD56d07A7eeA32e3873493835da2866976' as Address,
  [ChainId.POLYGON]: '0x0a6e511Fe663827b9cA7e2D2542b20B37fC217A6' as Address,
  [ChainId.ARBITRUM]: '0xfc506AaA1340b4dedFfd88bE278bEe058952D674' as Address,
  [ChainId.ARBITRUM_NOVA]:
    '0x05689fCfeE31FCe4a67FbC7Cab13E74F80A4E288' as Address,
  [ChainId.OPTIMISM]: '0x4C5D5234f232BD2D76B96aA33F5AE4FCF0E4BFAb' as Address,
  [ChainId.CELO]: '0x2f686751b19a9d91cc3d57d90150Bc767f050066' as Address,
  [ChainId.POLYGON_ZKEVM]:
    '0x2f686751b19a9d91cc3d57d90150Bc767f050066' as Address,
  [ChainId.AVALANCHE]: '0x717b7948AA264DeCf4D780aa6914482e5F46Da3e' as Address,
  [ChainId.BASE]: '0x0BE808376Ecb75a5CF9bB6D237d16cd37893d904' as Address,
  [ChainId.BSC]: '0xd36990D74b947eC4Ad9f52Fe3D49d14AdDB51E44' as Address,
}

export const TickLensContract = {
  [ChainId.ETHEREUM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.POLYGON]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.ARBITRUM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.OPTIMISM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.CELO]: '0x5f115D9113F88e0a0Db1b5033D90D4a9690AcD3D' as Address,
  [ChainId.POLYGON_ZKEVM]:
    '0x0BE808376Ecb75a5CF9bB6D237d16cd37893d904' as Address,
  [ChainId.AVALANCHE]: '0xDdC1b5920723F774d2Ec2C3c9355251A20819776' as Address,
  [ChainId.BASE]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3' as Address,
  [ChainId.BSC]: '0xD9270014D396281579760619CCf4c3af0501A47C' as Address,
}

export const UniswapV2FactoryAddress: Record<number, string> = {
  [ChainId.ETHEREUM]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
}
export function uniswapV2Factory(chain: ChainId): FactoryV2 {
  return {
    address: UniswapV2FactoryAddress[chain] as Address,
    provider: LiquidityProviders.UniswapV2,
    fee: 0.003,
    initCodeHash:
      '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
  }
}

function sushiswapV2Factory(chain: ChainId): FactoryV2 {
  return {
    address: SUSHISWAP_V2_FACTORY_ADDRESS[chain] as Address,
    provider: LiquidityProviders.SushiSwapV2,
    fee: 0.003,
    initCodeHash: SUSHISWAP_V2_INIT_CODE_HASH[chain],
  }
}

export const UniswapV3FactoryAddress: Record<number, string> = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.POLYGON]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.ARBITRUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.OPTIMISM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.BSC]: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7',
  [ChainId.CELO]: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc',
  [ChainId.BASE]: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
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
    address: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.SushiSwapV3,
    initCodeHash: SUSHISWAP_V3_INIT_CODE_HASH[chainId],
  } as const
}

export function pancakeswapV3Factory(chainId: PancakeSwapV3ChainId) {
  return {
    address: PANCAKESWAP_V3_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.PancakeSwapV3,
    initCodeHash: PANCAKESWAP_V3_INIT_CODE_HASH[chainId],
    deployer: PANCAKESWAP_V3_DEPLOYER_ADDRESS[chainId],
    feeSpacingMap: PANCAKESWAP_V3_FEE_SPACING_MAP,
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
  checkTokens?: Token[]
}) {
  const transport = args.transport ?? http(args.providerURL)
  const client = createPublicClient({
    chain: args.chain,
    transport: transport,
  })
  const chainId = client.chain?.id as ChainId

  const extractor = new Extractor({ ...args, client })
  await extractor.start(
    BASES_TO_CHECK_TRADES_AGAINST[chainId].concat(args.checkTokens ?? []),
  )

  const nativeProvider = new NativeWrapProvider(chainId, client)
  const tokenManager = new TokenManager(
    extractor.extractorV2?.multiCallAggregator ||
      (extractor.extractorV3?.multiCallAggregator as MultiCallAggregator),
    __dirname,
    `tokens-${client.chain?.id}`,
  )
  await tokenManager.addCachedTokens()
  const tokens =
    args.checkTokens ??
    BASES_TO_CHECK_TRADES_AGAINST[chainId].concat(
      Array.from(tokenManager.tokens.values()).slice(0, 100),
    )
  for (;;) {
    for (let i = 0; i < tokens.length; ++i) {
      await delay(1000)
      const time0 = performance.now()
      const pools0 = extractor.getPoolCodesForTokens(
        BASES_TO_CHECK_TRADES_AGAINST[chainId].concat([tokens[i]]),
      )
      const time1 = performance.now()
      const pools1 = await extractor.getPoolCodesForTokensAsync(
        BASES_TO_CHECK_TRADES_AGAINST[chainId].concat([tokens[i]]),
        2000,
      )
      const time2 = performance.now()
      const pools0_2 = pools0.filter(
        (p) => p instanceof ConstantProductPoolCode,
      ).length
      const pools0_3 = pools0.length - pools0_2
      const pools1_2 = pools1.filter(
        (p) => p instanceof ConstantProductPoolCode,
      ).length
      const pools1_3 = pools1.length - pools1_2
      const timingLine =
        `sync: (${pools0_2}, ${pools0_3}) pools ${Math.round(
          time1 - time0,
        )}ms` +
        `, async: (${pools1_2}, ${pools1_3}) pools ${Math.round(
          time2 - time1,
        )}ms`

      const pools = pools1
      const poolMap = new Map<string, PoolCode>()
      pools.forEach((p) => poolMap.set(p.pool.address, p))
      nativeProvider
        .getCurrentPoolList()
        .forEach((p) => poolMap.set(p.pool.address, p))
      const fromToken = Native.onChain(chainId)
      const toToken = tokens[i]
      const route = Router.findBestRoute(
        poolMap,
        chainId,
        fromToken,
        getBigInt(1e18),
        toToken,
        30e9,
      )
      if (route.status === RouteStatus.NoWay) {
        console.log(
          `Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status} ` +
            timingLine,
        )
        continue
      }
      const rpParams = Router.routeProcessor2Params(
        poolMap,
        route,
        fromToken,
        toToken,
        args.RP3Address,
        args.RP3Address,
      )
      if (rpParams === undefined) {
        console.log(
          `Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status} ROUTE CREATION FAILED !!!`,
        )
        continue
      }
      try {
        const { result: amountOutReal } = (await client.simulateContract({
          address: args.RP3Address,
          abi: routeProcessor2Abi,
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
        })) as { result: bigint }
        const amountOutExp = BigInt(route.amountOutBI.toString())
        const diff =
          amountOutExp === 0n
            ? amountOutReal - amountOutExp
            : Number(amountOutReal - amountOutExp) / route.amountOut
        console.log(
          `Routing: ${fromToken.symbol} => ${toToken.symbol} ${
            route.legs.length - 1
          } pools ` +
            timingLine +
            ` diff = ${diff > 0 ? '+' : ''}${diff} `,
        )
        if (Math.abs(Number(diff)) > 0.001)
          console.log('Routing: TOO BIG DIFFERENCE !!!!!!!!!!!!!!!!!!!!!')
      } catch (e) {
        console.log(`Routing failed. No connection ? ${e}`)
      }
    }
  }
}

it.skip('Extractor Ethereum infinite work test', async () => {
  await startInfinitTest({
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
    factoriesV2: [sushiswapV2Factory(ChainId.ETHEREUM)],
    factoriesV3: [], //uniswapV3Factory(ChainId.ETHEREUM)],
    tickHelperContract: TickLensContract[ChainId.ETHEREUM],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: RP3Address[ChainId.ETHEREUM],
  })
})

it.skip('Extractor Polygon infinite work test', async () => {
  await startInfinitTest({
    providerURL: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: polygon,
    factoriesV2: [
      sushiswapV2Factory(ChainId.POLYGON),
      {
        address: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
        provider: LiquidityProviders.QuickSwap,
        fee: 0.003,
        initCodeHash:
          '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
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

const drpcId = process.env['DRPC_ID'] || process.env['NEXT_PUBLIC_DRPC_ID']
it.skip('Extractor Arbitrum infinite work test', async () => {
  await startInfinitTest({
    //providerURL: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    providerURL: `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${drpcId}`,
    chain: arbitrum,
    factoriesV2: [sushiswapV2Factory(ChainId.ARBITRUM)],
    factoriesV3: [uniswapV3Factory(ChainId.ARBITRUM)],
    tickHelperContract: TickLensContract[ChainId.ARBITRUM],
    cacheDir: './cache',
    logDepth: 300,
    logType: LogFilterType.Native,
    logging: true,
    RP3Address: RP3Address[ChainId.ARBITRUM],
  })
})

it.skip('Extractor Arbitrum Nova infinite work test', async () => {
  await startInfinitTest({
    providerURL: `https://lb.drpc.org/ogrpc?network=arbitrum-nova&dkey=${drpcId}`,
    chain: arbitrumNova,
    factoriesV2: [sushiswapV2Factory(ChainId.ARBITRUM_NOVA)],
    factoriesV3: [sushiswapV3Factory(ChainId.ARBITRUM_NOVA)],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.ARBITRUM_NOVA],
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
    logType: LogFilterType.Native,
    RP3Address: RP3Address[ChainId.ARBITRUM_NOVA],
    account: '0xc882b111a75c0c657fc507c04fbfcd2cc984f071',
  })
})

it.skip('Extractor Optimism infinite work test', async () => {
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

it.skip('Extractor Celo infinite work test', async () => {
  await startInfinitTest({
    providerURL: 'https://forno.celo.org',
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

it.skip('Extractor Polygon zkevm infinite work test', async () => {
  await startInfinitTest({
    providerURL: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: polygonZkEvm,
    factoriesV2: [],
    factoriesV3: [
      sushiswapV3Factory(ChainId.POLYGON_ZKEVM),
      {
        address: '0xdE474Db1Fa59898BC91314328D29507AcD0D593c' as Address,
        provider: LiquidityProviders.DovishV3,
        initCodeHash:
          '0xd3e7f58b9af034cfa7a0597e539bae7c6b393817a47a6fc1e1503cd6eaffe22a',
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

it.skip('Extractor AVALANCH infinite work test', async () => {
  await startInfinitTest({
    transport: config[ChainId.AVALANCHE].transport,
    chain: config[ChainId.AVALANCHE].chain as Chain,
    factoriesV2: [
      sushiswapV2Factory(ChainId.AVALANCHE),
      {
        address: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10' as Address,
        provider: LiquidityProviders.TraderJoe,
        fee: 0.003,
        initCodeHash:
          '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91',
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

it.skip('Extractor Base infinite work test', async () => {
  await startInfinitTest({
    ...config[ChainId.BASE],
    chain: config[ChainId.BASE].chain as Chain,
    factoriesV2: [
      sushiswapV2Factory(ChainId.BASE),
      {
        address: '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB' as Address,
        provider: LiquidityProviders.BaseSwap,
        fee: 0.0025,
        initCodeHash:
          '0xb618a2730fae167f5f8ac7bd659dd8436d571872655bcb6fd11f2158c8a64a3b',
      },
    ],
    factoriesV3: [
      sushiswapV3Factory(ChainId.BASE),
      uniswapV3Factory(ChainId.BASE),
    ],
    tickHelperContract: TickLensContract[ChainId.BASE],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: RP3Address[ChainId.BASE],
    account: '0x4200000000000000000000000000000000000006', // just a whale because base eth_call needs gas (
    // checkTokens: [
    //   new Token({
    //     chainId: ChainId.BASE,
    //     address: '0x8544fe9d190fd7ec52860abbf45088e81ee24a8c',
    //     symbol: 'TOSHI',
    //     name: 'Toshi',
    //     decimals: 18,
    //   }),
    //   new Token({
    //     chainId: ChainId.BASE,
    //     address: '0xa4220a2B0Cb10BF5FDC3B8c3D9E13728f5E7ca56',
    //     symbol: 'MOCHI',
    //     name: 'Moshi',
    //     decimals: 18,
    //   }),
    // new Token({
    //   chainId: ChainId.BASE,
    //   address: '0x93980959778166ccbB95Db7EcF52607240bc541e',
    //   name: 'bpsTEST',
    //   symbol: 'bpsTEST',
    //   decimals: 18,
    // }),
    // ],
  })
})

it.skip('Extractor BSC infinite work test', async () => {
  await startInfinitTest({
    transport: config[ChainId.BSC].transport,
    chain: config[ChainId.BSC].chain as Chain,
    factoriesV2: [],
    factoriesV3: [pancakeswapV3Factory(ChainId.BSC)],
    tickHelperContract: TickLensContract[ChainId.BSC],
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
    RP3Address: RP3Address[ChainId.BSC],
  })
})
