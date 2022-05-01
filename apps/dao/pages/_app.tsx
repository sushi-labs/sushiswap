import { FC } from 'react'
import type { AppProps } from 'next/app'

import { App } from '@sushiswap/ui'

import '@sushiswap/ui/index.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <App.Shell>
      <App.Header />
      <Component {...pageProps} />
      <App.Footer />
    </App.Shell>
  )
}

export default MyApp
