import '../index.css'
import '@sushiswap/ui/index.css'

import { App, ThemeProvider } from '@sushiswap/ui'
import { Header } from 'components/Header'
import type { AppProps } from 'next/app'
import { FC } from 'react'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <App.Shell>
        <Header />
        <Component {...pageProps} />
        <App.Footer />
      </App.Shell>
    </ThemeProvider>
  )
}

export default MyApp
