import type { AppProps } from 'next/app'
import { FC } from 'react'
import { App } from 'ui'
import 'ui/index.css'
import { chain, defaultChains, InjectedConnector, Provider } from 'wagmi'
import '../index.css'

type ConnectorsConfig = { chainId?: number }
const chains = defaultChains

const connectors = ({ chainId }: ConnectorsConfig) => {
  // const rpcUrl = chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? chain.mainnet.rpcUrls[0]
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
  ]
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <App.Shell>
      <App.Header>
        <App.Nav />
      </App.Header>
      <Provider autoConnect connectors={connectors}>
        <Component {...pageProps} />
      </Provider>
    </App.Shell>
  )
}

export default MyApp
