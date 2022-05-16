import { App, classNames, Container, SushiIcon } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wallet-connector'
import { useRouter } from 'next/router'
import { FC } from 'react'

const Header: FC = () => {
  const router = useRouter()

  return (
    <div className={classNames(router.pathname === '/' ? '' : 'border-b border-slate-800', 'relative z-10')}>
      <Container maxWidth="5xl" className="mx-auto px-2">
        <App.Header
          className="h-[54px] z-10"
          brand={<SushiIcon width={32} height={32} onClick={() => router.push('/')} className="cursor-pointer" />}
          nav={<></>}
        >
          <Wallet.Button />
        </App.Header>
      </Container>
    </div>
  )
}

export default Header
