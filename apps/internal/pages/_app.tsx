import '../index.css'
import '@sushiswap/ui/index.css'

import { App, AppType, ThemeProvider } from '@sushiswap/ui'
import type { AppProps } from 'next/app'
import { FC } from 'react'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <App.Shell>
        <App.Header maxWidth="6xl" appType={AppType.Internal} withScrollBackground>
          <App.Nav />
        </App.Header>
        <Component {...pageProps} />
        <App.Footer />
      </App.Shell>
    </ThemeProvider>
  )
}

export default MyApp
