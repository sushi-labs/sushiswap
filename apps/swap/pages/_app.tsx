import '@sushiswap/ui/index.css'

import React, { FC } from 'react'

import { Header } from '../ui/Header'
import { WagmiProvider } from '../ui/WagmiProvider'
import { PersistQueryClientProvider } from '../ui/PersistQueryClientProvider'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ToastContainer } from '@sushiswap/ui/future/components/toast'
import { SwapProvider } from 'ui/trade/TradeProvider'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { SplashController } from '../ui/SplashController'
import { NetworkCheck } from '../ui/NetworkCheck'

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
        <PersistQueryClientProvider>
          {/* <QueryClientProvider> */}
          <SwapProvider>
            <SplashController>
              <Onramper.Provider>
                <NetworkCheck />
                <Header />
                <Component {...pageProps} />
              </Onramper.Provider>
            </SplashController>
          </SwapProvider>
          <ToastContainer />
        </PersistQueryClientProvider>
        {/* </QueryClientProvider> */}
      </WagmiProvider>
    </>
  )
}

export default MyApp
