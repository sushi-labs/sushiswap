import { AddressZero } from '@ethersproject/constants'
import { Chain, ChainId } from '@sushiswap/chain'
import { Amount, USDC } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { useIsMounted } from '@sushiswap/hooks'
import { Button, Typography } from '@sushiswap/ui'
import { Account, Wallet } from '@sushiswap/wagmi'
import { BackgroundVector, Layout } from 'components'
import { BalanceChart } from 'components/stream'
import { FuroStatus, FuroType, Stream } from 'lib'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAccount, useConnect, useNetwork } from 'wagmi'

import { BalanceChartHoverEnum } from './stream/[id]'

const now = new Date().getTime()

const exampleStream = new Stream({
  chainId: ChainId.ETHEREUM,
  furo: {
    id: '0',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    __typename: FuroType.STREAM,
    status: FuroStatus.ACTIVE,
    totalAmount: '119994000000',
    withdrawnAmount: '69308282750',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    recipient: { id: AddressZero },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createdBy: { id: AddressZero },
    expiresAt: (new Date(now + 60 * 60 * 24 * 3).getTime() / 1000).toString(),
    startedAt: (new Date(now - 60 * 60 * 24 * 7).getTime() / 1000).toString(),
    modifiedAtTimestamp: (new Date(now - 60 * 60 * 24 * 3).getTime() / 1000).toString(),
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

exampleStream._balance = Amount.fromRawAmount(USDC[ChainId.ETHEREUM], '14687517250')

export default function Index() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
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
        <div className="fixed inset-0 right-0 z-0 pointer-events-none opacity-20">
          <BackgroundVector width="100%" preserveAspectRatio="none" />
        </div>
      }
    >
      <div className="flex flex-col sm:grid sm:grid-cols-[580px_420px] rounded">
        <div className="flex flex-col justify-center h-full gap-8">
          <div className="flex flex-col gap-3">
            <div className="text-center font-bold sm:text-left text-4xl sm:text-5xl text-slate-100 font-stretch leading-[1.125] tracking-[-0.06rem]">
              Welcome to <br />
              <span className="text-blue">Furo</span> Streaming
            </div>
            <div className="text-lg text-center sm:text-left sm:text-xl text-slate-400 md:w-1/2">
              Earn, stream and automate your DAO salaries and token vesting with Furo.
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:items-center sm:flex-row">
            {!isMounted || !activeChain || !account ? (
              <>
                <Wallet.Button
                  color="blue"
                  className="transition-all hover:ring-4 focus:ring-4 text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl"
                  hack={paySomeone}
                >
                  Pay Someone
                </Wallet.Button>
                <Wallet.Button
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
                    <Account.Name address={account.address}>
                      {({ name, isEns }) => (
                        <Typography
                          as="a"
                          target="_blank"
                          href={Chain.from(activeChain.id).getAccountUrl(account?.address ?? '')}
                          variant="sm"
                          weight={700}
                          className="text-sm tracking-wide hover:text-blue-400 text-slate-50 sm:text-base"
                        >
                          {isEns ? name : name ? shortenAddress(name) : ''}
                        </Typography>
                      )}
                    </Account.Name>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="scale-[0.9] lg:block flex justify-center">
          <BalanceChart stream={exampleStream} hover={hover} setHover={setHover} />
        </div>
      </div>
    </Layout>
  )
}
