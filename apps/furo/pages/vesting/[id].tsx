import Layout from 'app/components/Layout'
import { Vesting } from 'app/features/context'
import {
  ScheduleRepresentation,
  TransactionRepresentation,
  VestingRepresentation
} from 'app/features/context/representations'
import HistoryPopover from 'app/features/HistoryPopover'
import LinkPopover from 'app/features/LinkPopover'
import NextPaymentTimer from 'app/features/vesting/NextPaymentTimer'
import SchedulePopover from 'app/features/vesting/SchedulePopover'
import { VestingChart } from 'app/features/vesting/VestingChart'
import { FC, useMemo } from 'react'
import { ProgressColor, Typography } from 'ui'
import ProgressBar from 'ui/progressbar/ProgressBar'
import { getBuiltGraphSDK } from '../../.graphclient'

interface Props {
  vestingRepresentation: VestingRepresentation
  transactions: TransactionRepresentation[]
  schedule: ScheduleRepresentation
}

const VestingPage: FC<Props> = (props) => {
  let { vestingRepresentation, transactions, schedule } = props
  const vesting = useMemo(() => new Vesting({ vesting: vestingRepresentation }), [vestingRepresentation])

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
                  {(vesting.streamedPercentage * 100).toFixed(2)}%
                </Typography>
              </div>
              <ProgressBar progress={vesting.streamedPercentage} color={ProgressColor.BLUE} showLabel={false} />
            </div>
            <div className="flex flex-col gap-2 p-5 border shadow-md shadow-dark-1000 bg-dark-900 border-dark-800 rounded-2xl">
              <div className="flex items-center justify-between gap-2">
                <Typography variant="sm" weight={400}>
                  Withdrawn:
                </Typography>
                <Typography variant="lg" weight={700}>
                  {(vesting.withdrawnPercentage * 100).toFixed(2)}%
                </Typography>
              </div>
              <ProgressBar progress={vesting.withdrawnPercentage} color={ProgressColor.PINK} showLabel={false} />
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

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  const vestingRepresentation = (await sdk.Vesting({ id: query.id })).VESTING_vesting
  const transactions = (await sdk.VestingTransactions({ id: query.id })).VESTING_transactions
  const schedule = (await sdk.VestingSchedule({ id: query.id })).VESTING_vesting.schedule
  return {
    props: {
      vestingRepresentation,
      transactions,
      schedule,
    },
  }
}
