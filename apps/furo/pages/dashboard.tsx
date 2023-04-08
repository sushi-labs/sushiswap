import { XCircleIcon } from '@heroicons/react/outline'
import { Dots, Loader, Typography, WalletIcon } from '@sushiswap/ui'
import { useWalletState } from '@sushiswap/wagmi'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useAccount, useConnect, useNetwork } from '@sushiswap/wagmi'

import { BackgroundVector, Dashboard, Layout } from '../components'
import { FuroStreamChainId } from '@sushiswap/furo'

export default function DashboardPage() {
  const router = useRouter()
  const { chain: activeChain } = useNetwork()
  const { address } = useAccount()
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
                <Typography variant="xl" className="text-slate-200">
                  No Wallet Connected
                </Typography>
                <Typography variant="sm" className="text-slate-400">
                  Get started by connecting your wallet.
                </Typography>
              </div>
              {/* TODO: Fix, this causes some kind of infinite loop when rendered... */}
              {/* <Wallet.Button
                className="transition-all hover:ring-4 ring-blue-800 btn !bg-blue btn-blue btn-filled btn-default w-full text-slate-50 px-10 !h-[44px] rounded-2xl"
                hack={connect}
              >
                Connect Wallet
              </Wallet.Button> */}
              <Link
                passHref={true}
                href="https://docs.sushi.com/how-to-get-started-on-sushi/setting-up-your-wallet"
                legacyBehavior
              >
                <Typography
                  as="a"
                  target="_blank"
                  variant="xs"
                  className="cursor-pointer text-blue hover:text-blue-300"
                >
                  How to setup a wallet?
                </Typography>
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
                <Typography variant="xl" className="text-slate-200">
                  <Dots>Authorize Your Wallet</Dots>
                </Typography>
                <Typography variant="sm" className="text-slate-400">
                  Furo requires access to your wallet, please authorize access to your wallet to continue
                </Typography>
              </div>
              <Link
                legacyBehavior
                passHref={true}
                href="https://docs.sushi.com/how-to-get-started-on-sushi/setting-up-your-wallet"
              >
                <Typography
                  as="a"
                  target="_blank"
                  variant="xs"
                  className="cursor-pointer text-blue hover:text-blue-300"
                >
                  How to setup a wallet?
                </Typography>
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
      <Layout
        backdrop={
          <div className="fixed inset-0 right-0 z-0 pointer-events-none opacity-20">
            <BackgroundVector width="100%" preserveAspectRatio="none" />
          </div>
        }
      >
        {activeChain && address && (
          <Dashboard
            chainId={activeChain.id as FuroStreamChainId}
            address={address}
            showOutgoing={router.query.show === 'outgoing'}
          />
        )}
      </Layout>
    </>
  )
}
