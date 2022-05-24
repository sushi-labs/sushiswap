import { AddressZero } from '@ethersproject/constants'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import { useIsMounted } from '@sushiswap/hooks'
import { ProgressBar, ProgressColor, Typography } from '@sushiswap/ui'
import FUROVESTING_ABI from 'abis/FuroVesting.json'
import { BackgroundVector, ProgressBarCard } from 'components'
import Layout from 'components/Layout'
import { FuroStatus, ScheduleRepresentation, TransactionRepresentation, Vesting, VestingRepresentation } from 'features'
import CancelStreamModal from 'features/CancelStreamModal'
import HistoryPopover from 'features/HistoryPopover'
import TransferStreamModal from 'features/TransferStreamModal'
import NextPaymentTimer from 'features/vesting/NextPaymentTimer'
import SchedulePopover from 'features/vesting/SchedulePopover'
import { VestingChart } from 'features/vesting/VestingChart'
import WithdrawModal from 'features/vesting/WithdrawModal'
import { getVesting, getVestingSchedule, getVestingTransactions } from 'graph/graph-client'
import { useStreamBalance, VESTING_ADDRESS } from 'hooks'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import useSWR, { SWRConfig } from 'swr'

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
        [`/api/schedule/${query.chainId}/${query.id}`]: (await getVestingSchedule(
          query.chainId,
          query.id
        )) as ScheduleRepresentation,
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
  const isMounted = useIsMounted()
  const router = useRouter()
  const chainId = Number(router.query.chainId as string)
  const id = Number(router.query.id as string)

  const { data: vestingRepresentation } = useSWR<VestingRepresentation>(`/api/vesting/${chainId}/${id}`)
  const { data: transactions } = useSWR<TransactionRepresentation[]>(`/api/transactions/${chainId}/${id}`)
  const { data: schedule } = useSWR<ScheduleRepresentation>(`/api/schedule/${chainId}/${id}`)

  const vesting = useMemo(
    () => (vestingRepresentation ? new Vesting({ vesting: vestingRepresentation, chainId }) : undefined),
    [chainId, vestingRepresentation]
  )

  const balance = useStreamBalance(vesting?.id, vesting?.token)

  // Sync balance to Vesting entity
  if (vesting && balance) {
    vesting.balance = balance
  }

  if (!isMounted) return null

  return (
    <Layout
      backdrop={
        <div className="fixed inset-0 z-0 pointer-events-none right-0 opacity-20">
          <BackgroundVector width="100%" preserveAspectRatio="none" />
        </div>
      }
    >
      <div className="flex gap-3 items-center mt-4">
        <Link href="/dashboard" passHref={true}>
          <a className="group flex items-center gap-2">
            <HomeIcon width={16} className="group-hover:text-slate-50 text-slate-400 cursor-pointer" />
            <Typography variant="sm" weight={700} className="group-hover:text-slate-50 text-slate-400 cursor-pointer">
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
          <HistoryPopover transactionRepresentations={transactions} />
          <SchedulePopover vesting={vesting} scheduleRepresentation={schedule} />
        </div>
        {vesting?.status !== FuroStatus.CANCELLED && (
          <div className="flex flex-col gap-2">
            <WithdrawModal vesting={vesting} />
            <div className="flex gap-2">
              <TransferStreamModal
                stream={vesting}
                abi={FUROVESTING_ABI}
                address={chainId ? VESTING_ADDRESS[chainId] : AddressZero}
              />
              <CancelStreamModal
                stream={vesting}
                abi={FUROVESTING_ABI}
                address={chainId ? VESTING_ADDRESS[chainId] : AddressZero}
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
