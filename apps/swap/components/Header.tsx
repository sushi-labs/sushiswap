import { App, Container, SushiIcon } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wagmi'
import NextLink from 'next/link'

export const Header = () => {
  return (
    <Container maxWidth="5xl" className="px-4 mx-auto">
      <App.Header
        className="h-[54px] grid grid-cols-3"
        brand={
          <NextLink href="/">
            <a className="flex flex-row items-center gap-1">
              <SushiIcon width={32} height={32} className="mr-1 hover:animate-spin hover:text-pink" />
              <span className="font-black">Swap</span>
            </a>
          </NextLink>
        }
      >
        <Wallet.Button className="!h-[36px]" />
        {/* <button className="hover:animate-spin-slow" onClick={() => {}}>
          <CogIcon width={32} height={32} />
        </button> */}
      </App.Header>
    </Container>
  )
}
