import '@sushiswap/ui/index.css'
import '../index.css'

import { Cloudinary } from '@cloudinary/url-gen'
import { App, ThemeProvider } from '@sushiswap/ui'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect } from 'react'

import { DefaultSeo, Header } from '../components'
import { getGlobalSEO } from '../lib/api'
import { Global } from '.mesh'

export { reportWebVitals } from 'next-axiom'

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

const MyApp = ({ Component, seo, pageProps }: AppProps & { seo: Global }) => {
  const router = useRouter()
  useEffect(() => {
    const handler = (page) => {
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
      </Head>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-JW8KWJ48EF`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JW8KWJ48EF', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <ThemeProvider>
        <App.Shell>
          <DefaultSeo seo={seo} />
          <Header />
          <Component {...pageProps} seo={seo} />
          <App.Footer />
        </App.Shell>
      </ThemeProvider>
    </>
  )
}

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So article, category and home pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (ctx: AppContext) => {
  const [appProps, globalSEO] = await Promise.all([
    // Calls page's `getInitialProps` and fills `appProps.pageProps`
    NextApp.getInitialProps(ctx),
    // Fetch global site settings from Strapi
    getGlobalSEO(),
  ])
  // Pass the data to our page via props
  return { ...appProps, seo: globalSEO.global?.data.attributes }
}

export default MyApp
