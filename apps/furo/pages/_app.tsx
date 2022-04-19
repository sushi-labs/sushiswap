import { BlockUpdater } from 'app/hooks/useBlockNumber'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { MulticallUpdater, store } from 'state/multicall'
import { App } from 'ui'
import 'ui/index.css'
import { defaultChains, InjectedConnector, WagmiProvider } from 'wagmi'
import '../index.css'

type ConnectorsConfig = { chainId?: number }
const chains = defaultChains

const connectors = ({ chainId }: ConnectorsConfig) => {
  // const rpcUrl = chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? chains.mainnet.rpcUrls[0]
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: false },
    }),
  ]
}


const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <App.Shell>
      <App.Header>
        <App.Nav />
      </App.Header>
      <WagmiProvider autoConnect connectors={connectors}>
        <ReduxProvider store={store}>
          <BlockUpdater />
          <MulticallUpdater />
          <Component {...pageProps} />
        </ReduxProvider>
      </WagmiProvider>
    </App.Shell>
  )
}

export default MyApp
