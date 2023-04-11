import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { Chain, configureChains, createClient, CreateClientConfig } from 'wagmi'
import { foundry } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MockConnector } from 'wagmi/connectors/mock'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
// import { SafeConnector } from './connectors/safe'
import { getSigners } from './test/utils'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { SafeConnector } from 'wagmi/connectors/safe'

const isTest = process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_PLAYWRIGHT_ENABLED === 'true'

const { chains, provider }: CreateClientConfig & { chains: Chain[] } = isTest
  ? configureChains(
      [foundry],
      [
        jsonRpcProvider({
          rpc: (chain_) => ({
            http: chain_.rpcUrls.default.http[0],
          }),
        }),
      ]
    )
  : configureChains(allChains, allProviders, { pollingInterval: 8_000 })

export const _createClient = (config?: CreateClientConfig) => {
  return createClient({
    provider,
    // logger: {
    //   warn: process.env.NODE_ENV !== 'production' ? console.warn : null,
    // },
    logger: {
      warn: null,
    },
    autoConnect: true,
    connectors: [
      new InjectedConnector({
        chains,
        options: {
          shimDisconnect: true,
        },
      }),
      new MetaMaskConnector({
        chains,
        options: {
          shimDisconnect: true,
          // shimChainChangedDisconnect: false,
        },
      }),
      // TODO: Migrate to the WalletConnect v2 Connector before June 28
      // and flesh out wallet connect options.
      new WalletConnectLegacyConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
      // new WalletConnectConnector({
      //   chains,
      //   options: {
      //     projectId: '187b0394dbf3b20ce7762592560eafd2',
      //     metadata: {
      //       name: 'sushi',
      //       description: 'sushi app',
      //       url: 'https://sushi.com',
      //       icons: ['https://sushi.com/icon.png'],
      //     },
      //   },
      // }),

      // new WalletConnectLegacyConnector({
      //   chains,
      //   // TODO: Flesh out wallet connect options?
      //   options: {
      //     qrcode: true,
      //   },
      // }),
      new CoinbaseWalletConnector({
        // TODO: Flesh out coinbase wallet connect options?
        chains,
        options: {
          appName: 'Sushi 2.0',
          appLogoUrl: 'https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/sushi.jpg',
        },
      }),
      new SafeConnector({
        chains,
        options: {
          // TODO: Other self-hosted safes for some networks?
          allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
          debug: false,
        },
      }),
    ],
  })
}

export const client: ReturnType<typeof _createClient> = _createClient()
