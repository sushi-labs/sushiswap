import type { KadenaToken } from '~kadena/_common/types/token-type'
import { IS_TESTNET } from './is-testnet'

export const KADENA: KadenaToken = {
  tokenAddress: 'coin',
  tokenSymbol: 'KDA',
  tokenDecimals: 12,
  tokenName: 'Kadena',
  tokenImage: '/kadena-logo.png',
  validated: true,
}

export const WIZA: KadenaToken = {
  tokenAddress: 'free.wiza',
  tokenSymbol: 'WIZA',
  tokenDecimals: 12,
  tokenName: 'WIZA',
  tokenImage:
    'https://kdswapassets.blob.core.windows.net/public/tokens/wiza.jpeg',
  validated: true,
}

export const USDT: KadenaToken = {
  tokenAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  tokenSymbol: 'USDT',
  tokenDecimals: 12,
  tokenName: 'Tether USD',
  tokenImage:
    'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64/d_unknown.png/tokens/1/0xdAC17F958D2ee523a2206206994597C13D831ec7.jpg',
  validated: true,
}

export const USDC: KadenaToken = {
  tokenAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  tokenSymbol: 'USDC',
  tokenDecimals: 12,
  tokenName: 'USD Coin',
  tokenImage:
    'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_48/d_unknown.png/tokens/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.jpg',
  validated: true,
}

