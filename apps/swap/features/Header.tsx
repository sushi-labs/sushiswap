import { App, Container, SushiIcon } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wagmi'
import Link from 'next/link'

export const Header = () => {
  return (
    <Container maxWidth="5xl" className="mx-auto px-4">
      <App.Header
        className="h-[54px]"
        brand={
          <Link href="/">
            <a>
              <SushiIcon width={32} height={32} className="mr-1 hover:animate-spin hover:text-pink" />
            </a>
          </Link>
        }
      >
        <Wallet.Button />
      </App.Header>
    </Container>
  )
}
