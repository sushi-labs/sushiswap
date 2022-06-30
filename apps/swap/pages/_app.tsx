import '@sushiswap/ui/index.css'

import { App, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import { Header } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store'
import { WagmiConfig } from 'wagmi'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <Provider store={store}>
        <ThemeProvider>
          <App.Shell>
            <Header />
            {/* <MulticallUpdaters chainIds={SUPPORTED_CHAIN_IDS} /> */}
            {/* <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} /> */}
            <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
            <App.Footer />
            <ToastContainer className="mt-[50px]" />
          </App.Shell>
        </ThemeProvider>
      </Provider>
    </WagmiConfig>
  )
}

export default MyApp
