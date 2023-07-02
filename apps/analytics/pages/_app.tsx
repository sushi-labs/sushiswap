import '@sushiswap/ui/index.css'
import '../variables.css'

import { queryClient } from '@sushiswap/react-query'
import { GlobalFooter } from '@sushiswap/ui/components/GlobalFooter'
import { GlobalNav } from '@sushiswap/ui/components/GlobalNav'
import { GoogleAnalytics, HotJar } from '@sushiswap/ui/components/scripts'
import { ThemeProvider } from '@sushiswap/ui/ThemeProvider'
import { client, WagmiConfig } from '@sushiswap/wagmi'
import { QueryClientProvider as _QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { FC, ReactNode, useEffect } from 'react'

import SEO from '../next-seo.config.mjs'

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

export const QueryClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <_QueryClientProvider client={queryClient}>{children}</_QueryClientProvider>
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
        <link rel="apple-touch-icon" sizes="180x180" href="/analytics/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/analytics/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/analytics/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/analytics/manifest.json?v=1" />
        <link rel="mask-icon" href="/analytics/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/analytics/favicon.ico?v=1" />
      </Head>
      <WagmiConfig client={client}>
        <ThemeProvider forcedTheme="dark">
          <QueryClientProvider>
            <DefaultSeo {...SEO} />
            <GlobalNav />
            <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
            <GlobalFooter />
          </QueryClientProvider>
        </ThemeProvider>
      </WagmiConfig>
      <GoogleAnalytics />
      <HotJar />
      <Analytics />
    </>
  )
}

export default MyApp
