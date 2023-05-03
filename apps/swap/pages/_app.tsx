import '@sushiswap/ui/index.css'

import React, { FC } from 'react'

import { Header } from '../ui/Header'
import { WagmiProvider } from '../ui/WagmiProvider'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { SwapProvider } from 'ui/trade/TradeProvider'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { SplashController } from '../ui/SplashController'
import { NetworkCheck } from '../ui/NetworkCheck'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@sushiswap/react-query'
import { TokenProvider } from '../ui/TokenProvider'
import { App, ThemeProvider } from '@sushiswap/ui'

export { reportWebVitals } from 'next-axiom'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/swap/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/swap/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/swap/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/swap/manifest.json?v=1" />
        <link rel="mask-icon" href="/swap/safari-pinned-tab.svg?v=1" color="#fa52a0" />
      </Head>
      <WagmiProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TokenProvider>
              <SplashController>
                <SwapProvider>
                  <Onramper.Provider>
                    <App.Shell>
                      <NetworkCheck />
                      <Header />
                      <Component {...pageProps} />
                    </App.Shell>
                  </Onramper.Provider>
                </SwapProvider>
              </SplashController>
            </TokenProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  )
}

export default MyApp
