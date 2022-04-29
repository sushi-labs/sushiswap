import { FC } from 'react'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'

import { Provider } from 'wagmi'
import { client } from '@sushiswap/wallet-connector'
import '@sushiswap/ui/index.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider client={client}>
      <NextHead>
        <title>wagmi</title>
      </NextHead>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
