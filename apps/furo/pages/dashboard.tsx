import { useAccount, useConnect, useNetwork } from 'wagmi'
import Layout from 'components/Layout'
import { Typography, Loader, Dots, Menu, WalletIcon } from '@sushiswap/ui'
import Link from 'next/link'
import { XCircleIcon } from '@heroicons/react/outline'
import { Wallet } from '@sushiswap/wallet-connector'
import { Dashboard } from './users/[address]'

export default function DashboardPage() {
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const connect = useConnect()

  const { isConnecting, isConnected, pendingConnector } = connect
  const loading = !!pendingConnector && isConnecting

  // Return skeleton
  if (!activeChain?.id || !account?.address || !isConnected) {
    return (
      <Layout>
        <div className="flex flex-col h-full gap-12 pt-20 items-center">
          {!account?.address && (
            <div className="max-w-[410px] w-full px-10 border border-slate-800 rounded-xl py-10 text-center flex flex-col gap-6">
              <div className="flex justify-center">
                {loading ? (
                  <div className="h-[72px] flex justify-center items-center">
                    <Loader size="40px" />
                  </div>
                ) : (
                  <div className="relative rounded-full bg-white/10 p-4">
                    <WalletIcon width={40} height={40} />
                    <div className="rounded-full absolute top-0 right-0 flex items-center justify-center text-slate-1000">
                      <XCircleIcon width={24} className="bg-pink rounded-full" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Typography variant="xl" className="text-slate-200">
                  {loading ? <Dots>Authorize Your Wallet</Dots> : 'No Wallet Connected'}
                </Typography>
                <Typography variant="sm">
                  {loading
                    ? 'Furo requires access to your wallet, please authorize access to your wallet to continue'
                    : 'Get started by connecting your wallet.'}
                </Typography>
              </div>
              {!loading && (
                <Wallet.Button
                  hack={connect}
                  button={
                    <Menu.Button className="btn btn-blue btn-filled btn-default w-full" as="div">
                      Connect Wallet
                    </Menu.Button>
                  }
                />
              )}
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

  return (
    <Layout>
      <Dashboard chainId={activeChain.id} address={account.address} />
    </Layout>
  )
}
