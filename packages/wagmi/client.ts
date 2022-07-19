import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { ChainId } from '@sushiswap/chain'
import { allChains, configureChains, createClient, CreateClientConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
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
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 11907934,
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
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 15921452,
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
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 33001987,
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
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 21022491,
    },
  },
  {
    id: ChainId.HARMONY,
    name: 'Gnosis Chain',
    network: 'gnosis',
    nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
    rpcUrls: {
      default: 'https://api.harmony.one',
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
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 24185753,
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
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 609002,
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
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1597904,
    },
  },
]

const { chains, provider, webSocketProvider } = configureChains(
  [...allChains, ...otherChains],
  [
    publicProvider(),
    // alchemyProvider({ alchemyId }),
    // infuraProvider({ infuraId }),
  ]
)

const config: CreateClientConfig = {
  provider,
  webSocketProvider,
  connectors() {
    return [
      new SafeConnector({ chains }),
      new InjectedConnector({
        chains,
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
    ]
  },
}

export type Client = ReturnType<typeof createClient>

export const client: Client = createClient(config)
