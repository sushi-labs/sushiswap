import '@sushiswap/ui/index.css'

import { App, AppType } from '@sushiswap/ui'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { FC } from 'react'

import SEO from '../next-seo.config.mjs'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <App.Shell>
      <DefaultSeo {...SEO} />
      <App.Header maxWidth="6xl" appType={AppType.Analytics} withScrollBackground>
        <App.Nav />
      </App.Header>
      <Component {...pageProps} />
    </App.Shell>
  )
}

export default MyApp
