import { FC } from 'react'
import { App, Container, SushiIcon, Typography } from '@sushiswap/ui'
import { Account } from '../../../packages/wallet-connector'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import { LogoutIcon, LoginIcon } from '@heroicons/react/outline'
import Link from 'next/link'

const Header: FC = () => {
  const { data } = useAccount()
  const { disconnect } = useDisconnect()
  const { activeChain } = useNetwork()

  return (
    <div className="border-b border-dark-900">
      <Container maxWidth="5xl" className="mx-auto px-2">
        <App.Header
          brand={<SushiIcon width={32} height={32} />}
          nav={
            <div className="flex gap-2 items-center">
              <Link passHref={true} href={`/users/${data?.address?.toLowerCase()}?chainId=${activeChain?.id}`}>
                <Typography
                  variant="sm"
                  weight={700}
                  className="text-white border-b-2 hover:border-blue border-transparent cursor-pointer px-3 flex items-center h-[54px]"
                  component="a"
                >
                  Dashboard
                </Typography>
              </Link>
            </div>
          }
        >
          <div className="py-2">
            <Typography
              variant="sm"
              weight={700}
              className="flex items-center gap-2 text-high-emphesis border border-dark-800 cursor-pointer pl-4 bg-dark-900 rounded-full"
            >
              {data ? <Account.Name address={data?.address} /> : 'Connect'}
              {data ? (
                <div
                  className="p-2 rounded-full bg-dark-1000 flex items-center justify-center border border-dark-800 hover:border-dark-700"
                  onClick={() => disconnect()}
                >
                  <LogoutIcon width={20} height={20} />
                </div>
              ) : (
                <div
                  className="p-2 rounded-full bg-dark-1000 flex items-center justify-center border border-dark-800 hover:border-dark-700"
                  onClick={() => disconnect()}
                >
                  <LoginIcon width={20} height={20} />
                </div>
              )}
            </Typography>
          </div>
        </App.Header>
      </Container>
    </div>
  )
}

export default Header
