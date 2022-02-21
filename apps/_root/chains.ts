import { ChainId } from '@sushiswap/core-sdk'
import { AddEthereumChainParameter } from '@web3-react/types'

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
}

interface BasicChainInformation {
  urls: (string | undefined)[]
  name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

function isExtendedChainInformation(
  chainInformation?: BasicChainInformation | ExtendedChainInformation,
): chainInformation is ExtendedChainInformation {
  if (!chainInformation) return false
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: ChainId): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls as string[],
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
}

export enum ExtraChains {
  OPTIMISM = 10,
  OPTIMISM_KOVAN = 69,
  ARBITRUM_TESTNET = 421611,
}

type ChainUrls = {
  [C in ChainId | ExtraChains]?: BasicChainInformation | ExtendedChainInformation
}

export const CHAINS: ChainUrls = {
  [ChainId.ETHEREUM]: {
    urls: [
      process.env['infuraKey'] ? `https://mainnet.infura.io/v3/${process.env['infuraKey']}` : undefined,
      process.env['alchemyKey'] ? `https://eth-mainnet.alchemyapi.io/v2/${process.env['alchemyKey']}` : undefined,
      'https://cloudflare-eth.com',
    ],
    name: 'Mainnet',
  },
  [ChainId.ROPSTEN]: {
    urls: [process.env['infuraKey'] ? `https://ropsten.infura.io/v3/${process.env['infuraKey']}` : undefined],
    name: 'Ropsten',
  },
  [ChainId.RINKEBY]: {
    urls: [process.env['infuraKey'] ? `https://rinkeby.infura.io/v3/${process.env['infuraKey']}` : undefined],
    name: 'Rinkeby',
  },
  [ChainId.GÖRLI]: {
    urls: [process.env['infuraKey'] ? `https://goerli.infura.io/v3/${process.env['infuraKey']}` : undefined],
    name: 'Görli',
  },
  [ChainId.KOVAN]: {
    urls: [process.env['infuraKey'] ? `https://kovan.infura.io/v3/${process.env['infuraKey']}` : undefined],
    name: 'Kovan',
  },
  [ExtraChains.OPTIMISM]: {
    urls: [
      process.env['infuraKey'] ? `https://optimism-mainnet.infura.io/v3/${process.env['infuraKey']}` : undefined,
      'https://mainnet.optimism.io',
    ],
    name: 'Optimistic Ethereum',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  [ExtraChains.OPTIMISM_KOVAN]: {
    urls: [
      process.env['infuraKey'] ? `https://optimism-kovan.infura.io/v3/${process.env['infuraKey']}` : undefined,
      'https://kovan.optimism.io',
    ],
    name: 'Optimistic Kovan',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
  },
  [ChainId.ARBITRUM]: {
    urls: [
      process.env['infuraKey'] ? `https://arbitrum-mainnet.infura.io/v3/${process.env['infuraKey']}` : undefined,
      'https://arb1.arbitrum.io/rpc',
    ],
    name: 'Arbitrum One',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [ExtraChains.ARBITRUM_TESTNET]: {
    urls: [
      process.env['infuraKey'] ? `https://arbitrum-rinkeby.infura.io/v3/${process.env['infuraKey']}` : undefined,
      'https://rinkeby.arbitrum.io/rpc',
    ],
    name: 'Arbitrum Testnet',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://testnet.arbiscan.io'],
  },
  [ChainId.MATIC]: {
    urls: [
      process.env['infuraKey'] ? `https://polygon-mainnet.infura.io/v3/${process.env['infuraKey']}` : undefined,
      'https://polygon-rpc.com',
    ],
    name: 'Polygon Mainnet',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [ChainId.MATIC_TESTNET]: {
    urls: [
      process.env['infuraKey'] ? `https://polygon-mumbai.infura.io/v3/${process.env['infuraKey']}` : undefined,
      'https://rpc-mumbai.maticvigil.com',
    ],
    name: 'Polygon Mumbai',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
}
