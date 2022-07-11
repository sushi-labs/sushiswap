import '../index.css'
import '@sushiswap/ui/index.css'

import { App, Link, SushiIcon } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import { WagmiConfig } from 'wagmi'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <App.Shell>
        <App.Header
          className="grid grid-cols-3 p-8"
          brand={
            <Link.Internal href="/">
              <a className="flex flex-row items-center gap-1">
                <SushiIcon width={32} height={32} className="mr-1 hover:animate-spin hover:text-pink" />
                <span className="font-black">KASHI</span>
              </a>
            </Link.Internal>
          }
          // nav={
          //   <nav>
          //     <ul className="flex gap-12">
          //       <li>
          //         <Link.Internal href="/">Markets</Link.Internal>
          //       </li>
          //       <li>
          //         <Link.Internal href="/create">Create</Link.Internal>
          //       </li>
          //     </ul>
          //   </nav>
          // }
        ></App.Header>
        <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
      </App.Shell>
    </WagmiConfig>
  )
}

export default MyApp
