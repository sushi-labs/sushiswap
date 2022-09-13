import '@sushiswap/ui/index.css'

import { App, AppType, ToastContainer } from '@sushiswap/ui'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router.js'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { FC, useEffect } from 'react'

import SEO from '../next-seo.config.mjs'

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  useEffect(() => {
    const handler = (page) =>
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
      <App.Shell>
        <DefaultSeo {...SEO} />
        <App.Header maxWidth="6xl" appType={AppType.Analytics} withScrollBackground>
          <App.Nav />
        </App.Header>
        <Component {...pageProps} />
        <App.Footer />
        <ToastContainer className="mt-[50px]" />
      </App.Shell>
    </>
  )
}

export default MyApp
