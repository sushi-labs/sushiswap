import { FC } from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { ChainId } from '@sushiswap/chain'
import { store } from '../store'
import { Updater } from '../Updater'
import '@sushiswap/ui/index.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Updater chainId={ChainId.ETHEREUM} />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
