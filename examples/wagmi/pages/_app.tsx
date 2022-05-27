import '@sushiswap/ui/index.css'

import { client } from '@sushiswap/wagmi'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import { FC } from 'react'
import { WagmiConfig } from 'wagmi'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <NextHead>
        <title>wagmi</title>
      </NextHead>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}

export default MyApp
