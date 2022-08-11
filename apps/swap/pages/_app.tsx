import '@sushiswap/ui/index.css'

import { App, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import { Header } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Updaters as MulticallUpdaters } from 'lib/state/MulticallUpdaters'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { FC, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store'
import { WagmiConfig } from 'wagmi'

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  useEffect(() => {
    const handler = (page) =>
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
              <Header />
              <MulticallUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
              <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
              <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
              <App.Footer />
              <ToastContainer className="mt-[50px]" />
            </App.Shell>
            <div className="z-[-1] bg-gradient-radial from-blue-500/10 via-slate-900 to-slate-900 fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
          </ThemeProvider>
        </Provider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
