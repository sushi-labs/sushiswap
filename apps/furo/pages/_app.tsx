import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux'
import { App } from '@sushiswap/ui'
import { ChainId } from '@sushiswap/chain'
import { Updater as MulticallUpdater } from '../lib/state/MulticallUpdater'
import { Updater as TokenListUpdater } from '../lib/state/TokenListsUpdater'
import { useLatestBlock } from '../lib/hooks/useLatestBlock'
import { getProvider } from 'functions'
import { client } from '@sushiswap/wallet-connector'
import { WagmiProvider } from 'wagmi'
import store from '../store'

import '@sushiswap/ui/index.css'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import Script from 'next/script'
import Header from 'features/Header'
import { ToastContainer } from 'react-toastify'

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

  const kovanProvider = getProvider(ChainId.KOVAN)
  const kovanBlockNumber = useLatestBlock(kovanProvider)
  const goerliProvider = getProvider(ChainId.GÖRLI)
  const goerliBlockNumber = useLatestBlock(goerliProvider)

  return (
    <>
      <WagmiProvider client={client}>
        <ReduxProvider store={store}>
          <App.Shell>
            <Header />
            <MulticallUpdater chainId={ChainId.KOVAN} blockNumber={kovanBlockNumber} />
            <TokenListUpdater chainId={ChainId.KOVAN} />
            <MulticallUpdater chainId={ChainId.GÖRLI} blockNumber={goerliBlockNumber} />
            <TokenListUpdater chainId={ChainId.GÖRLI} />
            <Component {...pageProps} />
            <ToastContainer toastClassName={() => 'bg-slate-800 rounded-xl shadow-md p-3 mt-2'} />
            <App.Footer />
          </App.Shell>
        </ReduxProvider>
      </WagmiProvider>
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
