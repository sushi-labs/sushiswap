import '@sushiswap/ui/index.css'
import '../variables.css'

import { App, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import { Analytics } from '@vercel/analytics/react'
import { Header } from '../components'
import { SUPPORTED_CHAIN_IDS } from '../config'
import { Updaters as TokenListsUpdaters } from '../lib/state/TokenListsUpdaters'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { FC, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'
import { WagmiConfig } from 'wagmi'

import SEO from '../next-seo.config.mjs'
import { Onramper } from '@sushiswap/wagmi/future/components/Onramper'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@sushiswap/react-query'

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
        <link rel="apple-touch-icon" sizes="180x180" href="/earn/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/earn/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/earn/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/earn/manifest.json?v=1" />
        <link rel="mask-icon" href="/earn/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/earn/favicon.ico?v=1" />
      </Head>

      <WagmiConfig client={client}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <Onramper.Provider>
                <App.Shell>
                  <DefaultSeo {...SEO} />
                  <Header />
                  <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
                  <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
                  <ToastContainer className="mt-[50px]" />
                </App.Shell>
              </Onramper.Provider>
            </ThemeProvider>
          </QueryClientProvider>
        </Provider>
      </WagmiConfig>
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

export default MyApp
