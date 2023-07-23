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
  SUSHISWAP_V3_INIT_CODE_HASH,
  SushiSwapV3ChainId,
  UNISWAP_V3_FACTORY_ADDRESS,
  UNISWAP_V3_INIT_CODE_HASH,
  UniswapV3ChainId,
  V3_FACTORY_ADDRESS,
  V3_TICK_LENS,
} from '@sushiswap/v3-sdk'
import { arbitrum, mainnet, optimism, polygon, polygonZkEvm } from '@sushiswap/viem-config'
import { Address } from 'viem'

export const SUPPORTED_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  // ChainId.POLYGON_ZKEVM,
] as const

export type SupportChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export const isSupportedChainId = (chainId: number): chainId is SupportChainId =>
  SUPPORTED_CHAIN_IDS.includes(chainId as SupportChainId)

export const ROUTE_PROCESSOR_3_ADDRESS = {
  [ChainId.ETHEREUM]: '0x827179dD56d07A7eeA32e3873493835da2866976' as Address,
  [ChainId.POLYGON]: '0x0a6e511Fe663827b9cA7e2D2542b20B37fC217A6' as Address,
  [ChainId.ARBITRUM]: '0xfc506AaA1340b4dedFfd88bE278bEe058952D674' as Address,
  [ChainId.OPTIMISM]: '0x4C5D5234f232BD2D76B96aA33F5AE4FCF0E4BFAb' as Address,
  [ChainId.CELO]: '0x2f686751b19a9d91cc3d57d90150Bc767f050066' as Address,
  [ChainId.POLYGON_ZKEVM]: '0x2f686751b19a9d91cc3d57d90150Bc767f050066' as Address,
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
    address: V3_FACTORY_ADDRESS[chainId],
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
  [ChainId.ETHEREUM]: {
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
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
    tickHelperContract: V3_TICK_LENS[ChainId.ETHEREUM],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    routeProcessor3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.ETHEREUM],
  },
  [ChainId.ARBITRUM]: {
    providerURL: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: arbitrum,
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
    tickHelperContract: V3_TICK_LENS[ChainId.ARBITRUM],
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.ARBITRUM],
  },
  [ChainId.OPTIMISM]: {
    providerURL: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: optimism,
    factoriesV2: [
      {
        address: '0xedfad3a0F42A8920B011bb0332aDe632e552d846' as Address,
        provider: LiquidityProviders.Elk,
        fee: 0.003,
        initCodeHash: '0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31',
      },
    ],
    factoriesV3: [uniswapV3Factory(ChainId.OPTIMISM), sushiswapV3Factory(ChainId.OPTIMISM)],
    tickHelperContract: V3_TICK_LENS[ChainId.OPTIMISM],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.OPTIMISM],
    account: '0x4200000000000000000000000000000000000006', // just a whale because optimism eth_call needs gas (
  },
  [ChainId.POLYGON]: {
    providerURL: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: polygon,
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
    tickHelperContract: V3_TICK_LENS[ChainId.POLYGON],
    cacheDir: './cache',
    logDepth: 100,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.POLYGON],
  },

  [ChainId.POLYGON_ZKEVM]: {
    providerURL: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: polygonZkEvm,
    factoriesV2: [],
    factoriesV3: [
      sushiswapV3Factory(ChainId.POLYGON_ZKEVM),
      // {
      //   address: '0xdE474Db1Fa59898BC91314328D29507AcD0D593c' as Address,
      //   provider: LiquidityProviders.DovishV3,
      //   initCodeHash: '0xd3e7f58b9af034cfa7a0597e539bae7c6b393817a47a6fc1e1503cd6eaffe22a',
      // },
    ],
    tickHelperContract: V3_TICK_LENS[ChainId.POLYGON_ZKEVM],
    cacheDir: './cache',
    logDepth: 100,
    logging: true,
    RP3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.POLYGON_ZKEVM],
  },
}
