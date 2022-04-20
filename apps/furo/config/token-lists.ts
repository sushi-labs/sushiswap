const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'
const YEARN_LIST = 'https://yearn.science/static/tokenlist.json'
const NFTX_LIST = 'https://nftx.ethereumdb.com/v2/tokenlist/'
const SYNTHETIX_LIST = 'synths.snx.eth'
const AAVE_LIST = 'tokenlist.aave.eth'
const CMC_ALL_LIST = 'https://api.coinmarketcap.com/data-api/v3/uniswap/all.json'
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const KLEROS_LIST = 't2crtokens.eth'
export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
const UMA_LIST = 'https://umaproject.org/uma.tokenlist.json'
const WRAPPED_LIST = 'wrapped.tokensoft.eth'
const ROLL_LIST = 'https://app.tryroll.com/tokens.json'
const DHEDGE_LIST = 'https://list.dhedge.eth.link'

export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST]

// this is the default list of lists that are exposed to users
// lower index == higher priority for token import
const DEFAULT_LIST_OF_LISTS_TO_DISPLAY: string[] = [
  // UNI_LIST,
  COMPOUND_LIST,
  AAVE_LIST,
  CMC_ALL_LIST,
  COINGECKO_LIST,
  UMA_LIST,
  YEARN_LIST,
  SYNTHETIX_LIST,
  KLEROS_LIST,
  GEMINI_LIST,
  WRAPPED_LIST,
  SET_LIST,
  ROLL_LIST,
  NFTX_LIST,
  DHEDGE_LIST,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DEFAULT_LIST_OF_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_LIST_URLS, // need to load dynamic unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [
  // UNI_LIST,
  GEMINI_LIST,
]
