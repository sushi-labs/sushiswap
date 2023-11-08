export const UNI_LIST = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'
export const UNI_EXTENDED_LIST =
  'https://gateway.ipfs.io/ipns/extendedtokens.uniswap.org'
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
const COINGECK_BASE_LIST = 'https://tokens.coingecko.com/base/all.json'
const COINGECKO_BNB_LIST =
  'https://tokens.coingecko.com/binance-smart-chain/all.json'
const COINGECKO_ARBITRUM_LIST =
  'https://tokens.coingecko.com/arbitrum-one/all.json'
const COINGECKO_OPTIMISM_LIST =
  'https://tokens.coingecko.com/optimistic-ethereum/all.json'
const COINGECKO_CELO_LIST = 'https://tokens.coingecko.com/celo/all.json'
const COINGECKO_POLYGON_LIST =
  'https://tokens.coingecko.com/polygon-pos/all.json'
const COINGECKO_AVAX_LIST = 'https://tokens.coingecko.com/avalanche/all.json'
const COMPOUND_LIST =
  'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const SET_LIST =
  'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'

export const OPTIMISM_LIST =
  'https://static.optimism.io/optimism.tokenlist.json'
export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const CELO_LIST =
  'https://celo-org.github.io/celo-token-list/celo.tokenlist.json'
export const PLASMA_BNB_LIST =
  'https://raw.githubusercontent.com/plasmadlt/plasma-finance-token-list/master/bnb.json'

// default lists to be 'active' aka searched across
export const DEFAULT_LIST_OF_LISTS: string[] = [
  UNI_LIST,
  UNI_EXTENDED_LIST,
  COMPOUND_LIST,
  COINGECKO_LIST,
  COINGECK_BASE_LIST,
  COINGECKO_BNB_LIST,
  COINGECKO_ARBITRUM_LIST,
  COINGECKO_OPTIMISM_LIST,
  COINGECKO_CELO_LIST,
  COINGECKO_POLYGON_LIST,
  COINGECKO_AVAX_LIST,
  GEMINI_LIST,
  SET_LIST,
  ARBITRUM_LIST,
  OPTIMISM_LIST,
  CELO_LIST,
  PLASMA_BNB_LIST,
]
