import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { configureChains, createConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { SafeConnector } from 'wagmi/connectors/safe'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { createTestConfig } from './_test/setup'

const isTest = process.env.APP_ENV === 'test' || process.env.TEST === 'true' || process.env.NEXT_PUBLIC_TEST === 'true'
const anvilPort = process.env.ANVIL_PORT || process.env.NEXT_PUBLIC_ANVIL_PORT || 8545
const testWalletIndex = Number(process.env.TEST_WALLET_INDEX || process.env.NEXT_PUBLIC_TEST_WALLET_INDEX || 0)
const anvilRpcUrl =
  process.env.ANVIL_RPC_URL || process.env.NEXT_PUBLIC_ANVIL_RPC_URL || `http://127.0.0.1:${anvilPort}`

export const createWagmiConfig = () => {
  const { chains, publicClient } = isTest
    ? configureChains(
        allChains,
        [
          jsonRpcProvider({
            rpc: () => ({
              http: anvilRpcUrl,
            }),
          }),
        ],
        {
          pollingInterval: 1_000,
        }
      )
    : configureChains(allChains, allProviders, {
        pollingInterval: 4_000,
      })

  if (isTest) {
    return createTestConfig(137, testWalletIndex)
  }

  return createConfig({
    publicClient,
    // logger: {
    //   warn: process.env.NODE_ENV !== 'production' ? console.warn : null,
    // },
    // logger: {
    //   warn: null,
    // },
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
      new WalletConnectConnector({
        chains,
        options: {
          showQrModal: true,
          projectId: '187b0394dbf3b20ce7762592560eafd2',
          metadata: {
            name: 'Sushi',
            description: 'Community home of DeFi',
            url: 'https://www.sushi.com',
            icons: ['https://www.sushi.com/icon.png'],
          },
        },
      }),
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

export const config = createWagmiConfig()
