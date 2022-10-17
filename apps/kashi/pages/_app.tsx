import '@sushiswap/ui/index.css'

import { App, AppType, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client, Wallet } from '@sushiswap/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { FC } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store'
import { WagmiConfig } from 'wagmi'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
      </Head>
      <WagmiConfig client={client}>
        <Provider store={store}>
          <ThemeProvider>
            <App.Shell>
              <App.Header
                appType={AppType.Kashi}
                withScrollBackground
                nav={
                  <App.NavItemList>
                    <App.NavItem href="/lend" label="Lend" />
                    <App.NavItem href="/borrow" label="Borrow" />
                  </App.NavItemList>
                }
              >
                <Wallet.Button
                  size="sm"
                  className="border-none shadow-md whitespace-nowrap"
                  supportedNetworks={SUPPORTED_CHAIN_IDS}
                />
              </App.Header>
              <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
              <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
              <App.Footer />
              <ToastContainer className="mt-[50px]" />
            </App.Shell>
          </ThemeProvider>
        </Provider>
      </WagmiConfig>{' '}
    </>
  )
}

export default MyApp
