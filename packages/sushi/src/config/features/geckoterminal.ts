import { ChainId } from '../../chain/constants.js'

export const GECKOTERMINAL_CHAIN_ID_BY_NAME = {
  eth: 1,
  bsc: 56,
  polygon_pos: 137,
  avax: 43114,
  cro: 25,
  one: 1666600000,
  boba: 288,
  ftm: 250,
  metis: 1088,
  arbitrum: 42161,
  fuse: 122,
  okexchain: 66,
  celo: 42220,
  xdai: 100,
  heco: 128,
  glmr: 1284,
  optimism: 10,
  tlos: 40,
  bttc: 199,
  kava: 2222,
  thundercore: 108,
  arbitrum_nova: 42170,
  core: 1116,
  filecoin: 314,
  zksync: 324,
  'polygon-zkevm': 1101,
  linea: 59144,
  base: 8453,
  scroll: 534352,
  zetachain: 7000,
  blast: 81457,
  'boba-bnb': 56288,
  rootstock: 30,
  'skale-europa': 2046399126,
} as const satisfies Record<string, ChainId>

export const GECKOTERMINAL_SUPPORTED_CHAIN_IDS = Object.values(
  GECKOTERMINAL_CHAIN_ID_BY_NAME,
) as GeckoTerminalChainId[]

export type GeckoTerminalChainId =
  (typeof GECKOTERMINAL_CHAIN_ID_BY_NAME)[keyof typeof GECKOTERMINAL_CHAIN_ID_BY_NAME]

export const isGeckoTerminalChainId = (
  chainId: ChainId,
): chainId is GeckoTerminalChainId =>
  GECKOTERMINAL_SUPPORTED_CHAIN_IDS.includes(chainId as GeckoTerminalChainId)
