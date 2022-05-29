import { AddressZero } from '@ethersproject/constants'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import furoExports from '@sushiswap/furo/exports.json'
import { ProgressBar, ProgressColor, Typography } from '@sushiswap/ui'
import { useWalletState } from '@sushiswap/wagmi'
import {
  BackgroundVector,
  CancelModal,
  HistoryPopover,
  Layout,
  Overlay,
  ProgressBarCard,
  StreamDetailsPopover,
  TransferModal,
} from 'components'
import {
  createScheduleRepresentation,
  NextPaymentTimer,
  SchedulePopover,
  VestingChart,
  WithdrawModal,
} from 'components/vesting'
import { FuroStatus, Vesting } from 'lib'
import { getRebase, getVesting, getVestingTransactions } from 'lib'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useAccount, useConnect } from 'wagmi'

import type { Rebase, Transaction as TransactionDTO, Vesting as VestingDTO } from '.graphclient'

interface Props {
  fallback?: {
    vesting?: VestingDTO
    transactions?: TransactionDTO[]
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  // if (typeof query.chainId !== 'string' || typeof query.id !== 'string') return { props: {} }
  const { chainId, id } = query
  const vesting = (await getVesting(chainId as string, id as string)) as VestingDTO
  return {
    props: {
      fallback: {
        [`/furo/api/vesting/${chainId}/${id}`]: vesting,
        [`/furo/api/transactions/${chainId}/${id}`]: (await getVestingTransactions(
          chainId as string,
          id as string
        )) as TransactionDTO[],
        [`/furo/api/rebase/${query.chainId}/${vesting.token.id}`]: (await getRebase(
          chainId as string,
          vesting.token.id
        )) as Rebase,
      },
    },
  }
}

const VestingPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_VestingPage />
    </SWRConfig>
  )
}

const _VestingPage: FC = () => {
  const router = useRouter()
  const chainId = Number(router.query.chainId as string)
  const id = Number(router.query.id as string)
  const connect = useConnect()
  const { data: account } = useAccount()
  const { connecting, reconnecting } = useWalletState(connect, account?.address)

  const { data: furo } = useSWR<VestingDTO>(`/furo/api/vesting/${chainId}/${id}`)
  const { data: transactions } = useSWR<TransactionDTO[]>(`/furo/api/transactions/${chainId}/${id}`)
  const { data: rebase } = useSWR<Rebase>(
    () => (furo ? `/furo/api/rebase/${chainId}/${furo.token.id}` : null),
    (url) => fetch(url).then((response) => response.json())
  )
  const vesting = useMemo(
    () => (chainId && furo && rebase ? new Vesting({ chainId, furo, rebase }) : undefined),
    [chainId, furo, rebase]
  )

  const schedule = vesting
    ? createScheduleRepresentation({
        currency: vesting.token,
        cliffEndDate: new Date(vesting.startTime.getTime() + vesting.cliffDuration * 1000),
        cliffAmount: vesting.cliffAmount,
        stepAmount: vesting.stepAmount,
        stepDuration: vesting.stepDuration * 1000,
        startDate: vesting.startTime,
        stepPayouts: vesting.steps,
      })
    : undefined

  // Sync balance to Vesting entity
  // const balance = useVestingBalance(chainId, vesting?.id, vesting?.token)
  // if (vesting && balance) {
  //   vesting.balance = balance
  // }

  if (connecting || reconnecting) return <Overlay />

  return (
    <Layout
      backdrop={
        <div className="fixed inset-0 right-0 z-0 pointer-events-none opacity-20">
          <BackgroundVector width="100%" preserveAspectRatio="none" />
        </div>
      }
    >
      <div className="flex items-center gap-3 mt-4">
        <Link href="/dashboard" passHref={true}>
          <a className="flex items-center gap-2 group">
            <HomeIcon width={16} className="cursor-pointer group-hover:text-slate-50 text-slate-400" />
            <Typography variant="sm" weight={700} className="cursor-pointer group-hover:text-slate-50 text-slate-400">
              Dashboard
            </Typography>
          </a>
        </Link>
        <ChevronRightIcon width={24} className="text-slate-400" />
        <Typography variant="sm" weight={700} className="text-slate-600">
          Vesting
        </Typography>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-[430px_280px] justify-center gap-8 lg:gap-x-16 md:gap-y-0 pt-6 md:pt-24">
        <div className="flex justify-center">
          <VestingChart vesting={vesting} schedule={schedule} />
        </div>
        <div>
          <div className="flex flex-col justify-center gap-5">
            <ProgressBarCard
              aria-hidden="true"
              label="Streamed"
              value={`${vesting?.streamedPercentage?.toSignificant(4)}%`}
            >
              <ProgressBar
                progress={vesting ? vesting.streamedPercentage.divide(100).toSignificant(4) : 0}
                color={ProgressColor.BLUE}
                showLabel={false}
              />
            </ProgressBarCard>
            <ProgressBarCard
              aria-hidden="true"
              label="Withdrawn"
              value={`${vesting?.withdrawnPercentage?.toSignificant(4)}%`}
            >
              <ProgressBar
                progress={vesting ? vesting.withdrawnPercentage.divide(100).toSignificant(4) : 0}
                color={ProgressColor.PINK}
                showLabel={false}
              />
            </ProgressBarCard>
            <div className="mt-3">
              <NextPaymentTimer vesting={vesting} />
            </div>
          </div>
        </div>
        <div className="flex items-end justify-center gap-2">
          <StreamDetailsPopover stream={vesting} />
          <HistoryPopover transactionRepresentations={transactions} />
          <SchedulePopover vesting={vesting} schedule={schedule} />
        </div>
        {vesting?.status !== FuroStatus.CANCELLED && (
          <div className="flex flex-col gap-2">
            <WithdrawModal vesting={vesting} />
            <div className="flex gap-2">
              <TransferModal
                stream={vesting}
                abi={
                  furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroVesting?.abi ?? []
                }
                address={
                  furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroVesting?.address ??
                  AddressZero
                }
              />
              <CancelModal
                stream={vesting}
                abi={
                  furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroVesting?.abi ?? []
                }
                address={
                  furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroVesting?.address ??
                  AddressZero
                }
                fn="stopVesting"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default VestingPage
