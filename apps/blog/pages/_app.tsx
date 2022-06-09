import '@sushiswap/ui/index.css'
import '../index.css'

import { App, ThemeProvider } from '@sushiswap/ui'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import { createContext, useContext } from 'react'

import { Header } from '../components'
import { fetchAPI } from '../lib/api'
import { Seo } from '../types'

interface GlobalContext {
  defaultSeo: Seo
  siteName: string
}

export const GlobalContext = createContext<GlobalContext | undefined>(undefined)
export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('Hook can only be used inside Global Context')
  }

  return context
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { global } = pageProps

  return (
    <ThemeProvider>
      <GlobalContext.Provider value={global.attributes}>
        <App.Shell>
          <Header />
          <Component {...pageProps} />
          <App.Footer />
        </App.Shell>
      </GlobalContext.Provider>
    </ThemeProvider>
  )
}

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So article, category and home pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (ctx: AppContext) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await NextApp.getInitialProps(ctx)
  // Fetch global site settings from Strapi
  const globalRes = await fetchAPI('/global', {
    populate: {
      favicon: '*',
      defaultSeo: {
        populate: '*',
      },
    },
  })
  // Pass the data to our page via props
  return { ...appProps, pageProps: { global: globalRes.data } }
}

export default MyApp
