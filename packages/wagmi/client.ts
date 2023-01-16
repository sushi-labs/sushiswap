import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { Chain, configureChains, createClient, CreateClientConfig } from 'wagmi'
import { foundry } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MockConnector } from 'wagmi/connectors/mock'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { SafeConnector } from './connectors/safe'
import { getSigners } from './test/utils'

export type Client = ReturnType<typeof createClient>

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

export const client: Client = createClient({
  provider,
  logger: {
    warn: null,
  },
  autoConnect: false,
  connectors: isTest
    ? [new MockConnector({ options: { signer: getSigners()[0] } })]
    : [
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
            appLogoUrl: 'https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/sushi.jpg',
          },
        }),
        new SafeConnector({ chains }),
      ],
})
