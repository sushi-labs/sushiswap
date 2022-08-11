import '@sushiswap/ui/index.css'

import { App, AppType } from '@sushiswap/ui'
import type { AppProps } from 'next/app'
import { FC } from 'react'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <App.Shell>
      <App.Header appType={AppType.Analytics}>
        <App.Nav />
      </App.Header>
      <Component {...pageProps} />
    </App.Shell>
  )
}

export default MyApp
