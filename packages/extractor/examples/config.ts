import { ChainId } from '@sushiswap/chain'
import { LiquidityProviders } from '@sushiswap/router'
import {
  SUSHISWAP_V2_FACTORY_ADDRESS,
  SUSHISWAP_V2_INIT_CODE_HASH,
  SushiSwapV2ChainId,
  UNISWAP_V2_FACTORY_ADDRESS,
  UNISWAP_V2_INIT_CODE_HASH,
} from '@sushiswap/v2-sdk'
import {
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_INIT_CODE_HASH,
  SUSHISWAP_V3_TICK_LENS,
  SushiSwapV3ChainId,
  UNISWAP_V3_FACTORY_ADDRESS,
  UNISWAP_V3_INIT_CODE_HASH,
  UniswapV3ChainId,
} from '@sushiswap/v3-sdk'
import { config } from '@sushiswap/viem-config'
import { Address, createPublicClient } from 'viem'

import { LogFilterType } from '../src/LogFilter2'

export const SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM,
  // ChainId.ARBITRUM_NOVA,
  // ChainId.AVALANCHE,
  // ChainId.BOBA,
  // ChainId.BOBA_AVAX,
  // ChainId.BOBA_BNB,
  // ChainId.BSC,
  // ChainId.CELO,
  ChainId.ETHEREUM,
  // ChainId.FANTOM,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  // ChainId.POLYGON_ZKEVM,
  ChainId.BASE,
] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export const isSupportedChainId = (chainId: number): chainId is SupportedChainId =>
  SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId)

export const ROUTE_PROCESSOR_3_ADDRESS = {
  [ChainId.ARBITRUM]: '0xfc506AaA1340b4dedFfd88bE278bEe058952D674' as Address,
  [ChainId.ARBITRUM_NOVA]: '0x05689fCfeE31FCe4a67FbC7Cab13E74F80A4E288' as Address,
  [ChainId.AVALANCHE]: '0x717b7948AA264DeCf4D780aa6914482e5F46Da3e' as Address,
  [ChainId.BOBA]: '0xbe811a0d44e2553d25d11cb8dc0d3f0d0e6430e6' as Address,
  [ChainId.BOBA_AVAX]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3' as Address,
  [ChainId.BOBA_BNB]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3' as Address,
  [ChainId.BSC]: '0x400d75dAb26bBc18D163AEA3e83D9Ea68F6c1804' as Address,
  [ChainId.BTTC]: '0x7A4af156379f512DE147ed3b96393047226d923F' as Address,
  [ChainId.CELO]: '0x2f686751b19a9d91cc3d57d90150Bc767f050066' as Address,
  [ChainId.ETHEREUM]: '0x827179dD56d07A7eeA32e3873493835da2866976' as Address,
  [ChainId.FANTOM]: '0x2214A42d8e2A1d20635c2cb0664422c528B6A432' as Address,
  [ChainId.FUSE]: '0xaa26771d497814E81D305c511Efbb3ceD90BF5bd' as Address,
  [ChainId.GNOSIS]: '0xBBDe1d67297329148Fe1ED5e6B00114842728e65' as Address,
  [ChainId.HARMONY]: '0xBBDe1d67297329148Fe1ED5e6B00114842728e65' as Address,
  [ChainId.HECO]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F' as Address,
  [ChainId.KAVA]: '0x145d82bCa93cCa2AE057D1c6f26245d1b9522E6F' as Address,
  [ChainId.METIS]: '0x258f7E97149afd7D7F84fa63b10e4A3f0C38B788' as Address,
  [ChainId.MOONBEAM]: '0x843D0AAD40295f2198ef528ad747CDF6AB9000e4' as Address,
  [ChainId.MOONRIVER]: '0x7af71799C40F952237eAA4D81A77C1af49125113' as Address,
  [ChainId.OKEX]: '0x0BE808376Ecb75a5CF9bB6D237d16cd37893d904' as Address,
  [ChainId.OPTIMISM]: '0x4C5D5234f232BD2D76B96aA33F5AE4FCF0E4BFAb' as Address,
  [ChainId.PALM]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3' as Address,
  [ChainId.POLYGON]: '0x0a6e511Fe663827b9cA7e2D2542b20B37fC217A6' as Address,
  [ChainId.POLYGON_ZKEVM]: '0x2f686751b19a9d91cc3d57d90150Bc767f050066' as Address,
  [ChainId.TELOS]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de' as Address,
  [ChainId.THUNDERCORE]: '0x1b9d177CcdeA3c79B6c8F40761fc8Dc9d0500EAa' as Address,
  [ChainId.BASE]: '0x0BE808376Ecb75a5CF9bB6D237d16cd37893d904' as Address,
}

