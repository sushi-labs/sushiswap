import { ExtractorConfig, LogFilterType } from '@sushiswap/extractor'
import { ChainId } from 'sushi/chain'
import {
  ExtractorSupportedChainId,
  PANCAKESWAP_V2_FACTORY_ADDRESS,
  PANCAKESWAP_V2_INIT_CODE_HASH,
  PANCAKESWAP_V3_DEPLOYER_ADDRESS,
  PANCAKESWAP_V3_FACTORY_ADDRESS,
  PANCAKESWAP_V3_FEE_SPACING_MAP,
  PANCAKESWAP_V3_INIT_CODE_HASH,
  PancakeSwapV2ChainId,
  PancakeSwapV3ChainId,
  SUSHISWAP_V2_FACTORY_ADDRESS,
  SUSHISWAP_V2_INIT_CODE_HASH,
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_INIT_CODE_HASH,
  SUSHISWAP_V3_TICK_LENS,
  type SushiSwapV2ChainId,
  type SushiSwapV3ChainId,
  UNISWAP_V2_FACTORY_ADDRESS,
  UNISWAP_V2_INIT_CODE_HASH,
  UNISWAP_V3_FACTORY_ADDRESS,
  UNISWAP_V3_INIT_CODE_HASH,
  UniswapV2ChainId,
  type UniswapV3ChainId,
  publicClientConfig,
} from 'sushi/config'
import { LiquidityProviders } from 'sushi/router'
import {
  http,
  type Address,
  Chain,
  PublicClient,
  type PublicClientConfig,
  createPublicClient,
} from 'viem'
import { apeswapV2Factory } from './apeswap.js'
import { dackieSwapV2Factory, dackieSwapV3Factory } from './dackieswap.js'
import { dfynV2Factory } from './dfyn.js'
import { elkV2Factory } from './elk.js'
import { wagmiV3Factory } from './wagmi.js'

function sushiswapV2Factory(chainId: SushiSwapV2ChainId) {
  return {
    address: SUSHISWAP_V2_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.SushiSwapV2,
    fee: 0.003,
    initCodeHash: SUSHISWAP_V2_INIT_CODE_HASH[chainId],
  } as const
}

