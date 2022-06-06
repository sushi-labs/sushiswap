import '@sushiswap/ui/index.css'
import '../index.css'

import { App, ThemeProvider } from '@sushiswap/ui'
import type { AppProps } from 'next/app'
import { FC } from 'react'

import { Header } from '../components'

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
