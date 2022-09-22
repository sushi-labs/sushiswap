import '@sushiswap/ui/index.css'

import { App, AppType, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { FC } from 'react'
import { WagmiConfig } from 'wagmi'

import SEO from '../next-seo.config.mjs'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
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
  )
}

export default MyApp
