import { FC } from 'react'
import type { AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux'
import { App } from '@sushiswap/ui'
import { ChainId } from '@sushiswap/chain'
import { Updater as MulticallUpdater } from '../lib/state/MulticallUpdater'
import { Updater as TokenListUpdater } from '../lib/state/TokenListsUpdater'
import { useLatestBlock } from '../lib/hooks/useLatestBlock'
import { getProvider } from '../functions/getProvider'
import { client } from '@sushiswap/wallet-connector'
import { WagmiProvider } from 'wagmi'
import store from '../store'

import '@sushiswap/ui/index.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const provider = getProvider(ChainId.KOVAN)
  const blockNumber = useLatestBlock(provider)
  return (
    <WagmiProvider client={client}>
      <ReduxProvider store={store}>
        <App.Shell>
          <MulticallUpdater chainId={ChainId.KOVAN} blockNumber={blockNumber} />
          <TokenListUpdater chainId={ChainId.KOVAN} />
          <MulticallUpdater chainId={ChainId.GÖRLI} blockNumber={blockNumber} />
          <TokenListUpdater chainId={ChainId.GÖRLI} />
          <Component {...pageProps} />
          <App.Footer />
        </App.Shell>
      </ReduxProvider>
    </WagmiProvider>
  )
}

export default MyApp
