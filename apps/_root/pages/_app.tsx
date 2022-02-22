import 'ui/globals.css'
import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import Background from 'app/components/Background'
import { ThemeProvider } from 'theme/ThemeContext'
import { ChainId } from 'chain'
import dynamic from 'next/dynamic'
import { useCreateStore, Provider } from '../lib/store'

const NetworkGuard = dynamic(() => import('../components/guards/NetworkGuard/NetworkGuard'), { ssr: false })

const Noop: FC = ({ children }) => <>{children}</>

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const createStore = useCreateStore(pageProps.initialZustandState)

  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <Provider createStore={createStore}>
      <ThemeProvider>
        <NetworkGuard networks={[ChainId.ETHEREUM, ChainId.FANTOM, ChainId.BSC]}>
          <Background>
            <Layout pageProps={pageProps}>
              <Component {...pageProps} />
            </Layout>
          </Background>
        </NetworkGuard>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
