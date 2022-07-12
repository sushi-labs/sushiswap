import '@sushiswap/ui/index.css'
import '../index.css'

import { Cloudinary } from '@cloudinary/url-gen'
import { App, ThemeProvider } from '@sushiswap/ui'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'

import { Header } from '../components'
import { getGlobalPage } from '../lib/api'

export const cld = new Cloudinary({
  cloud: {
    cloudName: 'sushi-cdn',
  },
})

const MyApp = ({ Component, pageProps }: AppProps) => {
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

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So article, category and home pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (ctx: AppContext) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await NextApp.getInitialProps(ctx)
  // Fetch global site settings from Strapi
  const globalRes = await getGlobalPage()
  // Pass the data to our page via props
  return { ...appProps, pageProps: { global: globalRes.global?.data } }
}

export default MyApp
