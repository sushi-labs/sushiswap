import '@sushiswap/ui/index.css'

import { App, AppType, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import { WagmiConfig } from 'wagmi'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <ThemeProvider>
        <App.Shell>
          <App.Header appType={AppType.Partner} withScrollBackground />
          <Component {...pageProps} />
          <App.Footer />
          <ToastContainer className="mt-[50px]" />
        </App.Shell>
        <div className="z-[-1] bg-gradient-radial from-blue-500/10 via-slate-900 to-slate-900 fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
      </ThemeProvider>
    </WagmiConfig>
  )
}

export default MyApp
