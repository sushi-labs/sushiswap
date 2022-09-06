import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { otherChains } from '@sushiswap/wagmi-config'
import { allChains, configureChains, createClient, CreateClientConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

export type Client = ReturnType<typeof createClient>

const alchemyId = process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID
const infuraId = process.env.INFURA_ID || process.env.NEXT_PUBLIC_INFURA_ID

const { chains, provider, webSocketProvider }: CreateClientConfig = configureChains(
  [...allChains, ...otherChains],
  [
    alchemyProvider({ alchemyId }),
    publicProvider(),
    // infuraProvider({ infuraId }),
  ]
)

export const client: Client = createClient({
  provider,
  webSocketProvider,
  autoConnect: false,
  connectors() {
    return [
      new InjectedConnector({
        chains,
        options: {
          shimDisconnect: true,
        },
      }),
      new WalletConnectConnector({
        chains,
        // TODO: Flesh out wallet connect options?
        options: {
          qrcode: true,
        },
      }),
      new CoinbaseWalletConnector({
        // TODO: Flesh out coinbase wallet connect options?
        chains,
        options: {
          appName: 'Sushi 2.0',
          appLogoUrl: 'https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo.svg',
        },
      }),
      new SafeConnector({ chains }),
    ]
  },
})