export const KADENA_TOKENS: KadenaToken[] = [
  {
    tokenAddress: 'coin',
    tokenSymbol: 'KDA',
    tokenDecimals: 12,
    tokenName: 'Kadena',
    tokenImage: '/kadena-logo.png',
    validated: true,
  },
  {
    tokenAddress: 'free.wiza',
    tokenSymbol: 'WIZA',
    tokenDecimals: 12,
    tokenName: 'WIZA',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/wiza.jpeg',
    validated: true,
  },
  {
    tokenAddress: 'kdlaunch.kdswap-token',
    tokenSymbol: 'KDS',
    tokenDecimals: 12,
    tokenName: 'KDSwap',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/kds-logo.svg',
    validated: true,
    tokenInfo: {
      decimalsToDisplay: 4,
      description: 'KDSwap, A revolutionary gas-free DEX built on Kadena',
      websiteUrl: 'https://www.kdswap.exchange/',
      twitterUrl: 'https://twitter.com/KdSwap',
      themeColor: '86, 188, 247',
      telegramUrl: 'https://t.me/KDSwapOfficial',
    },
  },
  {
    tokenAddress: 'kdlaunch.token',
    tokenSymbol: 'KDL',
    tokenDecimals: 12,
    tokenName: 'KDLaunch',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/kdl-logo.svg',
    validated: true,
    tokenInfo: {
      decimalsToDisplay: 4,
      description:
        'KDL is the first truly decentralized IDO platform on Kadena, enabling projects to distribute tokens and raise liquidity. Hold KDLaunch tokens to get priority-access to promising projects.',
      discordUrl: 'https://discord.com/invite/GghUdhmk6z',
      websiteUrl: 'https://www.kdlaunch.com/',
      twitterUrl: 'https://twitter.com/KdLaunch',
      themeColor: '10, 168, 179',
      telegramUrl: 'https://t.me/KDLaunchOfficial',
      mediumUrl: 'https://kdlaunch.medium.com/',
    },
  },
  {
    tokenAddress: 'free.babena',
    tokenSymbol: 'BABE',
    tokenDecimals: 12,
    tokenName: 'Babena',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/babena-logo.svg',
    validated: true,
  },
  {
    tokenAddress: 'runonflux.flux',
    tokenSymbol: 'FLUX',
    tokenDecimals: 12,
    tokenName: 'Flux',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/flux-logo.svg',
    validated: true,
  },
  {
    tokenAddress: 'hypercent.prod-hype-coin',
    tokenSymbol: 'HYPE',
    tokenDecimals: 12,
    tokenName: 'Hype',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/hype-logo.svg',
    validated: true,
  },
  {
    tokenAddress: 'mok.token',
    tokenSymbol: 'MOK',
    tokenDecimals: 12,
    tokenName: 'MoK',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/mok-logo.png',
    validated: true,
  },
  {
    tokenAddress: 'free.kishu-ken',
    tokenSymbol: 'KISHK',
    tokenDecimals: 13,
    tokenName: 'Kishu Ken',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/kishu-logo.png',
    validated: true,
    tokenInfo: {
      decimalsToDisplay: 13,
    },
  },
  {
    tokenAddress: 'free.backalley',
    tokenSymbol: 'BKA',
    tokenDecimals: 12,
    tokenName: 'Backalley',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/backalley-logo.png',
    validated: true,
  },
  {
    tokenAddress: 'kaddex.kdx',
    tokenSymbol: 'KDX',
    tokenDecimals: 12,
    tokenName: 'Ecko',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/kaddex-logo.svg',
    validated: true,
  },
  {
    tokenAddress: 'free.kapybara-token',
    tokenSymbol: 'KAPY',
    tokenDecimals: 12,
    tokenName: 'Kapybara Token',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/kapy-logo.svg',
    validated: true,
    tokenInfo: {
      decimalsToDisplay: 12,
    },
  },
  {
    tokenAddress: 'free.jodie-token',
    tokenSymbol: 'JDE',
    tokenDecimals: 12,
    tokenName: 'Jodie Inu',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/jodie-logo.png',
    validated: true,
    tokenInfo: {
      decimalsToDisplay: 12,
    },
  },
  {
    tokenAddress: 'free.kdoge',
    tokenSymbol: 'KDOGE',
    tokenDecimals: 12,
    tokenName: 'Purple Kdoge',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/kdoge.png',
    validated: true,
  },
  {
    tokenAddress: 'free.corona-token',
    tokenSymbol: 'CRNA',
    tokenDecimals: 12,
    tokenName: 'CRNA',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/crna.png',
    validated: true,
  },
  {
    tokenAddress: 'free.cyberfly_token',
    tokenSymbol: 'CFLY',
    tokenDecimals: 12,
    tokenName: 'Cyberfly',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/cfly-logo.png',
    validated: true,
  },
  {
    tokenAddress: 'free.maga',
    tokenSymbol: 'MAGA',
    tokenDecimals: 12,
    tokenName: 'MAGA',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/maga-logo.png',
    validated: true,
  },
  {
    tokenAddress: 'n_582fed11af00dc626812cd7890bb88e72067f28c.bro',
    tokenSymbol: 'BRO',
    tokenDecimals: 12,
    tokenName: 'Bro',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/bro.png',
    validated: true,
  },
  {
    tokenAddress: 'n_518dfea5f0d2abe95cbcd8956eb97f3238e274a9.AZUKI',
    tokenSymbol: 'AZUKI',
    tokenDecimals: 6,
    tokenName: 'Azuki',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/azuki.png',
    validated: true,
    tokenInfo: {
      decimalsToDisplay: 6,
      description: 'The most trustworthy and loveable dog on Kadena',
      websiteUrl: 'https://azukionkadena.fun/',
      twitterUrl: 'https://x.com/AzukiKDA',
      themeColor: '33, 141, 197',
      telegramUrl: 'https://t.me/AzukiKDA',
    },
  },
  {
    tokenAddress: 'free.crankk01',
    tokenSymbol: 'CRKK',
    tokenDecimals: 12,
    tokenName: 'Crankk',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/crankk.png',
    validated: true,
  },
  {
    tokenAddress: 'free.teckel',
    tokenSymbol: 'TECKEL',
    tokenDecimals: 12,
    tokenName: 'Teckel',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/teckel.png',
    validated: true,
  },
]

export const DEFAULT_TOKEN_LIST = KADENA_TOKENS.slice(0, -1)

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
