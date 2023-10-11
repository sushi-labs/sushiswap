import '@sushiswap/ui/index.css'
import '../index.css'
import '../variables.css'

import { Cloudinary } from '@cloudinary/url-gen'
import { ThemeProvider } from '@sushiswap/ui'
import { GlobalFooter } from '@sushiswap/ui/components/global-footer'
import { GoogleAnalytics, HotJar } from '@sushiswap/ui/components/scripts'
import { Analytics } from '@vercel/analytics/react'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { useEffect } from 'react'

import { Header } from '../components'
import SEO from '../next-seo.config'

export const cld = new Cloudinary({
  cloud: {
    cloudName: 'sushi-cdn',
  },
})

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  useEffect(() => {
    const handler = (page: any) => {
      window.dataLayer.push({
        event: 'pageview',
        page,
      })
    }
    router.events.on('routeChangeComplete', handler)
    router.events.on('hashChangeComplete', handler)
    return () => {
      router.events.off('routeChangeComplete', handler)
      router.events.off('hashChangeComplete', handler)
    }
  }, [router.events])
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=1"
        />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg?v=1"
          color="#fa52a0"
        />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
      </Head>
      <ThemeProvider forcedTheme="dark">
        <DefaultSeo {...SEO} />
        <Header />
        <Component {...pageProps} />
        <GlobalFooter />
      </ThemeProvider>
      <GoogleAnalytics />
      <HotJar />
      <Analytics />
    </>
  )
}

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So article, category and home pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (ctx: AppContext) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await NextApp.getInitialProps(ctx)

  // Pass the data to our page via props
  return { ...appProps }
}

export default MyApp