function uniswapV2Factory(chainId: UniswapV2ChainId) {
  return {
    address: UNISWAP_V2_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.UniswapV2,
    fee: 0.003,
    initCodeHash: UNISWAP_V2_INIT_CODE_HASH,
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

export function pancakeswapV3Factory(chainId: PancakeSwapV3ChainId) {
  return {
    address: PANCAKESWAP_V3_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.PancakeSwapV3,
    initCodeHash: PANCAKESWAP_V3_INIT_CODE_HASH[chainId],
    deployer: PANCAKESWAP_V3_DEPLOYER_ADDRESS[chainId],
    feeSpacingMap: PANCAKESWAP_V3_FEE_SPACING_MAP,
  } as const
}

export function pancakeswapV2Factory(chainId: PancakeSwapV2ChainId) {
  return {
    address: PANCAKESWAP_V2_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.PancakeSwap,
    initCodeHash: PANCAKESWAP_V2_INIT_CODE_HASH[chainId],
    fee: 0.0025,
  } as const
}

// const ELK_V2_SUPPORTED_CHAIN_IDS = [] as const
// type ElkV2ChainId = (typeof ELK_V2_SUPPORTED_CHAIN_IDS)[number]
// const ELK_V2_FACTORY_ADDRESS: Record<ElkV2ChainId, Address> = {} as const
// const ELK_V2_INIT_CODE_HASH: Record<ElkV2ChainId, Hex> = {} as const
// export function elkV2Factory(chainId: ElkV2ChainId) {
//   return {
//     address: ELK_V2_FACTORY_ADDRESS[chainId],
//     provider: LiquidityProviders.Elk,
//     initCodeHash: ELK_V2_INIT_CODE_HASH[chainId],
//     fee: 0.003,
//   } as const
// }

function extractorClientConfig(chainId: ChainId): PublicClientConfig {
  const url = publicClientConfig[chainId]?.transport({})?.value?.url
  if (url === undefined) throw new Error('extractorClientConfig: Unknown url')
  return {
    chain: publicClientConfig[chainId].chain as Chain,
    transport: http(url, {
      timeout: 120_000,
      // onFetchResponse(response: Response) {
      //   console.log(response.url, response.headers.get('x-drpc-trace-id'))
      // },
    }),
  }
}

// ! TODO: Fix casts when viem is updated
export const EXTRACTOR_CONFIG = {
  [ChainId.CURTIS]: {
    client: createPublicClient(extractorClientConfig(ChainId.CURTIS)),
    factoriesV2: [
      {
        address: '0x424703f978bfaa96F8Aad4f3C9B2C91B8bd513CB',
        provider: LiquidityProviders.Saru,
        fee: 0.003,
        initCodeHash:
          '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
      },
    ],
    factoriesV3: [],
    tickHelperContractV3:
      '0x0000000000000000000000000000000000000000' as Address,
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.ARBITRUM]: {
    client: createPublicClient(extractorClientConfig(ChainId.ARBITRUM)),
    factoriesV2: [
      uniswapV2Factory(ChainId.ARBITRUM),
      sushiswapV2Factory(ChainId.ARBITRUM),
      pancakeswapV2Factory(ChainId.ARBITRUM),
      elkV2Factory(ChainId.ARBITRUM),
      apeswapV2Factory(ChainId.ARBITRUM),
      dfynV2Factory(ChainId.ARBITRUM),
      dackieSwapV2Factory(ChainId.ARBITRUM),
    ],
    factoriesV3: [
      uniswapV3Factory(ChainId.ARBITRUM),
      sushiswapV3Factory(ChainId.ARBITRUM),
      pancakeswapV3Factory(ChainId.ARBITRUM),
      wagmiV3Factory(ChainId.ARBITRUM),
      dackieSwapV3Factory(ChainId.ARBITRUM),
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.ARBITRUM],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 300,
    logType: LogFilterType.Native,
    logging: true,
    maxCallsInOneBatch: 200,
    maxBatchesSimultaniously: 5,
  },
  [ChainId.ARBITRUM_NOVA]: {
    client: createPublicClient(extractorClientConfig(ChainId.ARBITRUM_NOVA)),
    factoriesV2: [sushiswapV2Factory(ChainId.ARBITRUM_NOVA)],
    factoriesV3: [sushiswapV3Factory(ChainId.ARBITRUM_NOVA)],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.ARBITRUM_NOVA],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
  },
  [ChainId.AVALANCHE]: {
    client: createPublicClient(extractorClientConfig(ChainId.AVALANCHE)),
    factoriesV2: [
      uniswapV2Factory(ChainId.AVALANCHE),
      sushiswapV2Factory(ChainId.AVALANCHE),
      elkV2Factory(ChainId.AVALANCHE),
      {
        address: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10' as Address,
        provider: LiquidityProviders.TraderJoe,
        fee: 0.003,
        initCodeHash:
          '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91',
      },
      {
        address: '0xefa94DE7a4656D787667C749f7E1223D71E9FD88' as Address,
        provider: LiquidityProviders.Pangolin,
        fee: 0.003,
        initCodeHash:
          '0x40231f6b438bce0797c9ada29b718a87ea0a5cea3fe9a771abdd76bd41a3e545',
      },
    ],
    factoriesV3: [
      sushiswapV3Factory(ChainId.AVALANCHE),
      uniswapV3Factory(ChainId.AVALANCHE),
      wagmiV3Factory(ChainId.AVALANCHE),
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.AVALANCHE],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 100,
    logging: true,
  },
  [ChainId.BASE]: {
    client: createPublicClient(
      extractorClientConfig(ChainId.BASE),
    ) as PublicClient,
    factoriesV2: [
      uniswapV2Factory(ChainId.BASE),
      sushiswapV2Factory(ChainId.BASE),
      pancakeswapV2Factory(ChainId.BASE),
      elkV2Factory(ChainId.BASE),
      dackieSwapV2Factory(ChainId.BASE),
      {
        address: '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB' as Address,
        provider: LiquidityProviders.BaseSwap,
        fee: 0.0025,
        initCodeHash:
          '0xb618a2730fae167f5f8ac7bd659dd8436d571872655bcb6fd11f2158c8a64a3b',
      },
      {
        address: '0x3E84D913803b02A4a7f027165E8cA42C14C0FdE7' as Address,
        provider: LiquidityProviders.AlienBaseV2,
        fee: 0.0016,
        initCodeHash:
          '0x7ede5bbb7d245103c4a6d59bfd62246fbc488e93f95f23a19d9d76f0d91bd0d0',
      },
    ],
    factoriesV3: [
      sushiswapV3Factory(ChainId.BASE),
      uniswapV3Factory(ChainId.BASE),
      pancakeswapV3Factory(ChainId.BASE),
      wagmiV3Factory(ChainId.BASE),
      dackieSwapV3Factory(ChainId.BASE),
      {
        address: '0x0Fd83557b2be93617c9C1C1B6fd549401C74558C' as Address,
        provider: LiquidityProviders.AlienBaseV3,
        initCodeHash:
          '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
        feeSpacingMap: {
          200: 4,
          750: 15,
          3000: 60,
          10_000: 200,
        },
      },
      {
        address: '0x38015D05f4fEC8AFe15D7cc0386a126574e8077B' as Address,
        provider: LiquidityProviders.BaseSwapV3,
        initCodeHash:
          '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
        feeSpacingMap: {
          80: 1,
          350: 10,
          450: 10,
          2500: 60,
          10000: 200,
        },
      },
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.BASE],
    factoriesAlgebra: [
      {
        address: '0x2F0d41f94d5D1550b79A83D2fe85C82d68c5a3ca' as Address,
        provider: LiquidityProviders.KimV4,
      },
    ],
    tickHelperContractAlgebra:
      '0x44a6d9741cDF9C955eE89C14C739FB1aeaD82d6B' as Address,
    factoriesSlipstream: [
      {
        address: '0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A',
        provider: LiquidityProviders.AerodromeSlipstream,
        checkedSwapFeeModules: ['0xF4171B0953b52Fa55462E4d76ecA1845Db69af00'],
      },
    ],
    tickHelperContractSlipstream:
      '0x3e1116ea5034f5d73a7b530071709d54a4109f5f' as Address, // our own
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    // maxCallsInOneBatch: 200,
    maxBatchesSimultaniously: 5,
  },
  [ChainId.BLAST]: {
    client: createPublicClient(extractorClientConfig(ChainId.BLAST)),
    factoriesV2: [
      uniswapV2Factory(ChainId.BLAST),
      sushiswapV2Factory(ChainId.BLAST),
      dackieSwapV2Factory(ChainId.BLAST),
      {
        address: '0x04C9f118d21e8B767D2e50C946f0cC9F6C367300' as Address,
        provider: LiquidityProviders.SwapBlast,
        fee: 0.001,
        initCodeHash:
          '0x89f2ba5c4e1e84307b0efac8ff56efab2786d9becd741ff83b1b6397de76dafc',
      },
      {
        address: '0x66346aac17d0e61156AC5F2A934ccF2a9BDe4c65' as Address,
        provider: LiquidityProviders.BlastDEX,
        fee: 0.002,
        initCodeHash:
          '0x376acff9b60b853f5ccc9f1caecb8dcf722793593330ac58aac8a880a3eb8b9e',
      },
      {
        address: '0xE27cb06A15230A7480d02956a3521E78C5bFD2D0' as Address,
        provider: LiquidityProviders.MonoswapV2,
        fee: 0.003,
        initCodeHash:
          '0xd1a99f7339108abbcc2eaa6478ee4a0394e2a63f04de08793721fb2f3eff5a38',
      },
      {
        address: '0xb4A7D971D0ADea1c73198C97d7ab3f9CE4aaFA13' as Address,
        provider: LiquidityProviders.ThrusterV2,
        fee: 0.003,
        initCodeHash:
          '0x6f0346418750a1a53597a51ceff4f294b5f0e87f09715525b519d38ad3fab2cb',
      },
      {
        address: '0x37836821a2c03c171fB1a595767f4a16e2b93Fc4' as Address,
        provider: LiquidityProviders.ThrusterV2,
        fee: 0.01,
        initCodeHash:
          '0x32a9ff5a51b653cbafe88e38c4da86b859135750d3ca435f0ce732c8e3bb8335',
      },
      {
        address: '0xA1da7a7eB5A858da410dE8FBC5092c2079B58413',
        provider: LiquidityProviders.DyorV2,
        fee: 0.0025,
        initCodeHash:
          '0xda2f1a903916d7de88d9357d27d763f123502a5d48e3b229d5fa049b3ffdeeb5',
      },
      {
        address: '0xD97fFc2041a8aB8f6bc4aeE7eE8ECA485381D088',
        provider: LiquidityProviders.HyperBlast,
        fee: 0.003,
        initCodeHash:
          '0x2e6ab686c26cf8ecf0a8c01a9fb0ef96dbd4631c04b03005350fa49e8f2f32f8',
      },
      {
        address: '0x24F5Ac9A706De0cF795A8193F6AB3966B14ECfE6',
        provider: LiquidityProviders.RingExchangeV2,
        fee: 0.003,
        initCodeHash:
          '0x501ce753061ab6e75837b15f074633bb775f5972f8dc1112fcc829c2e88dc689',
      },
    ],
    factoriesV3: [
      sushiswapV3Factory(ChainId.BLAST),
      uniswapV3Factory(ChainId.BLAST),
      dackieSwapV3Factory(ChainId.BLAST),
      {
        address: '0x48d0F09710794313f33619c95147F34458BF7C3b',
        provider: LiquidityProviders.MonoswapV3,
        initCodeHash:
          '0x7ea070216c7d9135010a36147394687bab92df4695e924000eed7c4b33eb922f',
      },
      {
        address: '0x71b08f13B3c3aF35aAdEb3949AFEb1ded1016127',
        deployer: '0xa08ae3d3f4dA51C22d3c041E468bdF4C61405AaB',
        provider: LiquidityProviders.ThrusterV3,
        initCodeHash:
          '0xd0c3a51b16dbc778f000c620eaabeecd33b33a80bd145e1f7cbc0d4de335193d',
      },
      {
        address: '0x890509Fab3dD11D4Ff57d8471b5eAC74687E4C75',
        provider: LiquidityProviders.RingExchangeV3,
        initCodeHash:
          '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      },
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.BLAST] as Address,
    tickHelperContractAlgebra:
      '0x969195B66f95D8B70fA414671b438134889Ba348' as Address,
    factoriesAlgebra: [
      {
        address: '0xA87DbF5082Af26c9A6Ab2B854E378f704638CCa5' as Address,
        provider: LiquidityProviders.BladeSwap,
      },
      {
        address: '0x7a44CD060afC1B6F4c80A2B9b37f4473E74E25Df' as Address,
        provider: LiquidityProviders.Fenix,
      },
    ],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.BOBA]: {
    client: createPublicClient(extractorClientConfig(ChainId.BOBA)),
    factoriesV2: [sushiswapV2Factory(ChainId.BOBA)],
    factoriesV3: [
      sushiswapV3Factory(ChainId.BOBA),
      uniswapV3Factory(ChainId.BOBA),
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.BOBA],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.BOBA_BNB]: {
    client: createPublicClient(extractorClientConfig(ChainId.BOBA_BNB)),
    factoriesV2: [sushiswapV2Factory(ChainId.BOBA_BNB)],
    factoriesV3: [],
    tickHelperContractV3:
      '0x0000000000000000000000000000000000000000' as Address,
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.BSC]: {
    client: createPublicClient(extractorClientConfig(ChainId.BSC)),
    factoriesV2: [
      uniswapV2Factory(ChainId.BSC),
      sushiswapV2Factory(ChainId.BSC),
      pancakeswapV2Factory(ChainId.BSC),
      elkV2Factory(ChainId.BSC),
      apeswapV2Factory(ChainId.BSC),
      {
        address: '0x858E3312ed3A876947EA49d572A7C42DE08af7EE' as Address,
        provider: LiquidityProviders.Biswap,
        fee: 0.002,
        initCodeHash:
          '0xfea293c909d87cd4153593f077b76bb7e94340200f4ee84211ae8e4f9bd7ffdf',
      },
      {
        address: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6' as Address,
        provider: LiquidityProviders.ApeSwap,
        fee: 0.003,
        initCodeHash:
          '0xf4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b',
      },
      {
        address: '0x0eb58E5c8aA63314ff5547289185cC4583DfCBD5' as Address,
        provider: LiquidityProviders.JetSwap,
        fee: 0.003,
        initCodeHash:
          '0x3125d0a15fa7af49ce234ba1cf5f931bad0504242e0e1ee9fcd7d1d7aa88c651',
      },
      {
        address: '0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7' as Address,
        provider: LiquidityProviders.BakerySwap,
        fee: 0.003,
        initCodeHash:
          '0xe2e87433120e32c4738a7d8f3271f3d872cbe16241d67537139158d90bac61d3',
      },
      {
        address: '0x1D9F43a6195054313ac1aE423B1f810f593b6ac1' as Address,
        provider: LiquidityProviders.SquadSwapV2,
        fee: 0.002,
        initCodeHash:
          '0xd424455c1204e4f46a4a380651928652376a351698d3d97e2da05d3041c15fbe',
      },
      {
        address: '0xCe8fd65646F2a2a897755A1188C04aCe94D2B8D0' as Address,
        provider: LiquidityProviders.BSCSwap,
        fee: 0.003,
        initCodeHash:
          '0xacc1c81cc3e9fb496da555f6bd67c3a095e579b26c1b580070cc6afa8f0a94fa',
      },
    ],

    factoriesV3: [
      uniswapV3Factory(ChainId.BSC),
      sushiswapV3Factory(ChainId.BSC),
      pancakeswapV3Factory(ChainId.BSC),
      wagmiV3Factory(ChainId.BSC),
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.BSC],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 1000,
    logging: true,
    maxBatchesSimultaniously: 5,
  },
  [ChainId.BTTC]: {
    client: createPublicClient(extractorClientConfig(ChainId.BTTC)),
    factoriesV2: [sushiswapV2Factory(ChainId.BTTC), elkV2Factory(ChainId.BTTC)],
    factoriesV3: [sushiswapV3Factory(ChainId.BTTC)],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.BTTC],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.CELO]: {
    client: createPublicClient(
      extractorClientConfig(ChainId.CELO),
    ) as unknown as PublicClient,
    factoriesV2: [
      uniswapV2Factory(ChainId.CELO),
      sushiswapV2Factory(ChainId.CELO),
    ],
    factoriesV3: [uniswapV3Factory(ChainId.CELO)],
    tickHelperContractV3:
      '0x5f115D9113F88e0a0Db1b5033D90D4a9690AcD3D' as Address,
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.CORE]: {
    client: createPublicClient(extractorClientConfig(ChainId.CORE)),
    factoriesV2: [sushiswapV2Factory(ChainId.CORE)],
    factoriesV3: [
      sushiswapV3Factory(ChainId.CORE),
      {
        address: '0x526190295AFB6b8736B14E4b42744FBd95203A3a' as Address,
        provider: LiquidityProviders.COREx,
        initCodeHash:
          '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      },
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.CORE],
    tickHelperContractAlgebra:
      '0x433cef5888C701831360686e54668376330cED6D' as Address,
    factoriesAlgebra: [
      {
        address: '0x74EfE55beA4988e7D92D03EFd8ddB8BF8b7bD597' as Address,
        provider: LiquidityProviders.GlyphV4,
      },
    ],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.ETHEREUM]: {
    client: createPublicClient(extractorClientConfig(ChainId.ETHEREUM)),
    factoriesV2: [
      uniswapV2Factory(ChainId.ETHEREUM),
      sushiswapV2Factory(ChainId.ETHEREUM),
      pancakeswapV2Factory(ChainId.ETHEREUM),
      elkV2Factory(ChainId.ETHEREUM),
      apeswapV2Factory(ChainId.ETHEREUM),
      {
        address: '0xdD9EFCbDf9f422e2fc159eFe77aDD3730d48056d',
        provider: LiquidityProviders.Kwikswap,
        initCodeHash:
          '0xbc919ae6f6f95dca1e223fc957286afa1da81529418e9f187db8a0b2d2e963bc',
        fee: 0.003,
      },
      {
        address: '0x115934131916C8b277DD010Ee02de363c09d037c',
        provider: LiquidityProviders.ShibaSwap,
        initCodeHash:
          '0x65d1a3b1e46c6e4f1be1ad5f99ef14dc488ae0549dc97db9b30afe2241ce1c7a',
        fee: 0.003,
      },
      {
        address: '0x9DEB29c9a4c7A88a3C0257393b7f3335338D9A9D',
        provider: LiquidityProviders.CroDefiSwap,
        initCodeHash:
          '0x69d637e77615df9f235f642acebbdad8963ef35c5523142078c9b8f9d0ceba7e',
        fee: 0.003,
      },
      {
        address: '0xcBAE5C3f8259181EB7E2309BC4c72fDF02dD56D8',
        provider: LiquidityProviders.NineInch,
        fee: 0.0029,
        initCodeHash:
          '0xd2cf61d4acad30e9fe5ec59d0f94de554d88701f1bd8fc635546866716718511',
      },
    ],

    factoriesV3: [
      uniswapV3Factory(ChainId.ETHEREUM),
      sushiswapV3Factory(ChainId.ETHEREUM),
      pancakeswapV3Factory(ChainId.ETHEREUM),
      wagmiV3Factory(ChainId.ETHEREUM),
    ],
    curveConfig: {
      minPoolLiquidityLimitUSD: 1000,
    },
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.ETHEREUM],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    maxBatchesSimultaniously: 5,
  },
  [ChainId.FANTOM]: {
    client: createPublicClient(extractorClientConfig(ChainId.FANTOM)),
    factoriesV2: [
      sushiswapV2Factory(ChainId.FANTOM),
      elkV2Factory(ChainId.FANTOM),
      dfynV2Factory(ChainId.FANTOM),
      {
        address: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3' as Address,
        provider: LiquidityProviders.SpookySwap,
        fee: 0.003,
        initCodeHash:
          '0xcdf2deca40a0bd56de8e3ce5c7df6727e5b1bf2ac96f283fa9c4b3e6b42ea9d2',
      },
      {
        address: '0xC831A5cBfb4aC2Da5ed5B194385DFD9bF5bFcBa7' as Address,
        provider: LiquidityProviders.Wigoswap,
        fee: 0.0019,
        initCodeHash:
          '0x55c39e9406ff3c89a193882b4752879e73c8a0ce1222fe1de34c5e8f6482d9b6',
      },
    ],
    factoriesV3: [
      sushiswapV3Factory(ChainId.FANTOM),
      wagmiV3Factory(ChainId.FANTOM),
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.FANTOM],
    tickHelperContractAlgebra:
      '0xE96C8F64237F6b4aF428a474E2741d60e2404DAe' as Address,
    factoriesAlgebra: [
      {
        address: '0xb860200BD68dc39cEAfd6ebb82883f189f4CdA76' as Address,
        provider: LiquidityProviders.SilverSwap,
      },
    ],
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
  },
  [ChainId.FUSE]: {
    client: createPublicClient(extractorClientConfig(ChainId.FUSE)),
    factoriesV2: [sushiswapV2Factory(ChainId.FUSE), elkV2Factory(ChainId.FUSE)],
    factoriesV3: [sushiswapV3Factory(ChainId.FUSE)],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.FUSE],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.GNOSIS]: {
    client: createPublicClient(extractorClientConfig(ChainId.GNOSIS)),
    factoriesV2: [
      sushiswapV2Factory(ChainId.GNOSIS),
      elkV2Factory(ChainId.GNOSIS),
    ],
    factoriesV3: [sushiswapV3Factory(ChainId.GNOSIS)],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.GNOSIS],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.OPTIMISM]: {
    client: createPublicClient(
      extractorClientConfig(ChainId.OPTIMISM),
    ) as PublicClient,
    factoriesV2: [
      uniswapV2Factory(ChainId.OPTIMISM),
      sushiswapV2Factory(ChainId.OPTIMISM),
      elkV2Factory(ChainId.OPTIMISM),
      dackieSwapV2Factory(ChainId.OPTIMISM),
    ],
    factoriesV3: [
      uniswapV3Factory(ChainId.OPTIMISM),
      sushiswapV3Factory(ChainId.OPTIMISM),
      wagmiV3Factory(ChainId.OPTIMISM),
      dackieSwapV3Factory(ChainId.OPTIMISM),
    ],
    factoriesSlipstream: [
      {
        address: '0xCc0bDDB707055e04e497aB22a59c2aF4391cd12F',
        provider: LiquidityProviders.VelodromeSlipstream,
        // only swapFeeModules like BASE:0xF4171B0953b52Fa55462E4d76ecA1845Db69af00 are supported
        checkedSwapFeeModules: ['0x7361E9079920fb75496E9764A2665d8ee5049D5f'],
      },
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.OPTIMISM],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    tickHelperContractSlipstream:
      '0x49C6FDCb3D5b2CecD8baff66c8e94b9B261ad925' as Address, // our own
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.POLYGON]: {
    client: createPublicClient(extractorClientConfig(ChainId.POLYGON)),
    factoriesV2: [
      uniswapV2Factory(ChainId.POLYGON),
      sushiswapV2Factory(ChainId.POLYGON),
      elkV2Factory(ChainId.POLYGON),
      apeswapV2Factory(ChainId.POLYGON),
      dfynV2Factory(ChainId.POLYGON),
      {
        address: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32' as Address,
        provider: LiquidityProviders.QuickSwap,
        fee: 0.003,
        initCodeHash:
          '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      },
      {
        address: '0x668ad0ed2622C62E24f0d5ab6B6Ac1b9D2cD4AC7' as Address,
        provider: LiquidityProviders.JetSwap,
        fee: 0.003,
        initCodeHash:
          '0x505c843b83f01afef714149e8b174427d552e1aca4834b4f9b4b525f426ff3c6',
      },
    ],
    factoriesV3: [
      uniswapV3Factory(ChainId.POLYGON),
      sushiswapV3Factory(ChainId.POLYGON),
      wagmiV3Factory(ChainId.POLYGON),
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.POLYGON],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 100,
    logging: true,
    maxBatchesSimultaniously: 5,
  },
  [ChainId.POLYGON_ZKEVM]: {
    client: createPublicClient(extractorClientConfig(ChainId.POLYGON_ZKEVM)),
    factoriesV2: [
      // sushiswapV2Factory(ChainId.POLYGON_ZKEVM)
    ],
    factoriesV3: [
      sushiswapV3Factory(ChainId.POLYGON_ZKEVM),
      uniswapV3Factory(ChainId.POLYGON_ZKEVM),
      pancakeswapV3Factory(ChainId.POLYGON_ZKEVM),
      {
        address: '0xdE474Db1Fa59898BC91314328D29507AcD0D593c' as Address,
        provider: LiquidityProviders.DovishV3,
        initCodeHash:
          '0xd3e7f58b9af034cfa7a0597e539bae7c6b393817a47a6fc1e1503cd6eaffe22a',
      },
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.POLYGON_ZKEVM],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
    maxCallsInOneBatch: 5,
  },

  [ChainId.SCROLL]: {
    client: createPublicClient(extractorClientConfig(ChainId.SCROLL)),
    factoriesV2: [sushiswapV2Factory(ChainId.SCROLL)],
    factoriesV3: [
      sushiswapV3Factory(ChainId.SCROLL),
      uniswapV3Factory(ChainId.SCROLL),
      {
        address: '0x96a7F53f7636c93735bf85dE416A4Ace94B56Bd9' as Address,
        provider: LiquidityProviders.ZebraV2,
        initCodeHash:
          '0xcf0b3414328c2bd327a4f093539d0d7d82fb94f893a2965c75cb470289cb5ac7',
        feeSpacingMap: {
          500: 10,
          3000: 60,
          10_000: 200,
        },
      },
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.SCROLL],
    tickHelperContractAlgebra:
      '0xECd0DD811B55f5b7e20e7999f1e986Ba7d7df901' as Address,
    factoriesAlgebra: [
      {
        address: '0xDc62aCDF75cc7EA4D93C69B2866d9642E79d5e2e' as Address,
        provider: LiquidityProviders.Scribe,
      },
    ],
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
  },
  [ChainId.LINEA]: {
    client: createPublicClient(extractorClientConfig(ChainId.LINEA)),
    factoriesV2: [
      sushiswapV2Factory(ChainId.LINEA),
      pancakeswapV2Factory(ChainId.LINEA),
      elkV2Factory(ChainId.LINEA),
      dackieSwapV2Factory(ChainId.LINEA),
    ],
    factoriesV3: [
      sushiswapV3Factory(ChainId.LINEA),
      pancakeswapV3Factory(ChainId.LINEA),
      uniswapV3Factory(ChainId.LINEA),
      dackieSwapV2Factory(ChainId.LINEA),
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.LINEA],
    tickHelperContractAlgebra:
      '0x8A3E7cc11E7B9A530b167cE4E0B921bD2610A888' as Address,
    factoriesAlgebra: [
      {
        address: '0xec4f2937e57a6F39087187816eCc83191E6dB1aB' as Address,
        provider: LiquidityProviders.Horizon,
      },
    ],
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
  },
  [ChainId.FILECOIN]: {
    client: createPublicClient(extractorClientConfig(ChainId.FILECOIN)),
    factoriesV2: [sushiswapV2Factory(ChainId.FILECOIN)],
    factoriesV3: [
      sushiswapV3Factory(ChainId.FILECOIN),
      uniswapV3Factory(ChainId.FILECOIN),
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.FILECOIN],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
    maxCallsInOneBatch: 60,
  },
  [ChainId.METIS]: {
    client: createPublicClient(extractorClientConfig(ChainId.METIS)),
    factoriesV2: [
      sushiswapV2Factory(ChainId.METIS),
      elkV2Factory(ChainId.METIS),
      {
        address: '0x70f51d68D16e8f9e418441280342BD43AC9Dff9f' as Address,
        provider: LiquidityProviders.NetSwap,
        fee: 0.003,
        initCodeHash:
          '0x966d65068a6a30f10fd1fa814258637a34e059081d79daa94f3e2b6cec48e810',
      },
    ],
    factoriesV3: [
      sushiswapV3Factory(ChainId.METIS),
      wagmiV3Factory(ChainId.METIS),
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.METIS],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
  },
  [ChainId.HAQQ]: {
    client: createPublicClient(extractorClientConfig(ChainId.HAQQ)),
    factoriesV2: [sushiswapV2Factory(ChainId.HAQQ)],
    factoriesV3: [sushiswapV3Factory(ChainId.HAQQ)],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.HAQQ],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
  },
  [ChainId.HARMONY]: {
    client: createPublicClient(extractorClientConfig(ChainId.HARMONY)),
    factoriesV2: [
      sushiswapV2Factory(ChainId.HARMONY),
      elkV2Factory(ChainId.HARMONY),
    ],
    // No V3 on Harmony?
    factoriesV3: [],
    tickHelperContractV3:
      '0x0000000000000000000000000000000000000000' as Address,
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
  },
  [ChainId.KAVA]: {
    client: createPublicClient(extractorClientConfig(ChainId.KAVA)),
    factoriesV2: [
      sushiswapV2Factory(ChainId.KAVA),
      elkV2Factory(ChainId.KAVA),
      {
        address: '0xE8E917BC80A26CDacc9aA42C0F4965d2E1Fa52da',
        provider: LiquidityProviders.KinetixV2,
        initCodeHash:
          '0x4b61b80b5bcfca0f9202f2aba1955b0cfda155e379cb36e0ab38598337c4c79a',
        fee: 0.003,
      },
    ],
    factoriesV3: [
      sushiswapV3Factory(ChainId.KAVA),
      wagmiV3Factory(ChainId.KAVA),
      {
        address: '0x2dBB6254231C5569B6A4313c6C1F5Fe1340b35C2' as Address,
        provider: LiquidityProviders.KinetixV3,
        initCodeHash:
          '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      },
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.KAVA],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
  },
  [ChainId.MOONBEAM]: {
    client: createPublicClient(extractorClientConfig(ChainId.MOONBEAM)),
    factoriesV2: [
      sushiswapV2Factory(ChainId.MOONBEAM),
      {
        address: '0x19B85ae92947E0725d5265fFB3389e7E4F191FDa' as Address,
        provider: LiquidityProviders.Solarbeam,
        fee: 0.003,
        initCodeHash:
          '0x9a100ded5f254443fbd264cb7e87831e398a8b642e061670a9bc35ba27293dbf',
      },
    ],
    factoriesV3: [
      // No SushiSwapV3 on Moonbeam?
      uniswapV3Factory(ChainId.MOONBEAM),
    ],
    tickHelperContractV3:
      '0x1f4F7b041895D9eB1A79be0896AF3E68e4160010' as Address,
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 300,
    logging: true,
  },
  [ChainId.MOONRIVER]: {
    client: createPublicClient(extractorClientConfig(ChainId.MOONRIVER)),
    factoriesV2: [
      sushiswapV2Factory(ChainId.MOONRIVER),
      elkV2Factory(ChainId.MOONRIVER),
      {
        address: '0x049581aEB6Fe262727f290165C29BDAB065a1B68' as Address,
        provider: LiquidityProviders.Solarbeam,
        fee: 0.003,
        initCodeHash:
          '0x9a100ded5f254443fbd264cb7e87831e398a8b642e061670a9bc35ba27293dbf',
      },
    ],
    factoriesV3: [sushiswapV3Factory(ChainId.MOONRIVER)],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.MOONRIVER],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 100,
    logging: true,
  },
  [ChainId.TELOS]: {
    client: createPublicClient(extractorClientConfig(ChainId.TELOS)),
    factoriesV2: [
      // sushiswapV2Factory(ChainId.TELOS),
      elkV2Factory(ChainId.TELOS),
      apeswapV2Factory(ChainId.TELOS),
    ],
    factoriesV3: [],
    factoriesAlgebra: [
      {
        address: '0xA09BAbf9A48003ae9b9333966a8Bda94d820D0d9' as Address,
        provider: LiquidityProviders.Swapsicle,
      },
    ],
    tickHelperContractV3:
      '0x0000000000000000000000000000000000000000' as Address,
    tickHelperContractAlgebra:
      '0x9dE2dEA5c68898eb4cb2DeaFf357DFB26255a4aa' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    maxCallsInOneBatch: 100,
  },

  [ChainId.THUNDERCORE]: {
    client: createPublicClient(extractorClientConfig(ChainId.THUNDERCORE)),
    factoriesV2: [sushiswapV2Factory(ChainId.THUNDERCORE)],
    factoriesV3: [sushiswapV3Factory(ChainId.THUNDERCORE)],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.THUNDERCORE],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.ZETACHAIN]: {
    client: createPublicClient(extractorClientConfig(ChainId.ZETACHAIN)),
    factoriesV2: [
      sushiswapV2Factory(ChainId.ZETACHAIN),
      {
        address: '0x9fd96203f7b22bCF72d9DCb40ff98302376cE09c' as Address,
        provider: LiquidityProviders.EddyFinance,
        fee: 0.003,
        initCodeHash:
          '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      },
    ],
    factoriesV3: [sushiswapV3Factory(ChainId.ZETACHAIN)],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.ZETACHAIN],
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.CRONOS]: {
    client: createPublicClient(extractorClientConfig(ChainId.CRONOS)),
    factoriesV2: [
      {
        address: '0x3B44B2a187a7b3824131F8db5a74194D0a42Fc15' as Address,
        provider: LiquidityProviders.VVSStandard,
        fee: 0.003,
        initCodeHash:
          '0xa77ee1cc0f39570ddde947459e293d7ebc2c30ff4e8fc45860afdcb2c2d3dc17',
      },
      {
        address: '0xd590cC180601AEcD6eeADD9B7f2B7611519544f4' as Address,
        provider: LiquidityProviders.MMFinance,
        fee: 0.0017,
        initCodeHash:
          '0x7ae6954210575e79ea2402d23bc6a59c4146a6e6296118aa8b99c747afec8acf',
      },
      elkV2Factory(ChainId.CRONOS),
    ],
    factoriesV3: [
      {
        address: '0x40aB11c64E9fF5368F09343Ac860dAfA34e14C35' as Address,
        provider: LiquidityProviders.VVSFlawless,
        deployer: '0x6757E8E1B694e60285D733D8684eF2F60b2407ff',
        initCodeHash:
          '0x3ea5f55d6524ce396b6eb0054ae36a854425f2ed4c48b04b78e228656dc0b7de',
        feeSpacingMap: {
          100: 1,
          500: 10,
          3000: 60,
          10_000: 200,
        },
      },
    ],
    tickHelperContractV3:
      '0xFe2b370F14Efe064Ae6ef17f44EB3F72594F2939' as Address,
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },

  [ChainId.SKALE_EUROPA]: {
    client: createPublicClient(extractorClientConfig(ChainId.SKALE_EUROPA)),
    factoriesV2: [sushiswapV2Factory(ChainId.SKALE_EUROPA)],
    factoriesV3: [sushiswapV3Factory(ChainId.SKALE_EUROPA)],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[
      ChainId.SKALE_EUROPA
    ] as Address,
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.ROOTSTOCK]: {
    client: createPublicClient(extractorClientConfig(ChainId.ROOTSTOCK)),
    factoriesV2: [sushiswapV2Factory(ChainId.ROOTSTOCK)],
    factoriesV3: [
      sushiswapV3Factory(ChainId.ROOTSTOCK),
      uniswapV3Factory(ChainId.ROOTSTOCK),
      elkV2Factory(ChainId.ROOTSTOCK),
    ],
    tickHelperContractV3: SUSHISWAP_V3_TICK_LENS[ChainId.ROOTSTOCK] as Address,
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.MANTLE]: {
    client: createPublicClient(extractorClientConfig(ChainId.MANTLE)),
    factoriesV2: [
      {
        address: '0xE5020961fA51ffd3662CDf307dEf18F9a87Cce7c',
        provider: LiquidityProviders.FusionXV2,
        fee: 0.002,
        initCodeHash:
          '0x58c684aeb03fe49c8a3080db88e425fae262c5ef5bf0e8acffc0526c6e3c03a0',
      },
    ],
    factoriesV3: [
      uniswapV3Factory(ChainId.MANTLE),
      {
        address: '0x25780dc8Fc3cfBD75F33bFDAB65e969b603b2035',
        deployer: '0xe9827B4EBeB9AE41FC57efDdDd79EDddC2EA4d03',
        provider: LiquidityProviders.Agni,
        feeSpacingMap: PANCAKESWAP_V3_FEE_SPACING_MAP,
        initCodeHash:
          '0xaf9bd540c3449b723624376f906d8d3a0e6441ff18b847f05f4f85789ab64d9a',
      },
      {
        address: '0x530d2766D1988CC1c000C8b7d00334c14B69AD71',
        deployer: '0x8790c2C3BA67223D83C8FCF2a5E3C650059987b4',
        provider: LiquidityProviders.FusionXV3,
        feeSpacingMap: PANCAKESWAP_V3_FEE_SPACING_MAP,
        initCodeHash:
          '0x1bce652aaa6528355d7a339037433a20cd28410e3967635ba8d2ddb037440dbf',
      },
      {
        address: '0x8f140Fc3e9211b8DC2fC1D7eE3292F6817C5dD5D',
        provider: LiquidityProviders.MethLab,
        initCodeHash:
          '0xacd26fbb15704ae5e5fe7342ea8ebace020e4fa5ad4a03122ce1678278cf382b',
      },
    ],
    factoriesAlgebra: [
      {
        address: '0xC848bc597903B4200b9427a3d7F61e3FF0553913' as Address,
        provider: LiquidityProviders.Swapsicle,
      },
    ],
    tickHelperContractV3:
      '0x38EB9e62ABe4d3F70C0e161971F29593b8aE29FF' as Address,
    tickHelperContractAlgebra:
      '0x92B858beD547A3F94d6E674D176C4a12F3A82326' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  [ChainId.ZKSYNC_ERA]: {
    client: createPublicClient(extractorClientConfig(ChainId.ZKSYNC_ERA)),
    factoriesV2: [pancakeswapV2Factory(ChainId.ZKSYNC_ERA)],
    factoriesV3: [
      uniswapV3Factory(ChainId.ZKSYNC_ERA),
      pancakeswapV3Factory(ChainId.ZKSYNC_ERA),
      wagmiV3Factory(ChainId.ZKSYNC_ERA),
    ],
    tickHelperContractV3:
      '0xe10FF11b809f8EE07b056B452c3B2caa7FE24f89' as Address,
    tickHelperContractAlgebra:
      '0x0000000000000000000000000000000000000000' as Address,
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
  },
  // [ChainId.RONIN]: {
  //   client: createPublicClient(extractorClientConfig(ChainId.RONIN]),
  //   factoriesV2: [],
  //   factoriesV3: [],
  //   tickHelperContract: '0x0000000000000000000000000000000000000000' as Address,
  //   cacheDir: './cache',
  //   logDepth: 50,
  //   logging: true,
  // },
} as const satisfies Record<ExtractorSupportedChainId, ExtractorConfig>

export const PORT = process.env['PORT'] || 80

export const SENTRY_DSN = process.env['SENTRY_DSN'] as string
if (!SENTRY_DSN) {
  throw new Error('SENTRY_DSN is not set')
}
export const SENTRY_ENVIRONMENT = process.env['SENTRY_ENVIRONMENT'] as string
if (!SENTRY_ENVIRONMENT) {
  throw new Error('SENTRY_ENVIRONMENT is not set')
}

export const CHAIN_ID = Number(
  process.env['CHAIN_ID'],
) as keyof typeof EXTRACTOR_CONFIG
if (!CHAIN_ID) {
  throw new Error('CHAIN_ID is not set')
}

if (!(CHAIN_ID in EXTRACTOR_CONFIG)) {
  throw new Error(`EXTRACTOR_CONFIG is not set for CHAIN_ID=${CHAIN_ID}`)
}

export const POOLS_SERIALIZATION_INTERVAL = (_chainId: ChainId) => 4_000
export const REQUESTED_PAIRS_SERIALIZATION_INTERVAL = (_chainId: ChainId) =>
  120_000
