import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { ChainId } from '@sushiswap/chain'
import { allChains, configureChains, createClient, CreateClientConfig } from 'wagmi'
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
  {
    id: ChainId.KAVA,
    name: 'Kava',
    network: 'kava',
    nativeCurrency: { name: 'Kava', symbol: 'KAVA', decimals: 18 },
    rpcUrls: {
      default: 'https://evm.kava.io',
    },
    blockExplorers: {
      etherscan: {
        name: 'Kavascan',
        url: 'https://explorer.kava.io/',
      },
      default: {
        name: 'Kavascan',
        url: 'https://explorer.kava.io/',
      },
    },
    multicall: {
      address: '0x1578f6d2D3168acF41b506AA666A521994F6BAB6',
      blockCreated: 1176602,
    },
  },
  {
    id: ChainId.METIS,
    name: 'Metis',
    network: 'metis',
    nativeCurrency: { name: 'Metis', symbol: 'METIS', decimals: 18 },
    rpcUrls: {
      default: 'https://andromeda.metis.io/?owner=1088',
    },
    blockExplorers: {
      etherscan: {
        name: 'Andromeda',
        url: 'https://andromeda-explorer.metis.io/',
      },
      default: {
        name: 'Andromeda',
        url: 'https://andromeda-explorer.metis.io/',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 2338552,
    },
  },
  {
    id: ChainId.CELO,
    name: 'Celo',
    network: 'celo',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.ankr.com/celo',
    },
    blockExplorers: {
      etherscan: {
        name: 'Celoscan',
        url: 'https://celoscan.io/',
      },
      default: {
        name: 'Celoscan',
        url: 'https://celoscan.io/',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 13112599,
    },
  },
  {
    id: ChainId.FUSE,
    name: 'Fuse',
    network: 'fuse',
    nativeCurrency: { name: 'Fuse', symbol: 'FUSE', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.fuse.io',
    },
    blockExplorers: {
      etherscan: {
        name: 'Fusescan',
        url: 'https://explorer.fuse.io/',
      },
      default: {
        name: 'Fuse Explorer',
        url: 'https://explorer.fuse.io/',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 16146628,
    },
  },
]

const { chains, provider, webSocketProvider } = configureChains(
  [...allChains, ...otherChains],
  [
    alchemyProvider({ alchemyId }),
    publicProvider(),
    // infuraProvider({ infuraId }),
  ]
)

const config: CreateClientConfig = {
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
}

export type Client = ReturnType<typeof createClient>

export const client: Client = createClient(config)
