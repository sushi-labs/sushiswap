import '@sushiswap/ui/index.css'

import { queryClient } from '@sushiswap/react-query'
import { ThemeProvider } from '@sushiswap/ui'
import { GlobalFooter } from '@sushiswap/ui/components/global-footer'
import { OnramperProvider } from '@sushiswap/ui/components/onramper'
import { GoogleAnalytics, HotJar } from '@sushiswap/ui/components/scripts'
import { config, WagmiConfig } from '@sushiswap/wagmi'
import { WagmiStoreVersionCheck } from '@sushiswap/wagmi/future'
import { QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { FC, useEffect } from 'react'

import { Header } from '../components'
import SEO from '../next-seo.config.mjs'

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
        <link rel="apple-touch-icon" sizes="180x180" href="/furo/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/furo/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/furo/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/furo/manifest.json?v=1" />
        <link rel="mask-icon" href="/furo/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/furo/favicon.ico?v=1" />
      </Head>
      <WagmiConfig config={config}>
        <QueryClientProvider client={queryClient}>
          <WagmiStoreVersionCheck>
            <ThemeProvider>
              <OnramperProvider>
                <DefaultSeo {...SEO} />
                <Header />
                <Component {...pageProps} />
                <GlobalFooter maxWidth="6xl" />
              </OnramperProvider>
            </ThemeProvider>
          </WagmiStoreVersionCheck>
        </QueryClientProvider>
      </WagmiConfig>
      <GoogleAnalytics />
      <HotJar />
      <Analytics />
    </>
  )
}

export default MyApp