function sushiswapV2Factory(chainId: SushiSwapV2ChainId) {
  return {
    address: SUSHISWAP_V2_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.SushiSwapV2,
    fee: 0.003,
    initCodeHash: SUSHISWAP_V2_INIT_CODE_HASH[chainId],
  } as const
}

function sushiswapV3Factory(chainId: SushiSwapV3ChainId) {
  return {
    address: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.SushiSwapV3,
    initCodeHash: SUSHISWAP_V3_INIT_CODE_HASH[chainId],
  } as const
}

function uniswapV3Factory(chainId: UniswapV3ChainId) {
  return {
    address: UNISWAP_V3_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.UniswapV3,
    initCodeHash: UNISWAP_V3_INIT_CODE_HASH[chainId],
  } as const
}

export const EXTRACTOR_CONFIG = {
  [ChainId.ARBITRUM]: {
    client: createPublicClient(config[ChainId.ARBITRUM]),
    factoriesV2: [
      sushiswapV2Factory(ChainId.ARBITRUM),
      {
        address: '0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429' as Address,
        provider: LiquidityProviders.Dfyn,
        fee: 0.003,
        initCodeHash: '0xd49917af2b31d70ba7bea89230a93b55d3b6a99aacd03a72c288dfe524ec2f36',
      },
      {
        address: '0xA59B2044EAFD15ee4deF138D410d764c9023E1F0' as Address,
        provider: LiquidityProviders.Elk,
        fee: 0.003,
        initCodeHash: '0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31',
      },
    ],
    factoriesV3: [uniswapV3Factory(ChainId.ARBITRUM), sushiswapV3Factory(ChainId.ARBITRUM)],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.ARBITRUM],
    cacheDir: './cache',
    logDepth: 300,
    logType: LogFilterType.Native,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.ARBITRUM],
  },
  [ChainId.ARBITRUM_NOVA]: {
    client: createPublicClient(config[ChainId.ARBITRUM_NOVA]),
    factoriesV2: [sushiswapV2Factory(ChainId.ARBITRUM_NOVA)],
    factoriesV3: [sushiswapV3Factory(ChainId.ARBITRUM_NOVA)],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.ARBITRUM_NOVA],
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.ARBITRUM_NOVA],
  },
  [ChainId.AVALANCHE]: {
    client: createPublicClient(config[ChainId.AVALANCHE]),
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
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.AVALANCHE],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.AVALANCHE],
  },
  [ChainId.BOBA]: {
    client: createPublicClient(config[ChainId.BOBA]),
    factoriesV2: [sushiswapV2Factory(ChainId.BOBA)],
    factoriesV3: [sushiswapV3Factory(ChainId.BOBA)],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.BOBA],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.BOBA],
  },
  [ChainId.BOBA_AVAX]: {
    client: createPublicClient(config[ChainId.BOBA_AVAX]),
    factoriesV2: [sushiswapV2Factory(ChainId.BOBA_AVAX)],
    factoriesV3: [],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.BOBA_AVAX],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.BOBA_AVAX],
  },
  [ChainId.BOBA_BNB]: {
    client: createPublicClient(config[ChainId.BOBA_BNB]),
    factoriesV2: [sushiswapV2Factory(ChainId.BOBA_BNB)],
    factoriesV3: [],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.BOBA_BNB],
    cacheDir: './cache',
    logDepth: 500,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.BOBA_BNB],
  },
  [ChainId.BSC]: {
    client: createPublicClient(config[ChainId.BSC]),
    factoriesV2: [
      sushiswapV2Factory(ChainId.BSC),
      {
        address: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73' as Address,
        provider: LiquidityProviders.PancakeSwap,
        fee: 0.0025,
        initCodeHash: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
      },
      {
        address: '0x858E3312ed3A876947EA49d572A7C42DE08af7EE' as Address,
        provider: LiquidityProviders.Biswap,
        fee: 0.002,
        initCodeHash: '0xfea293c909d87cd4153593f077b76bb7e94340200f4ee84211ae8e4f9bd7ffdf',
      },
      {
        address: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6' as Address,
        provider: LiquidityProviders.ApeSwap,
        fee: 0.003,
        initCodeHash: '0xf4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b',
      },
      {
        address: '0x0eb58E5c8aA63314ff5547289185cC4583DfCBD5' as Address,
        provider: LiquidityProviders.JetSwap,
        fee: 0.003,
        initCodeHash: '0x3125d0a15fa7af49ce234ba1cf5f931bad0504242e0e1ee9fcd7d1d7aa88c651',
      },
    ],
    factoriesV3: [uniswapV3Factory(ChainId.BSC), sushiswapV3Factory(ChainId.BSC)],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.BSC],
    cacheDir: './cache',
    logDepth: 1000,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.BSC],
  },
  [ChainId.CELO]: {
    client: createPublicClient(config[ChainId.CELO]),
    factoriesV2: [sushiswapV2Factory(ChainId.CELO)],
    factoriesV3: [uniswapV3Factory(ChainId.CELO)],
    tickHelperContract: '0x5f115D9113F88e0a0Db1b5033D90D4a9690AcD3D' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.CELO],
  },
  [ChainId.ETHEREUM]: {
    client: createPublicClient(config[ChainId.ETHEREUM]),
    factoriesV2: [
      {
        address: UNISWAP_V2_FACTORY_ADDRESS,
        provider: LiquidityProviders.UniswapV2,
        fee: 0.003,
        initCodeHash: UNISWAP_V2_INIT_CODE_HASH,
      },
      sushiswapV2Factory(ChainId.ETHEREUM),
      {
        address: '0xBAe5dc9B19004883d0377419FeF3c2C8832d7d7B' as Address,
        provider: LiquidityProviders.ApeSwap,
        fee: 0.003,
        initCodeHash: '0xe2200989b6f9506f3beca7e9c844741b3ad1a88ad978b6b0973e96d3ca4707aa',
      },
      {
        address: '0x6511eBA915fC1b94b2364289CCa2b27AE5898d80' as Address,
        provider: LiquidityProviders.Elk,
        fee: 0.003,
        initCodeHash: '0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31',
      },
      {
        address: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362' as Address,
        provider: LiquidityProviders.PancakeSwap,
        fee: 0.0025,
        initCodeHash: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
      },
    ],
    factoriesV3: [uniswapV3Factory(ChainId.ETHEREUM), sushiswapV3Factory(ChainId.ETHEREUM)],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.ETHEREUM],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    routeProcessor3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.ETHEREUM],
  },
  [ChainId.FANTOM]: {
    client: createPublicClient(config[ChainId.FANTOM]),
    factoriesV2: [
      sushiswapV2Factory(ChainId.FANTOM),
      {
        address: '0xd9820a17053d6314B20642E465a84Bf01a3D64f5' as Address,
        provider: LiquidityProviders.Dfyn,
        fee: 0.003,
        initCodeHash: '0xd3ab2c392f54feb4b3b2a677f449b133c188ad2f1015eff3e94ea9315282c5f5',
      },
      {
        address: '0x7Ba73c99e6f01a37f3e33854c8F544BbbadD3420' as Address,
        provider: LiquidityProviders.Elk,
        fee: 0.003,
        initCodeHash: '0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31',
      },
      {
        address: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3' as Address,
        provider: LiquidityProviders.SpookySwap,
        fee: 0.003,
        initCodeHash: '0xcdf2deca40a0bd56de8e3ce5c7df6727e5b1bf2ac96f283fa9c4b3e6b42ea9d2',
      },
    ],
    factoriesV3: [
      sushiswapV3Factory(ChainId.FANTOM),
      {
        address: '0xaf20f5f19698f1D19351028cd7103B63D30DE7d7' as Address,
        provider: LiquidityProviders.Wagmi,
        initCodeHash: '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
      },
    ],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.FANTOM],
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.FANTOM],
  },
  [ChainId.OPTIMISM]: {
    client: createPublicClient(config[ChainId.OPTIMISM]),
    factoriesV2: [
      {
        address: '0xedfad3a0F42A8920B011bb0332aDe632e552d846' as Address,
        provider: LiquidityProviders.Elk,
        fee: 0.003,
        initCodeHash: '0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31',
      },
    ],
    factoriesV3: [uniswapV3Factory(ChainId.OPTIMISM), sushiswapV3Factory(ChainId.OPTIMISM)],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.OPTIMISM],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.OPTIMISM],
    account: '0x4200000000000000000000000000000000000006', // just a whale because optimism eth_call needs gas (
  },
  [ChainId.POLYGON]: {
    client: createPublicClient(config[ChainId.POLYGON]),
    factoriesV2: [
      sushiswapV2Factory(ChainId.POLYGON),
      {
        address: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32' as Address,
        provider: LiquidityProviders.QuickSwap,
        fee: 0.003,
        initCodeHash: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      },
      {
        address: '0xCf083Be4164828f00cAE704EC15a36D711491284' as Address,
        provider: LiquidityProviders.ApeSwap,
        fee: 0.003,
        initCodeHash: '0x511f0f358fe530cda0859ec20becf391718fdf5a329be02f4c95361f3d6a42d8',
      },
      {
        address: '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B' as Address,
        provider: LiquidityProviders.Dfyn,
        fee: 0.003,
        initCodeHash: '0xf187ed688403aa4f7acfada758d8d53698753b998a3071b06f1b777f4330eaf3',
      },
      {
        address: '0xE3BD06c7ac7E1CeB17BdD2E5BA83E40D1515AF2a' as Address,
        provider: LiquidityProviders.Elk,
        fee: 0.003,
        initCodeHash: '0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31',
      },
      {
        address: '0x668ad0ed2622C62E24f0d5ab6B6Ac1b9D2cD4AC7' as Address,
        provider: LiquidityProviders.JetSwap,
        fee: 0.003,
        initCodeHash: '0x505c843b83f01afef714149e8b174427d552e1aca4834b4f9b4b525f426ff3c6',
      },
    ],
    factoriesV3: [uniswapV3Factory(ChainId.POLYGON), sushiswapV3Factory(ChainId.POLYGON)],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.POLYGON],
    cacheDir: './cache',
    logDepth: 100,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.POLYGON],
  },
  [ChainId.POLYGON_ZKEVM]: {
    client: createPublicClient(config[ChainId.POLYGON_ZKEVM]),
    factoriesV2: [],
    factoriesV3: [
      sushiswapV3Factory(ChainId.POLYGON_ZKEVM),
      {
        address: '0xdE474Db1Fa59898BC91314328D29507AcD0D593c' as Address,
        provider: LiquidityProviders.DovishV3,
        initCodeHash: '0xd3e7f58b9af034cfa7a0597e539bae7c6b393817a47a6fc1e1503cd6eaffe22a',
      },
    ],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.POLYGON_ZKEVM],
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
    maxCallsInOneBatch: 5,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.POLYGON_ZKEVM],
  },
  [ChainId.BASE]: {
    client: createPublicClient(config[ChainId.BASE]),
    factoriesV2: [
      sushiswapV2Factory(ChainId.BASE),
      {
        address: '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB' as Address,
        provider: LiquidityProviders.BaseSwap,
        fee: 0.0025,
        initCodeHash: '0xb618a2730fae167f5f8ac7bd659dd8436d571872655bcb6fd11f2158c8a64a3b',
      },
    ],
    factoriesV3: [sushiswapV3Factory(ChainId.BASE), uniswapV3Factory(ChainId.BASE)],
    tickHelperContract: SUSHISWAP_V3_TICK_LENS[ChainId.BASE],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.BASE],
  },
}
