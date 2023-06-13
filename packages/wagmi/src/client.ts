import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { Chain, configureChains, createClient, CreateClientConfig, mainnet } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { SafeConnector } from 'wagmi/connectors/safe'
import { _createTestClient } from '../test/setup'

const isTest = process.env['NODE_ENV'] === 'test' || process.env['NEXT_PUBLIC_TEST'] === 'true'

const { chains, provider }: CreateClientConfig & { chains: Chain[] } = configureChains(allChains, allProviders, {
  pollingInterval: 8_000,
})

// console.log({ isTest, NODE_ENV: process.env.NODE_ENV })

export const _createClient = (config?: CreateClientConfig) => {
  return isTest
    ? _createTestClient()
    : createClient({
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
          new LedgerConnector({
            chains,
            options: {
              enableDebugLogs: process.env.NODE_ENV !== 'production',
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
          //       name: 'Sushi',
          //       description: 'Community home of DeFi',
          //       url: 'https://www.sushi.com',
          //       icons: ['https://www.sushi.com/icon.png'],
          //     },
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
              allowedDomains: [
                /gnosis-safe.io$/,
                /app.safe.global$/,
                /safe.fuse.io$/,
                /multisig.moonbeam.network$/,
                /safe.fantom.network$/,
                /ui.celo-safe.io$/,
                /multisig.harmony.one$/,
              ],
              debug: false,
            },
          }),
        ],
      })
}

export const client: ReturnType<typeof _createClient> = _createClient()
