import '@sushiswap/ui/index.css'

import { App, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import { Header } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Updaters as MulticallUpdaters } from 'lib/state/MulticallUpdaters'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { FC, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store'
import { WagmiConfig } from 'wagmi'
import SEO from '../next-seo.config.mjs'

export { reportWebVitals } from 'next-axiom'

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  useEffect(() => {
    const handler = (page) => {
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
        <link rel="apple-touch-icon" sizes="180x180" href="/xswap/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/xswap/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/xswap/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/xswap/site.webmanifest?v=1" />
        <link rel="mask-icon" href="/xswap/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/xswap/favicon.ico?v=1" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#FA52A0" />
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
        <Provider store={store}>
          <ThemeProvider>
            <App.Shell>
              <DefaultSeo {...SEO} />
              <Header />
              <MulticallUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
              <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
              <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
              <App.Footer />
              <ToastContainer className="mt-[50px]" />
            </App.Shell>
            <div className="z-[-1] bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
          </ThemeProvider>
        </Provider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
