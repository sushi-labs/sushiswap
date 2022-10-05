import '../index.css'
import '@sushiswap/ui/index.css'

import { App, AppType } from '@sushiswap/ui'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { FC } from 'react'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <App.Shell>
        <App.Header
          className="grid grid-cols-3 p-8"
          appType={AppType.Internal}
          // brand={
          //   <Link href="/">
          //     <a className="flex flex-row items-center gap-1">
          //       <SushiIcon width={32} height={32} className="mr-1 hover:animate-spin hover:text-pink" />
          //       <span className="font-black">INTERNAL</span>
          //     </a>
          //   </Link>
          // }
        ></App.Header>
      </App.Shell>
    </>
  )
}

export default MyApp
