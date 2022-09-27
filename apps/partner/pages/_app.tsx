import '@sushiswap/ui/index.css'

import { App, AppType, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import type { AppProps } from 'next/app'
import { Head } from 'next/head'
import { DefaultSeo } from 'next-seo'
import { FC } from 'react'
import { WagmiConfig } from 'wagmi'

import SEO from '../next-seo.config.mjs'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <WagmiConfig client={client}>
        <ThemeProvider>
          <App.Shell>
            <DefaultSeo {...SEO} />
            <App.Header appType={AppType.Partner} withScrollBackground />
            <Component {...pageProps} />
            <App.Footer />
            <ToastContainer className="mt-[50px]" />
          </App.Shell>
          <div className="z-[-1] bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
        </ThemeProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
