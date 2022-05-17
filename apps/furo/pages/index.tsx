import { Menu } from '@headlessui/react'
import { useIsMounted } from '@sushiswap/hooks'
import Button from '@sushiswap/ui/button/Button'
import { Account, Wallet } from '@sushiswap/wallet-connector'
import { BackgroundVector } from 'components'
import Layout from 'components/Layout'
import ViewAddressModal from 'features/ViewAddressModal'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount, useConnect } from 'wagmi'

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
  if (isMounted && (isConnected || isReconnecting || isConnecting)) {
    if (!account?.address) return <></>
  }

  if (isMounted)
    return (
      <Layout
        gradient
        backdrop={
          <div className="fixed inset-0 z-0 pointer-events-none right-0 opacity-20">
            <BackgroundVector width="100%" preserveAspectRatio="none" />
          </div>
        }
      >
        <div className="flex flex-col h-full gap-8 pt-40">
          <div className="flex flex-col gap-3">
            <div className="text-center font-bold sm:text-left text-4xl sm:text-5xl text-slate-100 font-stretch leading-[1.125]">
              Welcome to <br />
              <span className="text-blue">Furo</span> Streaming
            </div>
            <div className="text-center sm:text-left text-md sm:text-xl text-slate-400 md:w-1/2">
              Earn, stream and automate your DAO salaries and token vesting with Furo.
            </div>
          </div>
          <div className="flex flex-col sm:items-center sm:flex-row gap-4">
            {account?.address ? (
              <>
                <div className="z-10 flex items-center border-[3px] border-slate-900 bg-slate-800 rounded-2xl">
                  <div className="px-6">
                    <Account.Name address={account.address} className="text-sm sm:text-base" />
                  </div>
                  <Link passHref={true} href="/dashboard">
                    <Button className="w-full transition-all hover:ring-4 ring-blue-800 btn btn-blue btn-filled btn-default text-sm sm:text-base text-slate-50 px-10 !h-[44px] sm:!h-[56px] rounded-2xl">
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
                      className="transition-all hover:ring-4 ring-blue-800 btn btn-blue btn-filled btn-default w-full text-sm sm:text-base text-slate-50 px-10 h-[44px] sm:!h-[56px] rounded-2xl"
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

  return null
}
