import { App, SushiIcon } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wagmi'
import NextLink from 'next/link'

export const Header = () => {
  return (
    <App.Header
      withScrollBackground
      brand={
        <NextLink href="/">
          <a className="flex flex-row items-center gap-1.5">
            <div className="w-6 h-6">
              <SushiIcon width="100%" height="100%" className="mr-2 hover:animate-heartbeat" />
            </div>
            <span className="hidden sm:block font-semibold">Swap</span>
          </a>
        </NextLink>
      }
    >
      <Wallet.Button size="sm" className="border-none shadow-md whitespace-nowrap" />
    </App.Header>
  )
}
