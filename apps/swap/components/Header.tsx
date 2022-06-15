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
              <SushiIcon width={32} height={32} className="mr-1 hover:animate-spin hover:text-pink" /> Swap{' '}
              <span className="font-black">PRO</span>
            </a>
          </NextLink>
        }
        // nav={
        //   <nav>
        //     <ul className="flex gap-12">
        //       <li>
        //         <Link.Internal href="/swap">Trade</Link.Internal>
        //       </li>
        //       <li>
        //         <Link.Internal href="/pool" disabled>
        //           Pool
        //         </Link.Internal>
        //       </li>
        //     </ul>
        //   </nav>
        // }
      >
        <Wallet.Button className="!h-[36px]" />
        {/* <button className="hover:animate-spin-slow" onClick={() => {}}>
          <CogIcon width={32} height={32} />
        </button> */}
      </App.Header>
    </Container>
  )
}
