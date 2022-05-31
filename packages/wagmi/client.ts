import { FallbackProvider, StaticJsonRpcProvider, WebSocketProvider } from '@ethersproject/providers'
import { ChainId } from '@sushiswap/chain'
import { QueryClient } from 'react-query'
import { Client, configureChains, createClient, defaultChains, defaultL2Chains } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const alchemyId = process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID
const infuraId = process.env.INFURA_ID || process.env.NEXT_PUBLIC_INFURA_ID

const otherChains = [
  {
    id: ChainId.AVALANCHE,
    name: 'Avalanche',
    network: 'avalanche',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    rpcUrls: {
      default: 'https://api.avax.network/ext/bc/C/rpc',
    },
    blockExplorers: {
      etherscan: {
        name: 'Snowtrace',
        url: 'https://snowtrace.io/',
      },
      default: {
        name: 'Snowtrace',
        url: 'https://snowtrace.io/',
      },
    },
  },
  {
    id: ChainId.FANTOM,
    name: 'Fantom',
    network: 'fantom',
    nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    rpcUrls: {
      default: 'https://rpcapi.fantom.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'Fantomscan',
        url: 'https://ftmscan.com',
      },
      default: {
        name: 'Fantomscan',
        url: 'https://ftmscan.com',
      },
    },
  },
]

const { chains, provider, webSocketProvider } = configureChains(
  [...defaultChains, ...defaultL2Chains, ...otherChains],
  [
    alchemyProvider({ alchemyId }),
    // infuraProvider({ infuraId }),
    publicProvider(),
  ]
)

export const client: Client<StaticJsonRpcProvider | FallbackProvider, WebSocketProvider> & {
  queryClient: QueryClient
} = createClient({
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
