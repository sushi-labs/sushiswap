export const BA_LIST =
  'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'

export const UNSUPPORTED_TOKEN_LIST_URLS: string[] = [BA_LIST]

export const SUSHI_DEFAULT_TOKEN_LIST = 'https://token-list.sushi.com'
export const SUSHI_CHAINLINK_TOKEN_LIST =
  'https://token-list.sushi.com/chainlink'

export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const OPTIMISM_LIST =
  'https://static.optimism.io/optimism.tokenlist.json'

// this is the default list of lists that are exposed to users
// lower index == higher priority for token import
export const DEFAULT_TOKEN_LIST_OF_TOKEN_LISTS_TO_DISPLAY: string[] = [
  SUSHI_DEFAULT_TOKEN_LIST,
  SUSHI_CHAINLINK_TOKEN_LIST,
  OPTIMISM_LIST,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DEFAULT_TOKEN_LIST_OF_TOKEN_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_TOKEN_LIST_URLS, // need to load dynamic unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [
  SUSHI_DEFAULT_TOKEN_LIST,
  SUSHI_CHAINLINK_TOKEN_LIST,
  OPTIMISM_LIST,
]
