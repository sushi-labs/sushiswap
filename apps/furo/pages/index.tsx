import { Wallet } from '@sushiswap/wallet-connector'
import { useIsMounted } from '@sushiswap/hooks'
import { useAccount, useConnect } from 'wagmi'
import Layout from 'components/Layout'
import { Typography } from '@sushiswap/ui'
import { Menu } from '@headlessui/react'
import { useRouter } from 'next/router'
import ViewAddressModal from 'features/ViewAddressModal'
import Button from '@sushiswap/ui/button/Button'
import Account from '../../../packages/wallet-connector/components/Account'
import Link from 'next/link'

export default function Index() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const connect = useConnect({
    onConnect: () => {
      void router.push('/dashboard')
    },
  })

  const { isConnected, isReconnecting, isConnecting } = connect
  if (isConnected || isReconnecting || isConnecting) {
    if (!account?.address) return <></>
  }

  return (
    <Layout>
      <div className="flex flex-col h-full gap-8 pt-40">
        <div className="flex flex-col gap-1">
          <Typography variant="hero" className="text-slate-100 font-stretch" weight={900}>
            Welcome to <span className="text-blue">Furo</span>
          </Typography>
          <Typography variant="h3" className="text-slate-500">
            Decentralized asset streaming on steroids.
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {account?.address ? (
            <>
              <div className="z-10 flex items-center border-[3px] border-slate-900 bg-slate-800 rounded-2xl">
                <div className="px-6">
                  <Account.Name address={account.address} className="text-base" />
                </div>
                <Link passHref={true} href="/dashboard">
                  <Button className="w-full transition-all hover:ring-4 ring-blue-800 btn btn-blue btn-filled btn-default text-base text-slate-50 px-10 !h-[56px] rounded-2xl">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
              <ViewAddressModal />
            </>
          ) : (
            <>
              <Wallet.Button
                hack={connect}
                button={
                  <Menu.Button
                    className="transition-all hover:ring-4 ring-blue-800 btn btn-blue btn-filled btn-default w-full text-base text-slate-50 px-10 !h-[56px] rounded-2xl"
                    as="div"
                  >
                    Connect Wallet
                  </Menu.Button>
                }
              />
              <ViewAddressModal />
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
