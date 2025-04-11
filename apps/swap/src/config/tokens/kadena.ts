export interface TokenInfo {
  decimalsToDisplay?: number
  description?: string
  discordUrl?: string
  websiteUrl?: string
  twitterUrl?: string
  themeColor?: string
  telegramUrl?: string
  mediumUrl?: string
}

export interface KadenaToken {
  tokenAddress: string
  tokenSymbol: string
  tokenDecimals: number
  tokenImage?: string
  name: string
  tokenInfo?: TokenInfo
  validated?: boolean
}

export const KADENA_TOKENS: KadenaToken[] = [
  {
    tokenAddress: 'coin',
    tokenSymbol: 'KDA',
    tokenDecimals: 12,
    name: 'Kadena',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/K%20Logo%20Dark%20Blue%20Backround.png',
    validated: true,
  },
  {
    tokenAddress: 'free.wiza',
    tokenSymbol: 'WIZA',
    tokenDecimals: 12,
    name: 'WIZA',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/wiza.jpeg',
    validated: true,
  },
  {
    tokenAddress: 'kdlaunch.kdswap-token',
    tokenSymbol: 'KDS',
    tokenDecimals: 12,
    name: 'KDSwap',
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
    name: 'KDLaunch',
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
    name: 'Babena',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/babena-logo.svg',
    validated: true,
  },
  {
    tokenAddress: 'runonflux.flux',
    tokenSymbol: 'FLUX',
    tokenDecimals: 12,
    name: 'Flux',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/flux-logo.svg',
    validated: true,
  },
  {
    tokenAddress: 'hypercent.prod-hype-coin',
    tokenSymbol: 'HYPE',
    tokenDecimals: 12,
    name: 'Hype',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/hype-logo.svg',
    validated: true,
  },
  {
    tokenAddress: 'mok.token',
    tokenSymbol: 'MOK',
    tokenDecimals: 12,
    name: 'MoK',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/mok-logo.png',
    validated: true,
  },
  {
    tokenAddress: 'free.kishu-ken',
    tokenSymbol: 'KISHK',
    tokenDecimals: 13,
    name: 'Kishu Ken',
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
    name: 'Backalley',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/backalley-logo.png',
    validated: true,
  },
  {
    tokenAddress: 'kaddex.kdx',
    tokenSymbol: 'KDX',
    tokenDecimals: 12,
    name: 'Ecko',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/kaddex-logo.svg',
    validated: true,
  },
  {
    tokenAddress: 'free.kapybara-token',
    tokenSymbol: 'KAPY',
    tokenDecimals: 12,
    name: 'Kapybara Token',
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
    name: 'Jodie Inu',
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
    name: 'Purple Kdoge',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/kdoge.png',
    validated: true,
  },
  {
    tokenAddress: 'free.corona-token',
    tokenSymbol: 'CRNA',
    tokenDecimals: 12,
    name: 'CRNA',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/crna.png',
    validated: true,
  },
  {
    tokenAddress: 'n_5a7ccd559b245b7dcbd5259e1ee43d04fbf93eab.kapepe',
    tokenSymbol: 'KPP',
    tokenDecimals: 12,
    name: 'Kapepe',
    tokenImage: 'https://kapepe.xyz/assets/images/image03.jpg',
    validated: true,
    tokenInfo: {
      decimalsToDisplay: 12,
    },
  },
  {
    tokenAddress: 'free.cyberfly_token',
    tokenSymbol: 'CFLY',
    tokenDecimals: 12,
    name: 'Cyberfly',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/cfly-logo.png',
    validated: true,
  },
  {
    tokenAddress: 'free.maga',
    tokenSymbol: 'MAGA',
    tokenDecimals: 12,
    name: 'MAGA',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/maga-logo.png',
    validated: true,
  },
  {
    tokenAddress: 'n_582fed11af00dc626812cd7890bb88e72067f28c.bro',
    tokenSymbol: 'BRO',
    tokenDecimals: 12,
    name: 'Bro',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/bro.png',
    validated: true,
  },
  {
    tokenAddress: 'n_518dfea5f0d2abe95cbcd8956eb97f3238e274a9.AZUKI',
    tokenSymbol: 'AZUKI',
    tokenDecimals: 6,
    name: 'Azuki',
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
    name: 'Crankk',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/crankk.png',
    validated: true,
  },
  {
    tokenAddress: 'free.teckel',
    tokenSymbol: 'TECKEL',
    tokenDecimals: 12,
    name: 'Teckel',
    tokenImage:
      'https://kdswapassets.blob.core.windows.net/public/tokens/teckel.png',
    validated: true,
  },
]
