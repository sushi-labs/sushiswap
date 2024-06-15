import '@sushiswap/ui/index.css'
import '../index.css'
import '../variables.css'

import { Cloudinary } from '@cloudinary/url-gen'
import {
  GlobalFooter,
  GoogleAnalytics,
  HotJar,
  ThemeProvider,
} from '@sushiswap/ui'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { DefaultSeo, Header } from '../common/components'
import { getGlobalSEO } from '../lib/api'
import { Global } from '.mesh'

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
    const handler = (page: any) =>
      window.dataLayer.push({
        event: 'pageview',
        page,
      })
    router.events.on('routeChangeComplete', handler)
    return () => {
      router.events.off('routeChangeComplete', handler)
    }
  }, [router.events])

  return (
    <>
      <ThemeProvider forcedTheme="dark">
        <DefaultSeo seo={seo} />
        <div className="dark">
          <Header />
          <Component {...pageProps} seo={seo} />
          <GlobalFooter maxWidth={null} />
        </div>
      </ThemeProvider>
      <GoogleAnalytics />
      <HotJar />
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
  // Fetch global site settings from Strapi
  const globalSEO = await getGlobalSEO()
  // Pass the data to our page via props
  return { ...appProps, seo: globalSEO.global?.data?.attributes }
}

export default MyApp
