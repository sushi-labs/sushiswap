import '@sushiswap/ui/index.css'

import { ThemeProvider } from '@sushiswap/ui'
import { client, WagmiConfig } from '@sushiswap/wagmi'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { FC, useEffect } from 'react'

import { Header } from '../components'
import SEO from '../next-seo.config.mjs'
import { Onramper } from '@sushiswap/wagmi/future/components/Onramper'
import { queryClient } from '@sushiswap/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { GlobalFooter } from '@sushiswap/ui/future/components/GlobalFooter'

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
      <WagmiConfig client={client}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Onramper.Provider>
              <DefaultSeo {...SEO} />
              <Header />
              <Component {...pageProps} />
              <GlobalFooter />
            </Onramper.Provider>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiConfig>
      <Analytics />
    </>
  )
}

export default MyApp
