import Layout from 'components/Layout'
import { Vesting } from 'features/context'
import {
  ScheduleRepresentation,
  TransactionRepresentation,
  VestingRepresentation,
} from 'features/context/representations'
import HistoryPopover from 'features/HistoryPopover'
import LinkPopover from 'features/LinkPopover'
import NextPaymentTimer from 'features/vesting/NextPaymentTimer'
import SchedulePopover from 'features/vesting/SchedulePopover'
import { VestingChart } from 'features/vesting/VestingChart'
import { FC, useMemo } from 'react'
import { ProgressBar, ProgressColor, Typography } from '@sushiswap/ui'
import { getVesting, getVestingSchedule, getVestingTransactions } from 'graph/graph-client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

interface Props {
  vestingRepresentation?: VestingRepresentation
  transactions?: TransactionRepresentation[]
  schedule?: ScheduleRepresentation
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.chainId !== 'string' || typeof query.id !== 'string') return { props: {} }
  return {
    props: {
      vestingRepresentation: (await getVesting(query.chainId, query.id)) as VestingRepresentation,
      transactions: (await getVestingTransactions(query.chainId, query.id)) as TransactionRepresentation[],
      schedule: (await getVestingSchedule(query.chainId, query.id)) as ScheduleRepresentation,
    },
  }
}

const VestingPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  vestingRepresentation,
  transactions,
  schedule,
}) => {
  const vesting = useMemo(
    () => (vestingRepresentation ? new Vesting({ vesting: vestingRepresentation }) : undefined),
    [vestingRepresentation],
  )

  return (
    <Layout>
      <div className="flex gap-16">
        <div className="w-[630px]">
          <VestingChart vesting={vesting} schedule={schedule} />
          <div className="flex justify-center gap-2">
            <LinkPopover furo={vesting} />
            {/* Create a DetailsPoperover for vesting */}
            {/* <StreamDetailsPopover stream={vesting} /> */}
            <HistoryPopover transactionRepresentations={transactions} />
            <SchedulePopover vesting={vesting} scheduleRepresentation={schedule} />
          </div>
        </div>
        <div className="w-[280px] flex flex-col col-span-2 justify-between">
          <div className="flex flex-col justify-center gap-5">
            <div className="flex flex-col gap-2 p-5 border shadow-md shadow-dark-1000 bg-dark-900 border-dark-800 rounded-2xl">
              <div className="flex items-center justify-between gap-2">
                <Typography variant="sm" weight={400}>
                  Progress:
                </Typography>
                <Typography variant="lg" weight={700}>
                  {(Number(vesting?.streamedPercentage) * 100).toFixed(2)}%
                </Typography>
              </div>
              <ProgressBar
                progress={vesting ? vesting.streamedPercentage.toFixed(4) : 0}
                color={ProgressColor.BLUE}
                showLabel={false}
              />
            </div>
            <div className="flex flex-col gap-2 p-5 border shadow-md shadow-dark-1000 bg-dark-900 border-dark-800 rounded-2xl">
              <div className="flex items-center justify-between gap-2">
                <Typography variant="sm" weight={400}>
                  Withdrawn:
                </Typography>
                <Typography variant="lg" weight={700}>
                  {(Number(vesting?.withdrawnPercentage) * 100).toFixed(2)}%
                </Typography>
              </div>
              <ProgressBar
                progress={vesting ? vesting?.withdrawnPercentage : 0}
                color={ProgressColor.PINK}
                showLabel={false}
              />
            </div>
            <div className="mt-3">
              <NextPaymentTimer vesting={vesting} />
            </div>
            {/* <div className="mt-3">
              <FuroTimer furo={vesting} />
            </div> */}
          </div>
          <div className="flex flex-col gap-1"></div>
        </div>
      </div>
    </Layout>
  )
}

export default VestingPage
