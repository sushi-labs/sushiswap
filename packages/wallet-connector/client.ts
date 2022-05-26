import { configureChains, createClient, defaultChains, defaultL2Chains } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

const alchemyId = process.env.ALCHEMY_ID
const infuraId = process.env.INFURA_ID

const { chains, provider, webSocketProvider } = configureChains(
  [...defaultChains, ...defaultL2Chains],
  [alchemyProvider({ alchemyId }), infuraProvider({ infuraId }), publicProvider()]
)

export default createClient({
  autoConnect: true,
  connectors({ chainId }) {
    return [
      new InjectedConnector({
        chains,
      }),
      new WalletConnectConnector({
        chains,
        // TODO: Flesh out wallet connect options?
        options: {
          // Bridge?
          chainId,
          qrcode: true,
        },
      }),
      new CoinbaseWalletConnector({
        // TODO: Flesh out coinbase wallet connect options?
        chains,
        options: {
          appName: 'Sushi 2.0',
          appLogoUrl: 'https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo.svg',
          chainId,
        },
      }),
    ]
  },
  provider,
  webSocketProvider,
})
