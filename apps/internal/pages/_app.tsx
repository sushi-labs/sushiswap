import '../index.css'
import '@sushiswap/ui/index.css'

import { App, AppType } from '@sushiswap/ui'
import type { AppProps } from 'next/app'
import { FC } from 'react'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
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
  )
}

export default MyApp
