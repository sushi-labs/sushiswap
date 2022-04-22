import { BlockUpdater } from 'app/hooks/useBlockNumber'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { MulticallUpdater, store } from 'state/multicall'
import ListsUpdater from 'app/state/lists/updater'
import { App } from 'ui'
import 'ui/index.css'
import { defaultChains, InjectedConnector, WagmiProvider } from 'wagmi'
import '../index.css'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from 'app/state'
import { providers } from 'ethers'

type ConnectorsConfig = { chainId?: number }
const chains = defaultChains

const provider = ({ chainId }) =>
  new providers.InfuraProvider(chainId, process.env.INFURA_URL)

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
      <WagmiProvider autoConnect connectors={connectors} provider={provider}>
        <PersistGate persistor={persistor}>
          <ReduxProvider store={store}>
            <ListsUpdater />
            {/* <BlockUpdater /> */}
            <MulticallUpdater />
            <Component {...pageProps} />
          </ReduxProvider>
        </PersistGate>
      </WagmiProvider>
    </App.Shell>
  )
}

export default MyApp
