import '@sushiswap/ui/index.css'

import { ChainId } from '@sushiswap/chain'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import { Provider } from 'react-redux'

import { store } from '../store'
import { Updater } from '../Updater'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Updater chainId={ChainId.ETHEREUM} />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
