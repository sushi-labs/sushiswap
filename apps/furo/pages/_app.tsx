import type { AppProps } from 'next/app'
import { FC } from 'react'
import { App } from 'ui'
import 'ui/index.css'
import { Provider } from 'wagmi'
import '../index.css'


const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <App.Shell>
      <App.Header>
        <App.Nav />
      </App.Header>
      <Provider autoConnect>
      <Component {...pageProps} />
      </Provider>
    </App.Shell>
  )
}

export default MyApp
