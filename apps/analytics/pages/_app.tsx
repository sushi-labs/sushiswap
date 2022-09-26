import '@sushiswap/ui/index.css'

import { App, AppType, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router.js'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { FC, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store'
import { WagmiConfig } from 'wagmi'

import SEO from '../next-seo.config.mjs'

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()

  useEffect(() => {
    const handler = (page: any) =>
      window.dataLayer.push({
        event: 'pageview',
        page,
      })
    router.events.on('routeChangeComplete', handler)
    return () => {
      router.events.off('routeChangeComplete', handler)
    }
  }, [router.events])
  return (
    <>
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
              <App.Header appType={AppType.Analytics} maxWidth="6xl">
                {/*<Wallet.Button*/}
                {/*  size="sm"*/}
                {/*  className="border-none shadow-md whitespace-nowrap"*/}
                {/*  supportedNetworks={SUPPORTED_CHAIN_IDS}*/}
                {/*/>*/}
              </App.Header>
              <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
              <App.Footer />
              <ToastContainer className="mt-[50px]" />
            </App.Shell>
          </ThemeProvider>
        </Provider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
