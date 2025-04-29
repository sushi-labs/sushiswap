import type { KadenaToken } from '~kadena/_common/types/token-type'
import { IS_TESTNET } from './is-testnet'

export const KADENA: KadenaToken = {
  tokenAddress: 'coin',
  tokenSymbol: 'KDA',
  tokenDecimals: 12,
  name: 'Kadena',
  tokenImage: '/kadena-logo.png',
  validated: true,
}

export const WIZA: KadenaToken = {
  tokenAddress: 'free.wiza',
  tokenSymbol: 'WIZA',
  tokenDecimals: 12,
  name: 'WIZA',
  tokenImage:
    'https://kdswapassets.blob.core.windows.net/public/tokens/wiza.jpeg',
  validated: true,
}

export const USDT: KadenaToken = {
  tokenAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  tokenSymbol: 'USDT',
  tokenDecimals: 12,
  name: 'Tether USD',
  tokenImage:
    'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64/d_unknown.png/tokens/1/0xdAC17F958D2ee523a2206206994597C13D831ec7.jpg',
  validated: true,
}

export const USDC: KadenaToken = {
  tokenAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  tokenSymbol: 'USDC',
  tokenDecimals: 12,
  name: 'USD Coin',
  tokenImage:
    'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_48/d_unknown.png/tokens/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.jpg',
  validated: true,
}

const MAINNET_TOKENS: KadenaToken[] = [KADENA, WIZA, USDT, USDC]

const TESTNET_TOKENS: KadenaToken[] = [
  KADENA,
  {
    tokenSymbol: 'USDT',
    tokenAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    tokenDecimals: 12,
    name: 'Tether USD',
    tokenImage:
      'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64/d_unknown.png/tokens/1/0xdAC17F958D2ee523a2206206994597C13D831ec7.jpg',
  },
  {
    tokenSymbol: 'USDC',
    tokenAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    tokenDecimals: 12,
    name: 'USD Coin',
    tokenImage:
      'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_48/d_unknown.png/tokens/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.jpg',
  },
  {
    tokenSymbol: 'BTC',
    tokenAddress: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
    tokenDecimals: 12,
    name: 'Bitcoin',
    tokenImage:
      'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64/d_unknown.png/tokens/1/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.jpg',
  },
]

export const DEFAULT_TOKEN_LIST = IS_TESTNET ? TESTNET_TOKENS : MAINNET_TOKENS

export const STABLE_TOKENS = DEFAULT_TOKEN_LIST.filter(
  (token) =>
    token.tokenSymbol === 'USDT' ||
    token.tokenSymbol === 'TUSD' ||
    token.tokenSymbol === 'USDC',
)

export const COMMON_TOKENS = DEFAULT_TOKEN_LIST.filter(
  (token) =>
    token.tokenSymbol === 'KADENA' ||
    token.tokenSymbol === 'USDC' ||
    token.tokenSymbol === 'USDT' ||
    token.tokenSymbol === 'WETH',
)
