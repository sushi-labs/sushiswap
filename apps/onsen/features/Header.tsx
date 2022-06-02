import { useIsMounted } from '@sushiswap/hooks'
import { App, classNames, Container, SushiIcon } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wagmi'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useAccount, useConnect } from 'wagmi'

const Header: FC = () => {
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const { isConnected } = useConnect()
  const router = useRouter()

  return (
    <div
      className={classNames(router.pathname === '/' ? '' : 'border-b border-slate-800 bg-slate-900', 'relative z-10')}
    >
      <Container maxWidth="5xl" className="px-4 mx-auto">
        <App.Header
          className="h-[54px] z-10"
          brand={<SushiIcon width={32} height={32} onClick={() => router.push('/')} className="cursor-pointer" />}
          nav={<></>}
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Wallet.Button className="!h-[36px]" />
          </div>
        </App.Header>
      </Container>
    </div>
  )
}

export default Header
