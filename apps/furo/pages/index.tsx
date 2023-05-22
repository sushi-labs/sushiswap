import { ChevronDownIcon, XCircleIcon } from '@heroicons/react/outline'
import { Dots, Loader, Typography, WalletIcon } from '@sushiswap/ui'
import { useWalletState } from '@sushiswap/wagmi'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useAccount, useConnect, useNetwork } from '@sushiswap/wagmi'

import { BackgroundVector, Dashboard, Layout } from '../components'
import { FuroStreamChainId } from '@sushiswap/furo'
import Container from '@sushiswap/ui/future/components/Container'
import { Popover } from '@sushiswap/ui/future/components/Popover'
import { Button } from '@sushiswap/ui/future/components/button'
import { Fragment } from 'react'
import { Transition } from '@headlessui/react'

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

  // return (
  //   <Container maxWidth="7xl" className="mx-auto px-4 pt-[80px] lg:pb-[54px]">
  //     <section className="flex flex-col gap-12 lg:flex-row justify-between lg:items-center">
  //       <div className="flex flex-col flex-grow gap-6 items-center lg:items-start">
  //         <div className="flex flex-col gap-2">
  //           <span className="text-center lg:text-left font-semibold text-5xl text-gray-800 dark:text-slate-200 leading-[1.2]">
  //             Furo Streaming
  //             <span className="font-medium text-gray-500 dark:text-slate-500">
  //               Stream and automate your DAO salaries and token vesting with Furo.
  //             </span>
  //           </span>
  //         </div>
  //         <div className="group relative z-10">
  //           <div className="flex w-full items-center">
  //             <Button
  //               as="a"
  //               variant="filled"
  //               href={isRouteProcessor3ChainId(chainId) ? `/pools/add?chainId=${chainId}` : `/pools/add/v2/${chainId}`}
  //               className="text-blue font-medium text-xl rounded-l-full"
  //               size="lg"
  //             >
  //               Create Position
  //             </Button>
  //             <Popover as={Fragment}>
  //               {({ open }) => (
  //                 <>
  //                   <Popover.Button
  //                     as="button"
  //                     className={classNames(
  //                       open ? 'bg-blue-600' : '',
  //                       'bg-blue hover:bg-blue-600 h-[44px] w-[44px] flex items-center justify-center rounded-r-full text-white'
  //                     )}
  //                   >
  //                     <ChevronDownIcon width={24} height={24} />
  //                   </Popover.Button>
  //                   <Transition
  //                     show={open}
  //                     enter="transition duration-300 ease-out"
  //                     enterFrom="transform translate-y-[-16px] scale-[0.95] opacity-0"
  //                     enterTo="transform translate-y-0 scale-[1] opacity-100"
  //                     leave="transition duration-300 ease-out"
  //                     leaveFrom="transform translate-y-0 opacity-100 scale-[1]"
  //                     leaveTo="transform translate-y-[-16px] opacity-0 scale-[0.95]"
  //                   >
  //                     <div className={classNames('right-[-140px] absolute pt-3 top-4 w-[320px]')}>
  //                       <div className="p-2 flex flex-col w-full right-0 absolute rounded-2xl shadow-md bg-white/50 paper dark:bg-slate-800/50">
  //                         <Popover.Panel>
  //                           <List.MenuItem
  //                             disabled={!isRouteProcessor3ChainId(chainId)}
  //                             as="a"
  //                             href={`/pools/add?chainId=${chainId}`}
  //                             title={
  //                               <div className="flex gap-2">
  //                                 V3 Position{' '}
  //                                 {isRouteProcessor3ChainId(chainId) ? (
  //                                   <div className="rounded-xl bg-gradient-to-r from-pink to-blue text-white text-[10px] px-2">
  //                                     New 🔥
  //                                   </div>
  //                                 ) : (
  //                                   <div className="rounded-xl bg-gray-500 dark:bg-slate-600 text-white text-[10px] px-2">
  //                                     Unavailable
  //                                   </div>
  //                                 )}
  //                               </div>
  //                             }
  //                             subtitle={'Most efficient way of providing liquidity.'}
  //                           />
  //                           <List.MenuItem
  //                             as="a"
  //                             href={`/pools/add/v2/${chainId}`}
  //                             title="V2 Position"
  //                             subtitle={'If you prefer creating a classic liquidity position.'}
  //                           />
  //                         </Popover.Panel>
  //                       </div>
  //                     </div>
  //                   </Transition>
  //                 </>
  //               )}
  //             </Popover>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="flex flex-col gap-4 items-center lg:items-end">
  //         <div className="flex flex-col gap-1 items-center lg:items-end">
  //           <span className="lg:text-sm font-semibold">Looking for a partnership with Sushi?</span>
  //           <Link.External
  //             href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe"
  //             className="font-medium text-blue hover:!text-blue-600 lg:text-sm flex gap-1 items-center"
  //           >
  //             Join Onsen <ChevronRightIcon width={16} height={16} />
  //           </Link.External>
  //         </div>
  //         <div className="flex flex-col gap-1 items-center lg:items-end">
  //           <span className="lg:text-sm font-semibold">Need Help?</span>
  //           <Link.External
  //             href="https://discord.gg/NVPXN4e"
  //             className="font-medium text-blue hover:!text-blue-600 lg:text-sm flex gap-1 items-center"
  //           >
  //             <DiscordIcon width={16} height={16} /> Join our discord
  //           </Link.External>
  //         </div>
  //       </div>
  //     </section>
  //   </Container>
  // )

  return (
    <>
      <NextSeo title="Dashboard" />
      {activeChain && address && (
        <Dashboard
          chainId={activeChain.id as FuroStreamChainId}
          address={address}
          showOutgoing={router.query.show === 'outgoing'}
        />
      )}
    </>
  )
}
