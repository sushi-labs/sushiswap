import '@sushiswap/ui/index.css'

import { App, AppType, ToastContainer } from '@sushiswap/ui'
import { client, Wallet } from '@sushiswap/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import { WagmiConfig } from 'wagmi'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <App.Shell>
        <App.Header appType={AppType.Pool} withScrollBackground>
          <Wallet.Button size="sm" className="border-none shadow-md whitespace-nowrap" />
        </App.Header>
        <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
        <App.Footer />
        <ToastContainer className="mt-[50px]" />
      </App.Shell>
      <div className="z-[-1] bg-gradient-radial from-blue-500/10 via-slate-900 to-slate-900 fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
    </WagmiConfig>
  )
}

export default MyApp
