export const BA_LIST =
  'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'
export const YEARN_LIST = 'https://yearn.science/static/tokenlist.json'
export const NFTX_LIST = 'https://nftx.ethereumdb.com/v2/tokenlist/'
export const SYNTHETIX_LIST = 'synths.snx.eth'
export const AAVE_LIST = 'tokenlist.aave.eth'
export const CMC_ALL_LIST = 'https://api.coinmarketcap.com/data-api/v3/uniswap/all.json'
export const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
export const COMPOUND_LIST =
  'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
export const GEMINI_TOKEN_LIST = 'https://www.gemini.com/uniswap/manifest.json'
export const KLEROS_LIST = 't2crtokens.eth'
export const ARBITRUM_TOKEN_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
export const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
export const UMA_LIST = 'https://umaproject.org/uma.tokenlist.json'
export const WRAPPED_LIST = 'wrapped.tokensoft.eth'
export const ROLL_LIST = 'https://app.tryroll.com/tokens.json'
export const DHEDGE_LIST = 'https://list.dhedge.eth.link'
export const SUSHI_TOKEN_LIST = 'https://token-list.sushi.com'
export const CHAINLINK_TOKEN_LIST = 'https://token-list.sushi.com/chainlink'

export const UNSUPPORTED_TOKEN_LIST_URLS: string[] = [BA_LIST]

// this is the default list of lists that are exposed to users
// lower index == higher priority for token import
export const DEFAULT_TOKEN_LIST_OF_TOKEN_LISTS_TO_DISPLAY: string[] = [
  SUSHI_TOKEN_LIST,
  CHAINLINK_TOKEN_LIST,
  COMPOUND_LIST,
  AAVE_LIST,
  CMC_ALL_LIST,
  COINGECKO_LIST,
  UMA_LIST,
  YEARN_LIST,
  SYNTHETIX_LIST,
  KLEROS_LIST,
  GEMINI_TOKEN_LIST,
  WRAPPED_LIST,
  SET_LIST,
  ROLL_LIST,
  NFTX_LIST,
  DHEDGE_LIST,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DEFAULT_TOKEN_LIST_OF_TOKEN_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_TOKEN_LIST_URLS, // need to load dynamic unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [SUSHI_TOKEN_LIST, CHAINLINK_TOKEN_LIST, GEMINI_TOKEN_LIST]
