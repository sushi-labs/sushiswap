import '@sushiswap/ui/index.css'

import { App, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import { Header } from 'components'
import { SUPPORTED_CHAINS } from 'config'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { FC, useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { WagmiConfig } from 'wagmi'

import { Updaters as MulticallUpdaters } from '../lib/state/MulticallUpdaters'
import { Updaters as TokenListUpdaters } from '../lib/state/TokenListsUpdaters'
import SEO from '../next-seo.config.mjs'
import store from '../store'

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
        <ReduxProvider store={store}>
          <ThemeProvider>
            <App.Shell>
              <DefaultSeo {...SEO} />
              <Header />
              <MulticallUpdaters chainIds={SUPPORTED_CHAINS} />
              <TokenListUpdaters chainIds={SUPPORTED_CHAINS} />
              <Component {...pageProps} />
              <App.Footer />
            </App.Shell>
            <ToastContainer className="mt-[50px]" />
          </ThemeProvider>
        </ReduxProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
