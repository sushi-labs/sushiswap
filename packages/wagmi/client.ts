import { otherChains } from '@sushiswap/wagmi-config'
import { allChains, Chain, chain, configureChains, createClient, CreateClientConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MockConnector } from 'wagmi/connectors/mock'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
// import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

// import { SafeConnector } from './connectors/safe'
import { getSigners } from './test/utils'

export type Client = ReturnType<typeof createClient>

const isTest = process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_PLAYWRIGHT_ENABLED === 'true'

const alchemyId = process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID
const infuraId = process.env.INFURA_ID || process.env.NEXT_PUBLIC_INFURA_ID

const { chains, provider }: CreateClientConfig & { chains: Chain[] } = isTest
  ? configureChains(
      [chain.foundry],
      [
        jsonRpcProvider({
          rpc: (chain_) => ({
            http: chain_.rpcUrls.default,
          }),
        }),
      ]
    )
  : configureChains(
      [...allChains, ...otherChains],
      [
        // jsonRpcProvider({
        //   priority: 0,
        //   rpc: (chain) => {
        //     if (chain.id !== 1) return null
        //     return {
        //       http: `https://api.securerpc.com/v1`,
        //       webSocket: `wss://api.securerpc.com/v1`,
        //     }
        //   },
        // }),
        // alchemyProvider({ apiKey: alchemyId, priority: 1 }),
        // publicProvider({ priority: 2 }),

        // jsonRpcProvider({
        //   priority: 0,
        //   rpc: (chain) => {
        //     if (chain.id !== 1) return null
        //     return {
        //       http: `https://api.securerpc.com/v1`,
        //       webSocket: `wss://api.securerpc.com/v1`,
        //     }
        //   },
        // }),

        alchemyProvider({
          apiKey: alchemyId as string,
          // priority: 1,
        }),
        publicProvider({
          // priority: 2,
        }),

        // infuraProvider({ infuraId }),
      ],
      { pollingInterval: 8_000 }
    )

export const client: Client = createClient({
  provider,
  // webSocketProvider,
  // logger: {
  //   warn: null,
  // },
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
        // @ts-ignore
        // new SafeConnector({ chains }),
        // new SafeConnector({ chains }),
      ],
})
