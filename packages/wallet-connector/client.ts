import { createClient, chain, defaultChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { providers } from 'ethers'

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string

const defaultChain = chain.mainnet

const isChainSupported = (chainId?: number) => defaultChains.some((x) => x.id === chainId)

const client = createClient({
  autoConnect: true,
  connectors({ chainId }) {
    const chain = defaultChains.find((chain) => chain.id === chainId) ?? defaultChain
    const rpcUrl = chain.rpcUrls.alchemy ? `${chain.rpcUrls.alchemy}/${alchemyId}` : chain.rpcUrls.default
    return [
      new InjectedConnector({
        chains: defaultChains,
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
    return new providers.AlchemyProvider(isChainSupported(chainId) ? chainId : defaultChain.id, alchemyId)
  },
  webSocketProvider({ chainId }) {
    return new providers.AlchemyWebSocketProvider(isChainSupported(chainId) ? chainId : defaultChain.id, alchemyId)
  },
  // storage: createStorage({ storage: window.localStorage }),
})

export default client
