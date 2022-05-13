import { useAccount, useConnect, useNetwork } from 'wagmi'
import Layout from 'components/Layout'
import { Typography, Loader, Dots, WalletIcon } from '@sushiswap/ui'
import Link from 'next/link'
import { XCircleIcon } from '@heroicons/react/outline'
import { Wallet } from '@sushiswap/wallet-connector'
import { Dashboard } from './users/[address]'
import { Menu as HeadlessMenu } from '@headlessui/react'
import { useIsMounted } from '@sushiswap/hooks'

export default function DashboardPage() {
  const isMounted = useIsMounted()
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const connect = useConnect()

  const { isConnecting, isConnected, pendingConnector, isReconnecting } = connect

  if (isMounted && !!pendingConnector && isConnecting) {
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
              <Typography
                component="a"
                target="_blank"
                variant="xs"
                className="text-blue hover:text-blue-300 cursor-pointer"
              >
                How to setup a wallet?
              </Typography>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  if (isConnected || isReconnecting || isConnecting) {
    if (!account?.address) return <></>
  }

  // Return skeleton
  if (isMounted && (!activeChain?.id || !account?.address || !isConnected)) {
    return (
      <Layout>
        <div className="flex flex-col h-full gap-12 pt-20 items-center">
          {!account?.address && (
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
                    className="transition-all hover:ring-4 ring-blue-800 btn !bg-blue btn-blue btn-filled btn-default w-full text-base text-slate-50 px-10 !h-[44px] rounded-2xl"
                  >
                    Connect Wallet
                  </HeadlessMenu.Button>
                }
              />
              <Link passHref={true} href="https://docs.sushi.com/how-to-get-started-on-sushi/setting-up-your-wallet">
                <Typography
                  component="a"
                  target="_blank"
                  variant="xs"
                  className="text-blue hover:text-blue-300 cursor-pointer"
                >
                  How to setup a wallet?
                </Typography>
              </Link>
            </div>
          )}
        </div>
      </Layout>
    )
  }

  if (isMounted) {
    return (
      <Layout>
        <Dashboard chainId={activeChain.id} address={account.address} />
      </Layout>
    )
  }

  return null
}
