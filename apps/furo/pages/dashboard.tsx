import { Menu as HeadlessMenu } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import { Dots, Loader, Typography, WalletIcon } from '@sushiswap/ui'
import { useWalletState } from '@sushiswap/wagmi'
import { Wallet } from '@sushiswap/wallet-connector'
import { BackgroundVector } from 'components'
import Layout from 'components/Layout'
import { Overlay } from 'components/Overlay'
import { Dashboard } from 'features'
import Link from 'next/link'
import { useAccount, useConnect, useNetwork } from 'wagmi'

export default function DashboardPage() {
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const connect = useConnect()
  const { connecting, notConnected, pendingConnection, reconnecting } = useWalletState(connect, account?.address)

  if (connecting || reconnecting) {
    return <Overlay />
  }

  if (notConnected) {
    return (
      <Layout>
        <div className="flex flex-col h-full gap-12 pt-20 items-center">
          <div className="max-w-[410px] w-full px-10 border border-slate-800 rounded-xl py-10 text-center flex flex-col gap-6">
            <div className="flex justify-center">
              <div className="relative rounded-full bg-slate-800 p-5">
                <WalletIcon width={38} height={38} className="text-slate-300" />
                <div className="rounded-full absolute top-0 right-0 flex items-center justify-center text-slate-900">
                  <XCircleIcon width={24} className="text-slate-400 bg-slate-800 rounded-full" />
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
            <Wallet.Button
              hack={connect}
              button={
                <HeadlessMenu.Button
                  as="div"
                  className="transition-all hover:ring-4 ring-blue-800 btn !bg-blue btn-blue btn-filled btn-default w-full text-slate-50 px-10 !h-[44px] rounded-2xl"
                >
                  Connect Wallet
                </HeadlessMenu.Button>
              }
            />
            <Link passHref={true} href="https://docs.sushi.com/how-to-get-started-on-sushi/setting-up-your-wallet">
              <Typography as="a" target="_blank" variant="xs" className="text-blue hover:text-blue-300 cursor-pointer">
                How to setup a wallet?
              </Typography>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  if (pendingConnection) {
    return (
      <Layout>
        <div className="flex flex-col h-full gap-12 pt-20 items-center">
          <div className="max-w-[410px] w-full px-10 border border-slate-800 rounded-xl py-10 text-center flex flex-col gap-6">
            <div className="h-[78px] flex justify-center items-center">
              <Loader size="40px" />
            </div>
            <div className="flex flex-col gap-3">
              <Typography variant="xl" className="text-slate-200">
                <Dots>Authorize Your Wallet</Dots>
              </Typography>
              <Typography variant="sm" className="text-slate-400">
                Furo requires access to your wallet, please authorize access to your wallet to continue
              </Typography>
            </div>
            <Link passHref={true} href="https://docs.sushi.com/how-to-get-started-on-sushi/setting-up-your-wallet">
              <Typography as="a" target="_blank" variant="xs" className="text-blue hover:text-blue-300 cursor-pointer">
                How to setup a wallet?
              </Typography>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      backdrop={
        <div className="fixed inset-0 z-0 pointer-events-none right-0 opacity-20">
          <BackgroundVector width="100%" preserveAspectRatio="none" />
        </div>
      }
    >
      <Dashboard chainId={activeChain.id} address={account.address} />
    </Layout>
  )
}
