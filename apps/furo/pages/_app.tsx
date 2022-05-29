import '@sushiswap/ui/index.css'
import '../index.css'
import 'react-toastify/dist/ReactToastify.css'

import { ChainId } from '@sushiswap/chain'
import { useLatestBlockNumber } from '@sushiswap/hooks'
import { App } from '@sushiswap/ui'
import { client, getProvider } from '@sushiswap/wagmi'
import Header from 'features/Header'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { FC, useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { WagmiConfig } from 'wagmi'

import { Updater as MulticallUpdater } from '../lib/state/MulticallUpdater'
import { Updater as TokenListUpdater } from '../lib/state/TokenListsUpdater'
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

  const ethereumProvider = getProvider(ChainId.ETHEREUM)
  const ethereumBlockNumber = useLatestBlockNumber(ethereumProvider)

  const goerliProvider = getProvider(ChainId.GÖRLI)
  const goerliBlockNumber = useLatestBlockNumber(goerliProvider)

  return (
    <>
      <WagmiConfig client={client}>
        <ReduxProvider store={store}>
          <App.Shell>
            <Header />
            <MulticallUpdater chainId={ChainId.ETHEREUM} blockNumber={ethereumBlockNumber} />
            <TokenListUpdater chainId={ChainId.ETHEREUM} />
            <MulticallUpdater chainId={ChainId.GÖRLI} blockNumber={goerliBlockNumber} />
            <TokenListUpdater chainId={ChainId.GÖRLI} />
            <Component {...pageProps} />
            <ToastContainer toastClassName={() => 'bg-slate-800 rounded-xl shadow-md p-3 mt-2'} />
            <App.Footer />
          </App.Shell>
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
