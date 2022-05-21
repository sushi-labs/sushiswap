import { Menu } from '@headlessui/react'
import { useIsMounted } from '@sushiswap/hooks'
import Button from '@sushiswap/ui/button/Button'
import { Account, Wallet } from '@sushiswap/wallet-connector'
import { BackgroundVector } from 'components'
import Layout from 'components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'

export default function Index() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const [paySomeoneOpen, setPaySomeoneOpen] = useState(false)

  const paySomeone = useConnect({
    onConnect: () => {
      setPaySomeoneOpen(true)
    },
  })

  const viewEarnings = useConnect({
    onConnect: () => {
      void router.push('/dashboard')
    },
  })

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
            <div className="text-center font-bold sm:text-left text-4xl sm:text-5xl text-slate-100 font-stretch leading-[1.125] tracking-[-0.06rem]">
              Welcome to <br />
              <span className="text-blue">Furo</span> Streaming
            </div>
            <div className="text-center sm:text-left text-lg sm:text-xl text-slate-400 md:w-1/2">
              Earn, stream and automate your DAO salaries and token vesting with Furo.
            </div>
          </div>
          <div className="flex flex-col sm:items-center sm:flex-row gap-4">
            {account?.address ? (
              <>
                <div>
                  <Link passHref={true} href="/stream/create">
                    <Button className="transition-all hover:ring-4 btn btn-blue btn-filled btn-default w-full text-sm sm:text-base text-slate-50 px-10 h-[52px] sm:!h-[56px] rounded-2xl">
                      Pay Someone
                    </Button>
                  </Link>
                </div>
                <div className="z-10 flex items-center bg-slate-800 rounded-2xl">
                  <Link passHref={true} href="/dashboard">
                    <Button className="transition-all hover:ring-4 ring-gray-700 btn btn-gray btn-filled btn-default w-full text-sm sm:text-base text-slate-50 px-10 h-[52px] sm:!h-[56px] rounded-2xl">
                      View My Earnings
                    </Button>
                  </Link>
                  <div className="px-6">
                    <Account.Name address={account?.address} className="text-sm sm:text-base" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Wallet.Button
                  hack={paySomeone}
                  button={
                    <Menu.Button
                      className="transition-all hover:ring-4 ring-blue-800 btn btn-blue btn-filled btn-default text-sm sm:text-base text-slate-50 px-10 h-[52px] sm:!h-[56px] rounded-2xl"
                      as="div"
                    >
                      Pay Someone
                    </Menu.Button>
                  }
                />
                <Wallet.Button
                  hack={viewEarnings}
                  button={
                    <Menu.Button
                      className="transition-all hover:ring-4 ring-gray-700 btn btn-gray btn-filled btn-default text-sm sm:text-base text-slate-50 px-10 h-[52px] sm:!h-[56px] rounded-2xl"
                      as="div"
                    >
                      View My Earnings
                    </Menu.Button>
                  }
                />
              </>
            )}
          </div>
        </div>
      </Layout>
    )

  return null
}
