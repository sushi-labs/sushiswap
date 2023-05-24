import { XCircleIcon } from '@heroicons/react/outline'
import { Dots, Loader, WalletIcon } from '@sushiswap/ui'
import { useConnect, useWalletState } from '@sushiswap/wagmi'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import { Dashboard, Layout } from '../components'

export default function DashboardPage() {
  const connect = useConnect()
  const { connecting, notConnected } = useWalletState(!!connect.pendingConnector)

  if (notConnected) {
    return (
      <>
        <NextSeo title="Dashboard" />
        <Layout>
          <div className="flex flex-col items-center h-full gap-12 pt-20">
            <div className="max-w-[410px] w-full px-10 border border-slate-800 rounded-xl py-10 text-center flex flex-col gap-6">
              <div className="flex justify-center">
                <div className="relative p-5 rounded-full bg-slate-800">
                  <WalletIcon width={38} height={38} className="text-slate-300" />
                  <div className="absolute top-0 right-0 flex items-center justify-center rounded-full text-slate-900">
                    <XCircleIcon width={24} className="rounded-full text-slate-400 bg-slate-800" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xl text-slate-200">No Wallet Connected</span>
                <span className="text-sm text-slate-400">Get started by connecting your wallet.</span>
              </div>
              <Link
                passHref={true}
                href="https://docs.sushi.com/how-to-get-started-on-sushi/setting-up-your-wallet"
                legacyBehavior
              >
                <a target="_blank" className="text-xs cursor-pointer text-blue hover:text-blue-300">
                  How to setup a wallet?
                </a>
              </Link>
            </div>
          </div>
        </Layout>
      </>
    )
  }

  if (connecting) {
    return (
      <>
        <NextSeo title="Dashboard" />
        <Layout>
          <div className="flex flex-col items-center h-full gap-12 pt-20">
            <div className="max-w-[410px] w-full px-10 border border-slate-800 rounded-xl py-10 text-center flex flex-col gap-6">
              <div className="h-[78px] flex justify-center items-center">
                <Loader size={40} />
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xl text-slate-200">
                  <Dots>Authorize Your Wallet</Dots>
                </span>
                <span className="text-sm text-slate-400">
                  Furo requires access to your wallet, please authorize access to your wallet to continue
                </span>
              </div>
              <Link
                legacyBehavior
                passHref={true}
                href="https://docs.sushi.com/how-to-get-started-on-sushi/setting-up-your-wallet"
              >
                <a target="_blank" className="text-xs cursor-pointer text-blue hover:text-blue-300">
                  How to setup a wallet?
                </a>
              </Link>
            </div>
          </div>
        </Layout>
      </>
    )
  }

  return (
    <>
      <NextSeo title="Dashboard" />
      <Dashboard />
    </>
  )
}
