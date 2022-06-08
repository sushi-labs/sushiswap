import { FallbackProvider, StaticJsonRpcProvider, WebSocketProvider } from '@ethersproject/providers'
import { ChainId } from '@sushiswap/chain'
import { QueryClient } from 'react-query'
import { allChains, Client, configureChains, createClient } from 'wagmi'
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
    id: ChainId.BSC,
    name: 'Binance Smart Chain',
    network: 'bsc',
    nativeCurrency: { name: 'Binance Chain Native Token', symbol: 'BNB', decimals: 18 },
    rpcUrls: {
      default: 'https://bsc-dataseed1.binance.org',
    },
    blockExplorers: {
      etherscan: {
        name: 'Bscscan',
        url: 'https://bscscan.com',
      },
      default: {
        name: 'Bscscan',
        url: 'https://bscscan.com',
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
  {
    id: ChainId.GNOSIS,
    name: 'Gnosis Chain',
    network: 'gnosis',
    nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.gnosischain.com',
    },
    blockExplorers: {
      etherscan: {
        name: 'Gnosis Blockchain Explorer',
        url: 'https://blockscout.com/xdai/mainnet',
      },
      default: {
        name: 'Gnosis Blockchain Explorer',
        url: 'https://blockscout.com/xdai/mainnet',
      },
    },
  },
  {
    id: ChainId.HARMONY,
    name: 'Gnosis Chain',
    network: 'gnosis',
    nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
    rpcUrls: {
      default: 'https://s1.api.harmony.one',
    },
    blockExplorers: {
      etherscan: {
        name: 'Harmony Blockchain Explorer',
        url: 'https://explorer.harmony.one',
      },
      default: {
        name: 'Harmony Blockchain Explorer',
        url: 'https://explorer.harmony.one',
      },
    },
  },
  {
    id: ChainId.MOONBEAM,
    name: 'Moonbeam',
    network: 'moonbeam',
    nativeCurrency: { name: 'Glimmer', symbol: 'GLMR', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.api.moonbeam.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'Moonscan',
        url: 'https://moonbeam.moonscan.io',
      },
      default: {
        name: 'Moonscan',
        url: 'https://moonbeam.moonscan.io',
      },
    },
  },
  {
    id: ChainId.MOONRIVER,
    name: 'Moonriver',
    network: 'moonriver',
    nativeCurrency: { name: 'Moonriver', symbol: 'MOVR', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.api.moonriver.moonbeam.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'Moonscan',
        url: 'https://moonriver.moonscan.io',
      },
      default: {
        name: 'Moonscan',
        url: 'https://moonriver.moonscan.io',
      },
    },
  },
]

const { chains, provider, webSocketProvider } = configureChains(
  [...allChains, ...otherChains],
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
