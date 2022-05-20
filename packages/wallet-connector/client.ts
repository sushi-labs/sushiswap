import { ChainId } from '@sushiswap/chain'
import { chain, createClient, defaultChains, defaultL2Chains } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { getProvider, getWebsocketProvider } from './provider'

const ALCHEMY_API_KEY: Record<number, string> = {
  [ChainId.ETHEREUM]: 'q1pMGalg0HNBvK1eaZoo-vng-EPWlt1t',
  [ChainId.ARBITRUM]: 'eO_ha0kuIlFWSqXokR6-K5LzGx4qB9XV',
  [ChainId.OPTIMISM]: 'rtbMqQGp96fbuXxzUS2fct34eYzA7tY8',
  [ChainId.POLYGON]: 'vZft72lBzQ100fCIJTyohJR1tWrMsUei',
  [ChainId.POLYGON_TESTNET]: 'JW13aE7MytaJNzSZ-BI4L-XfmaMqMip_',
  [ChainId.GÖRLI]: 'BXrZLhuc63Gn91NoLVVFDJ010M-AwOa2',
}

const defaultChain = chain.mainnet

export function getAlchemyChainName(chainId?: ChainId) {
  if (!chainId) return
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'homestead'
    case ChainId.POLYGON:
      return 'matic'
    case ChainId.POLYGON_TESTNET:
      return 'maticmum'
    case ChainId.ARBITRUM:
      return 'arbitrum'
    case ChainId.OPTIMISM:
      return 'optimism'
    case ChainId.GÖRLI:
      return 'goerli'
    default:
      throw new Error(`Unsupported eth alchemy chainId for ${chainId}`)
  }
}

export function getInfuraChainName(chainId?: ChainId) {
  if (!chainId) return
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'homestead'
    case ChainId.POLYGON:
      return 'matic'
    case ChainId.ARBITRUM:
      return 'arbitrum'
    case ChainId.RINKEBY:
      return 'rinkeby'
    case ChainId.ROPSTEN:
      return 'ropsten'
    case ChainId.GÖRLI:
      return 'goerli'
    case ChainId.KOVAN:
      return 'kovan'
    default:
      throw new Error(`Unsupported eth infura chainId for ${chainId}`)
  }
}

const isChainSupported = (chainId?: number) => {
  return [...defaultChains, ...defaultL2Chains].some((x) => x.id === chainId)
}

const client = createClient({
  autoConnect: true,
  connectors({ chainId }) {
    const chain = [...defaultChains, ...defaultL2Chains].find((chain) => chain.id === chainId) ?? defaultChain
    const rpcUrl =
      chainId && chain.rpcUrls.alchemy ? `${chain.rpcUrls.alchemy}/${ALCHEMY_API_KEY[chainId]}` : chain.rpcUrls.default

    console.log({ chain, rpcUrl })
    return [
      new InjectedConnector({
        chains: [...defaultChains, ...defaultL2Chains],
      }),
      new WalletConnectConnector({
        // TODO: Flesh out wallet connect options?
        // bridge?
        options: {
          qrcode: true,
          rpc: {
            [chain.id]: rpcUrl,
          },
        },
      }),
      new CoinbaseWalletConnector({
        // TODO: Flesh out coinbase wallet connect options?
        options: {
          appName: 'Sushi 2.0',
          appLogoUrl: 'https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo.svg',
          chainId: chain.id,
          jsonRpcUrl: rpcUrl,
        },
      }),
    ]
  },
  provider({ chainId }) {
    return getProvider(chainId ? chainId : defaultChain.id)
  },
  webSocketProvider({ chainId }) {
    return getWebsocketProvider(chainId ? chainId : defaultChain.id)
  },
  // storage: createStorage({ storage: window.localStorage }),
})

export default client
