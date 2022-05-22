import { AddressZero } from '@ethersproject/constants'
import { Menu } from '@headlessui/react'
import { ChainId, USDC } from '@sushiswap/core-sdk'
import { Amount } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { useIsMounted } from '@sushiswap/hooks'
import { Typography } from '@sushiswap/ui'
import Button from '@sushiswap/ui/button/Button'
import { Account, Wallet } from '@sushiswap/wallet-connector'
import { BackgroundVector } from 'components'
import Layout from 'components/Layout'
import { FuroStatus, FuroType, Stream } from 'features'
import BalanceChart from 'features/stream/BalanceChart'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'

import { BalanceChartHoverEnum } from './stream/[id]'

const now = new Date().getTime()
const exampleStream = new Stream({
  stream: {
    id: '0',
    __typename: FuroType.STREAM,
    status: FuroStatus.ACTIVE,
    totalAmount: '119994000000',
    withdrawnAmount: '69308282750',
    recipient: { id: AddressZero },
    createdBy: { id: AddressZero },
    expiresAt: (new Date(now + 60 * 60 * 24 * 3).getTime() / 1000).toString(),
    startedAt: (new Date(now - 60 * 60 * 24 * 7).getTime() / 1000).toString(),
    modifiedAtTimestamp: (new Date(now - 60 * 60 * 24 * 3).getTime() / 1000).toString(),
    token: {
      name: 'USDC',
      decimals: '6',
      symbol: 'USDC',
      id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
    txHash: '',
  },
})

export default function Index() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const [hover, setHover] = useState<BalanceChartHoverEnum>(BalanceChartHoverEnum.NONE)

  const paySomeone = useConnect({
    onConnect: () => {
      void router.push('/stream/create')
    },
  })

  const viewEarnings = useConnect({
    onConnect: () => {
      void router.push('/dashboard')
    },
  })

  return (
    <Layout
      className="my-40"
      backdrop={
        <div className="fixed inset-0 z-0 pointer-events-none right-0 opacity-20">
          <BackgroundVector width="100%" preserveAspectRatio="none" />
        </div>
      }
    >
      <div className="flex flex-col sm:grid sm:grid-cols-[580px_420px] rounded">
        <div className="flex flex-col h-full justify-center gap-8">
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
            {isMounted && account?.address ? (
              <>
                <div>
                  <Link passHref={true} href="/stream/create">
                    <Button className="transition-all hover:ring-4 btn btn-blue btn-filled btn-default w-full text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl">
                      Pay Someone
                    </Button>
                  </Link>
                </div>
                <div className="z-10 flex items-center bg-slate-800 rounded-2xl">
                  <Link passHref={true} href="/dashboard">
                    <Button className="transition-all hover:ring-4 ring-gray-700 btn btn-gray btn-filled btn-default w-full text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl">
                      View My Earnings
                    </Button>
                  </Link>
                  <div className="px-6">
                    <Account.Name address={account?.address}>
                      {({ name, isEns }) => (
                        <Typography
                          variant="sm"
                          weight={700}
                          className="text-slate-50 tracking-wide text-sm sm:text-base"
                        >
                          {isEns ? name : !!name ? shortenAddress(name) : ''}
                        </Typography>
                      )}
                    </Account.Name>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Wallet.Button
                  hack={paySomeone}
                  button={
                    <Menu.Button
                      className="transition-all hover:ring-4 ring-blue-800 btn btn-blue btn-filled btn-default text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl"
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
                      className="transition-all hover:ring-4 ring-gray-700 btn btn-gray btn-filled btn-default text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl"
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
        <div className="scale-[0.9] hidden lg:block flex justify-center">
          <BalanceChart
            stream={exampleStream}
            hover={hover}
            setHover={setHover}
            balance={Amount.fromRawAmount(USDC[ChainId.ETHEREUM], '14687517250')}
          />
        </div>
      </div>
    </Layout>
  )
}
