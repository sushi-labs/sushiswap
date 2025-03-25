import type { IToken } from '~kadena/_common/types/token-type'
import { IS_TESTNET } from './is-testnet'

export const KADENA: IToken = {
  address: 'KADENA',
  decimals: 12,
  logoURI:
    'https://kdswapassets.blob.core.windows.net/public/tokens/K%20Logo%20Dark%20Blue%20Backround.png',
  name: 'KADENA',
  symbol: 'KDN',
}

const MAINNET_TOKENS: IToken[] = [
  KADENA,

  {
    symbol: 'USDT',
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    decimals: 12,
    name: 'Tether USD',
    logoURI:
      'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64/d_unknown.png/tokens/1/0xdAC17F958D2ee523a2206206994597C13D831ec7.jpg',
  },
  {
    symbol: 'USDC',
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    decimals: 12,
    name: 'USD Coin',
    logoURI:
      'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_48/d_unknown.png/tokens/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.jpg',
  },
  {
    symbol: 'BTC',
    address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
    decimals: 12,
    name: 'Bitcoin',
    logoURI:
      'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64/d_unknown.png/tokens/1/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.jpg',
  },
]

const TESTNET_TOKENS: IToken[] = [
  {
    address: 'TRON',
    decimals: 6,
    logoURI:
      'https://static.tronscan.org/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png?t=1598430824415',
    name: 'TRX (TRON)',
    symbol: 'TRX',
  },
  {
    address: 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR', //mainnet address currently
    decimals: 6,
    logoURI:
      'https://static.tronscan.org/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png?t=1598430824415',
    name: 'Wrapped TRX',
    symbol: 'WTRX',
  },
  {
    address: 'TSdZwNqpHofzP6BsBKGQUWdBeJphLmF6id',
    decimals: 6,
    logoURI:
      'https://static.tronscan.org/production/upload/logo/TEkxiTehnzSmSe2XqrBj4w32RUN966rdz81.png',
    name: 'USDC Coin',
    symbol: 'USDC',
  },
  {
    symbol: 'USDD',
    address: 'TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn',
    decimals: 18,
    name: 'Decentralized USD',
    logoURI:
      'https://static.tronscan.org/production/upload/logo/TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn.png',
  },
]

export const DEFAULT_TOKEN_LIST = IS_TESTNET ? TESTNET_TOKENS : MAINNET_TOKENS

export const STABLE_TOKENS = DEFAULT_TOKEN_LIST.filter(
  (token) =>
    token.symbol === 'USDT' ||
    token.symbol === 'TUSD' ||
    token.symbol === 'USDC',
)

export const COMMON_TOKENS = DEFAULT_TOKEN_LIST.filter(
  (token) =>
    token.symbol === 'KADENA' ||
    token.symbol === 'USDC' ||
    token.symbol === 'USDT' ||
    token.symbol === 'BTC' ||
    token.symbol === 'WETH',
)
