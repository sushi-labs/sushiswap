import * as React from 'react'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'

import { Provider } from 'wagmi'
import { client } from '@sushiswap/wallet-connector'
import '@sushiswap/ui/index.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider client={client}>
      <NextHead>
        <title>wagmi</title>
      </NextHead>
      <Component {...pageProps} />
    </Provider>
  )
}

export default App
