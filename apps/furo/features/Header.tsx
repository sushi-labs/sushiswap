import { App, classNames, Container, SushiIcon, Typography } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wallet-connector'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

const Header: FC = () => {
  const router = useRouter()

  return (
    <div className="border-b border-slate-700">
      <Container maxWidth="5xl" className="mx-auto px-2">
        <App.Header
          className="h-[54px]"
          brand={<SushiIcon width={32} height={32} onClick={() => router.push('/')} className="cursor-pointer" />}
          nav={
            <Link passHref={true} href="/dashboard">
              <Typography
                variant="sm"
                weight={700}
                className={classNames(
                  router.pathname === '/dashboard' ? 'border-blue' : '',
                  'text-slate-50 border-b-2 hover:border-blue border-transparent cursor-pointer px-3 flex items-center h-[54px]',
                )}
                component="a"
              >
                Dashboard
              </Typography>
            </Link>
          }
        >
          <Wallet.Button />
        </App.Header>
      </Container>
    </div>
  )
}

export default Header
