import '@sushiswap/ui/index.css'

import { App, ThemeProvider } from '@sushiswap/ui'
import { Analytics } from '@vercel/analytics/react'
import React, { FC, useEffect } from 'react'

import { Header } from '../ui/Header'
import { WagmiProvider } from '../ui/WagmiProvider'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { SwapProvider } from '../ui/trade/TradeProvider'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { SplashController } from '../ui/SplashController'
import { NetworkCheck } from '../ui/NetworkCheck'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@sushiswap/react-query'
import { TokenProvider } from '../ui/TokenProvider'
import Script from 'next/script'
import { useRouter } from 'next/router'

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  useEffect(() => {
    const handler = (page: any) => {
      window.dataLayer.push({
        event: 'pageview',
        page,
      })
    }
    router.events.on('routeChangeComplete', handler)
    router.events.on('hashChangeComplete', handler)
    return () => {
      router.events.off('routeChangeComplete', handler)
      router.events.off('hashChangeComplete', handler)
    }
  }, [router.events])
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/swap/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/swap/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/swap/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/swap/manifest.json?v=1" />
        <link rel="mask-icon" href="/swap/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/swap/favicon.ico?v=1" />
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
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-JW8KWJ48EF`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JW8KWJ48EF', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />
      <Analytics />
    </>
  )
}

export { reportWebVitals } from 'next-axiom'

export default MyApp
