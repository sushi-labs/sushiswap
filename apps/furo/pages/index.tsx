import { AddressZero } from '@ethersproject/constants'
import { Chain, ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { useIsMounted } from '@sushiswap/hooks'
import { Button, Typography } from '@sushiswap/ui'
import { Account, Wallet } from '@sushiswap/wagmi'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAccount, useConnect, useNetwork } from '@sushiswap/wagmi'

import { BackgroundVector, Layout } from '../components'
import { BalanceChart } from '../components/stream'
import { SUPPORTED_CHAINS, SupportedChainId } from '../config'
import { FuroStatus, FuroType, Stream } from '../lib'
import { ChartHover } from '../types'

const now = new Date().getTime()

const exampleStream = new Stream({
  chainId: ChainId.ETHEREUM,
  furo: {
    id: '0',
    __typename: FuroType.STREAM,
    status: FuroStatus.ACTIVE,
    remainingShares: '50000000000',
    initialShares: '119940000000',
    initialAmount: '117994000000',
    initialSharesExtended: '0',
    extendedShares: '0',
    withdrawnAmount: '69308282750',
    withdrawnAmountAfterExtension: '0',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    recipient: { id: AddressZero },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createdBy: { id: AddressZero },
    expiresAt: Math.floor(new Date(now + 60 * 60 * 24 * 3).getTime() / 1000).toString(),
    startedAt: Math.floor(new Date(now - 60 * 60 * 24 * 7).getTime() / 1000).toString(),
    modifiedAtTimestamp: Math.floor(new Date(now - 60 * 60 * 24 * 3).getTime() / 1000).toString(),
    extendedAtTimestamp: Math.floor(new Date().getTime() / 1000).toString(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    token: {
      name: 'USDC',
      decimals: '6',
      symbol: 'USDC',
      id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
    txHash: '',
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  rebase: {
    base: '1',
    elastic: '1',
  },
})

export default function Index() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const [hover, setHover] = useState<ChartHover>(ChartHover.NONE)

  const paySomeone = useConnect({
    onSuccess: ({ chain }) => {
      if (SUPPORTED_CHAINS.includes(chain.id as SupportedChainId)) {
        void router.push('/stream/create')
      }
    },
  })

  const viewEarnings = useConnect({
    onSuccess: ({ chain }) => {
      if (SUPPORTED_CHAINS.includes(chain.id as SupportedChainId)) {
        void router.push('/dashboard')
      }
    },
  })

  return (
    <Layout
      className="my-40"
      backdrop={
        <div className="fixed inset-0 right-0 z-0 pointer-events-none opacity-20">
          <BackgroundVector width="100%" preserveAspectRatio="none" />
        </div>
      }
    >
      <div className="flex flex-col sm:grid sm:grid-cols-[580px_420px] rounded">
        <div className="flex flex-col justify-center h-[420px] gap-8">
          <div className="flex flex-col gap-3">
            <div className="text-center font-medium sm:text-left text-4xl sm:text-5xl text-slate-100 font-stretch leading-[1.125] tracking-[-0.06rem]">
              Welcome to <br />
              <span className="text-blue">Furo</span> Streaming
            </div>
            <div className="text-lg text-center sm:text-left sm:text-xl text-slate-400 md:w-1/2">
              Automate your DAO salaries and vesting schedules while earning interest from yield strategies.
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:items-center sm:flex-row">
            {!isMounted || !activeChain || !address ? (
              <>
                <Wallet.Button
                  appearOnMount={false}
                  color="blue"
                  className="transition-all hover:ring-4 focus:ring-4 text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl"
                  hack={paySomeone}
                >
                  Pay Someone
                </Wallet.Button>
                <Wallet.Button
                  appearOnMount={false}
                  color="gray"
                  className="transition-all hover:ring-4 focus:ring-4 text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl"
                  hack={viewEarnings}
                >
                  View My Earnings
                </Wallet.Button>
              </>
            ) : (
              <>
                <div>
                  <Link passHref={true} href="/stream/create" legacyBehavior>
                    <Button
                      color="blue"
                      variant="filled"
                      fullWidth
                      className="transition-all hover:ring-4 text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl"
                    >
                      Pay Someone
                    </Button>
                  </Link>
                </div>
                <div className="z-10 flex items-center bg-slate-800 rounded-2xl">
                  <Link passHref={true} href="/dashboard" legacyBehavior>
                    <Button
                      fullWidth
                      color="gray"
                      variant="filled"
                      className="transition-all hover:ring-4 ring-gray-700 text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl"
                    >
                      View My Earnings
                    </Button>
                  </Link>
                  <div className="px-6">
                    <Account.AddressToEnsResolver address={address}>
                      {({ data }) => (
                        <Typography
                          as="a"
                          target="_blank"
                          href={Chain.from(activeChain.id)?.getAccountUrl(address ?? '')}
                          variant="sm"
                          weight={500}
                          className="text-sm tracking-wide hover:text-blue-400 text-slate-50 sm:text-base"
                        >
                          {data ? data : address ? shortenAddress(address) : ''}
                        </Typography>
                      )}
                    </Account.AddressToEnsResolver>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="scale-[0.9] lg:block flex justify-center">
          {isMounted && <BalanceChart stream={exampleStream} hover={hover} setHover={setHover} />}
        </div>
      </div>
    </Layout>
  )
}
