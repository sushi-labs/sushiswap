import '../index.css'
import '@sushiswap/ui/index.css'

import { App, AppType } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import { WagmiConfig } from 'wagmi'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <App.Shell>
        <App.Header appType={AppType.Kashi} className="grid grid-cols-3 p-8" />
        <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
      </App.Shell>
    </WagmiConfig>
  )
}

export default MyApp
