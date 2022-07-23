import '@sushiswap/ui/index.css'

import { App, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import { Header } from 'components'
import { SUPPORTED_CHAINS } from 'config'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { FC, useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { WagmiConfig } from 'wagmi'

import { Updaters as MulticallUpdaters } from '../lib/state/MulticallUpdaters'
import { Updaters as TokenListUpdaters } from '../lib/state/TokenListsUpdaters'
import store from '../store'

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
      <WagmiConfig client={client}>
        <ReduxProvider store={store}>
          <ThemeProvider>
            <App.Shell>
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
      <Script
        id="gtag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', 'UA-191094689-1');
            `,
        }}
      />
    </>
  )
}

export default MyApp
