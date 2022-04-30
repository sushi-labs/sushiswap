import { FC } from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { App } from '@sushiswap/ui'
import { defaultChains, InjectedConnector, WagmiProvider } from 'wagmi'
import { ChainId } from '@sushiswap/chain'
import { Updater as MulticallUpdater } from '../lib/state/MulticallUpdater'
import { Updater as TokenListUpdater } from '../lib/state/TokenListsUpdater'
import { useLatestBlock } from '../lib/hooks/useLatestBlock'
import { getProvider } from '../functions/getProvider'

import store from '../store'

import '@sushiswap/ui/index.css'

const chains = defaultChains

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: false },
    }),
  ]
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const provider = getProvider(ChainId.KOVAN)
  const blockNumber = useLatestBlock(provider)
  return (
    <App.Shell>
      <App.Header>
        <App.Nav />
      </App.Header>
      <WagmiProvider autoConnect connectors={connectors} provider={provider}>
        <Provider store={store}>
          <MulticallUpdater chainId={ChainId.KOVAN} blockNumber={blockNumber} />
          <TokenListUpdater chainId={ChainId.KOVAN} />
          <Component {...pageProps} />
        </Provider>
      </WagmiProvider>
    </App.Shell>
  )
}

export default MyApp
