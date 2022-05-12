import { FC } from 'react'
import { App, Container, SushiIcon, Typography } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wallet-connector'
import { useAccount, useNetwork } from 'wagmi'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header: FC = () => {
  const router = useRouter()
  const { data } = useAccount()
  const { activeChain } = useNetwork()

  return (
    <div className="border-b border-slate-800">
      <Container maxWidth="5xl" className="mx-auto px-2">
        <App.Header
          className="h-[54px]"
          brand={<SushiIcon width={32} height={32} onClick={() => router.push('/')} className="cursor-pointer" />}
          nav={
            <div className="flex gap-2 items-center">
              {data?.address && activeChain && (
                <Link passHref={true} href={`/users/${data.address.toLowerCase()}?chainId=${activeChain.id}`}>
                  <Typography
                    variant="sm"
                    weight={700}
                    className="text-slate-50 border-b-2 hover:border-blue border-transparent cursor-pointer px-3 flex items-center h-[54px]"
                    component="a"
                  >
                    Dashboard
                  </Typography>
                </Link>
              )}
            </div>
          }
        >
          <Wallet.Button />
        </App.Header>
      </Container>
    </div>
  )
}

export default Header
