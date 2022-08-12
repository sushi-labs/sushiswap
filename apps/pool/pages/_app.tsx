import '@sushiswap/ui/index.css'

import { App, AppType, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client, Wallet } from '@sushiswap/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
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
            <App.Header
              appType={AppType.Pool}
              withScrollBackground
              nav={
                <App.NavItemList>
                  <App.NavItem href="/swap" label="Swap" />
                  <App.NavItem href="/pool" label="Liquidity" />
                </App.NavItemList>
              }
            >
              <Wallet.Button size="sm" className="border-none shadow-md whitespace-nowrap" />
            </App.Header>
            <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
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
