import { AddressZero } from '@ethersproject/constants'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import furoExports from '@sushiswap/furo/exports.json'
import { ProgressBar, ProgressColor, Typography } from '@sushiswap/ui'
import { useWalletState } from '@sushiswap/wagmi'
import { BackgroundVector, ProgressBarCard } from 'components'
import Layout from 'components/Layout'
import { Overlay } from 'components/Overlay'
import {
  createScheduleRepresentation,
  FuroStatus,
  TransactionRepresentation,
  Vesting,
  VestingRepresentation,
} from 'features'
import CancelStreamModal from 'features/CancelStreamModal'
import HistoryPopover from 'features/HistoryPopover'
import StreamDetailsPopover from 'features/StreamDetailsPopover'
import TransferStreamModal from 'features/TransferStreamModal'
import NextPaymentTimer from 'features/vesting/NextPaymentTimer'
import SchedulePopover from 'features/vesting/SchedulePopover'
import { VestingChart } from 'features/vesting/VestingChart'
import WithdrawModal from 'features/vesting/WithdrawModal'
import { getVesting, getVestingTransactions } from 'graph/graph-client'
import { useVestingBalance } from 'hooks'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useAccount, useConnect } from 'wagmi'

interface Props {
  fallback?: Record<string, any>
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.chainId !== 'string' || typeof query.id !== 'string') return { props: {} }
  return {
    props: {
      fallback: {
        [`/api/vesting/${query.chainId}/${query.id}`]: (await getVesting(
          query.chainId,
          query.id
        )) as VestingRepresentation,
        [`/api/transactions/${query.chainId}/${query.id}`]: (await getVestingTransactions(
          query.chainId,
          query.id
        )) as TransactionRepresentation[],
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

  const { data: vestingRepresentation } = useSWR<VestingRepresentation>(`/api/vesting/${chainId}/${id}`)
  const { data: transactions } = useSWR<TransactionRepresentation[]>(`/api/transactions/${chainId}/${id}`)

  const vesting = useMemo(
    () => (vestingRepresentation ? new Vesting({ chainId, vesting: vestingRepresentation }) : undefined),
    [chainId, vestingRepresentation]
  )

  const schedule = vesting
    ? createScheduleRepresentation({
        token: vesting.token,
        cliffEndDate: new Date(vesting.startTime.getTime() + vesting.cliffDuration * 1000),
        cliffAmount: vesting.cliffAmount,
        stepAmount: vesting.stepAmount,
        stepDuration: vesting.stepDuration * 1000,
        startDate: vesting.startTime,
        stepPayouts: vesting.steps,
      })
    : undefined

  // Sync balance to Vesting entity
  const balance = useVestingBalance(chainId, vesting?.id, vesting?.token)
  if (vesting && balance) {
    vesting.balance = balance
  }

  console.log({ balance: balance?.toExact(), balance2: vesting?.balance2.toExact() })

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
              <TransferStreamModal
                stream={vesting}
                abi={(furoExports as any)[chainId]?.[0].contracts.FuroVesting.abi}
                address={chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroVesting.address : AddressZero}
              />
              <CancelStreamModal
                stream={vesting}
                abi={(furoExports as any)[chainId]?.[0].contracts.FuroVesting.abi}
                address={chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroVesting.address : AddressZero}
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
