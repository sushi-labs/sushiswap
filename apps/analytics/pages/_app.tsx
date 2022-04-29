import { FC } from 'react'
import type { AppProps } from 'next/app'
import { App } from '@sushiswap/ui'

import '@sushiswap/ui/index.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <App.Shell>
      <App.Header>
        <App.Nav />
      </App.Header>
      <Component {...pageProps} />
    </App.Shell>
  )
}

export default MyApp
