import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { otherChains } from '@sushiswap/wagmi-config'
import { allChains, Chain, configureChains, createClient, CreateClientConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

export type Client = ReturnType<typeof createClient>

const alchemyId = process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID
const infuraId = process.env.INFURA_ID || process.env.NEXT_PUBLIC_INFURA_ID

const { chains, provider }: CreateClientConfig & { chains: Chain[] } = configureChains(
  [...allChains, ...otherChains],
  [
    alchemyProvider({ apiKey: alchemyId, priority: 1 }),
    publicProvider({ priority: 2 }),
    // infuraProvider({ infuraId }),
  ],
  { pollingInterval: 8_000 }
)

export const client: Client = createClient({
  provider,
  // webSocketProvider,
  autoConnect: false,
  connectors: [
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
    // @ts-ignore
    new SafeConnector({ chains }),
  ],
})
