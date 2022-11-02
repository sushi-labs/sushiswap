import '@sushiswap/ui/index.css'

import { App, AppType, ThemeProvider } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { FC, useEffect } from 'react'
import { WagmiConfig } from 'wagmi'

import SEO from '../next-seo.config.mjs'

export { reportWebVitals } from 'next-axiom'

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
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
        <link rel="apple-touch-icon" sizes="180x180" href="/widget/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/widget/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/widget/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/widget/manifest.json?v=1" />
        <link rel="mask-icon" href="/widget/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/widget/favicon.ico?v=1" />
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
      <WagmiConfig client={client}>
        <ThemeProvider>
          <App.Shell>
            <DefaultSeo {...SEO} />
            <App.Header appType={AppType.Widget} />
            <Component {...pageProps} />
            <App.Footer />
          </App.Shell>
          <div className="z-[-1] bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
        </ThemeProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
