import { ChainId } from '@sushiswap/chain'
import { providers } from 'ethers'
import { chain, createClient, defaultChains, defaultL2Chains } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const ALCHEMY_API_KEY: Record<number, string> = {
  [ChainId.ETHEREUM]: 'q1pMGalg0HNBvK1eaZoo-vng-EPWlt1t',
  [ChainId.ARBITRUM]: 'eO_ha0kuIlFWSqXokR6-K5LzGx4qB9XV',
  [ChainId.OPTIMISM]: 'rtbMqQGp96fbuXxzUS2fct34eYzA7tY8',
  [ChainId.POLYGON]: 'vZft72lBzQ100fCIJTyohJR1tWrMsUei',
  [ChainId.POLYGON_TESTNET]: 'JW13aE7MytaJNzSZ-BI4L-XfmaMqMip_',
  [ChainId.GÖRLI]: 'BXrZLhuc63Gn91NoLVVFDJ010M-AwOa2',
}

const defaultChain = chain.mainnet

const isChainSupported = (chainId?: number) => {
  // console.log(
  //   `isChainSupported ${chainId} `,
  //   [...defaultChains, ...defaultL2Chains].some((x) => x.id === chainId),
  // )
  return [...defaultChains, ...defaultL2Chains].some((x) => x.id === chainId)
}

const client = createClient({
  autoConnect: true,
  connectors({ chainId }) {
    const chain = [...defaultChains, ...defaultL2Chains].find((chain) => chain.id === chainId) ?? defaultChain
    const rpcUrl = chain.rpcUrls.alchemy
      ? `${chain.rpcUrls.alchemy}/${ALCHEMY_API_KEY[chainId]}`
      : chain.rpcUrls.default
    // const rpcUrl = 'https://arb-mainnet.g.alchemy.com/v2/eO_ha0kuIlFWSqXokR6-K5LzGx4qB9XV'

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
    return new providers.AlchemyProvider(
      chainId,
      // isChainSupported(chainId) ? chainId : defaultChain.id,
      ALCHEMY_API_KEY[chainId]
    )
  },
  webSocketProvider({ chainId }) {
    return new providers.AlchemyWebSocketProvider(
      chainId,
      // isChainSupported(chainId) ? chainId : defaultChain.id,
      ALCHEMY_API_KEY[chainId]
    )
  },
  // storage: createStorage({ storage: window.localStorage }),
})

export default client
