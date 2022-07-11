import { App, SushiIcon } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wagmi'
import NextLink from 'next/link'

export const Header = () => {
  return (
    <App.Header
      withScrollBackground
      brand={
        <NextLink href="/">
          <a className="flex flex-row items-center gap-1">
            <SushiIcon width={32} height={32} className="mr-1 hover:animate-spin hover:text-pink" />
            <span className="font-black">Swap</span>
          </a>
        </NextLink>
      }
    >
      <Wallet.Button className="border-none shadow-md !h-[36px]" />
    </App.Header>
  )
}
