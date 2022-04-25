import { curveStep } from '@visx/curve'
import { TooltipWithBounds } from '@visx/tooltip'
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, Tooltip, XYChart } from '@visx/xychart'
import Main from 'app/components/Main'
import { Vesting } from 'app/features/context'
import {
  ScheduleRepresentation,
  TransactionRepresentation,
  VestingRepresentation,
} from 'app/features/context/representations'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'

interface Props {
  vesting: VestingRepresentation
  transactions: TransactionRepresentation[]
  schedule: ScheduleRepresentation
}

const VestingPage: FC<Props> = (props) => {
  const router = useRouter()
  const id = router.query.id as string
  let { vesting, transactions, schedule } = props
  const [chartData, setChartData] = useState<{ x; y }[]>()
  // const vestTest = useMemo( () => new Vesting({vesting}), [vesting])
  // console.log({vestTest})
  // console.log(vestTest.nextPaymentTimeRemaining)

  useEffect(() => {
    const data = schedule.periods.map((period) => {
      const date = new Date(parseInt(period.time) * 1000)
      return {
        x: date.toISOString().slice(0, 10),
        y: period.amount,
      }
    })
    setChartData(data)
  }, [schedule])

  const accessors = {
    xAccessor: (d) => d.x,
    yAccessor: (d) => d.y,
  }

  return (
    <Main>
      <div className="px-2 pt-16">
        <h1 className="py-4 text-2xl font-bold">Vesting</h1>
        <div className="grid gap-2">
          {vesting ? (
            <div key={vesting.id}>
              {vesting.status} {``}
              {vesting.totalAmount} {``} {vesting.token.symbol} {``}
              {new Date(parseInt(vesting.startedAt) * 1000).toLocaleString()} {``}
              {new Date(parseInt(vesting.expiresAt) * 1000).toLocaleString()}
            </div>
          ) : (
            <div>
              <i>No Vesting found..</i>
            </div>
          )}
        </div>
        <h2 className="py-4 text-2xl font-bold">Transactions</h2>
        <div className="grid gap-2">
          {transactions.length ? (
            Object.values(transactions).map((transaction) => (
              <div key={transaction.id}>
                {transaction.type} {``}
                {transaction.amount} {``} {transaction.token.symbol} {``}
                {new Date(parseInt(transaction.createdAtTimestamp) * 1000).toLocaleDateString()} {``}
              </div>
            ))
          ) : (
            <div>
              <i>No transactions found..</i>
            </div>
          )}
        </div>

        <XYChart
          height={350}
          width={900}
          xScale={{ type: 'band' }}
          yScale={{ type: 'linear', domain: [0, parseInt(vesting.totalAmount) * 1.33] }}
        >
          <AnimatedAxis orientation="left" numTicks={4} />
          <AnimatedAxis orientation="bottom" />
          <AnimatedGrid columns={false} numTicks={4} />
          <AnimatedLineSeries dataKey={''} data={chartData ?? []} {...accessors} curve={curveStep} />
          <TooltipWithBounds
            snapTooltipToDatumX
            snapTooltipToDatumY
            showSeriesGlyphs
            renderTooltip={({ tooltipData, colorScale }) => (
              <div>
                <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>{tooltipData.nearestDatum.key}</div>
                {accessors.xAccessor(tooltipData.nearestDatum.datum)}
                {', '}
                {accessors.yAccessor(tooltipData.nearestDatum.datum)}
              </div>
            )}
          />
        </XYChart>

        <h2 className="py-4 text-2xl font-bold">Schedule periods</h2>
        <div className="grid gap-2">
          {schedule.periods.length ? (
            Object.values(schedule.periods).map((period) => (
              <div key={period.id}>
                {period.type} {``} {new Date(parseInt(period.time) * 1000).toLocaleString()} {``} {period.amount}
              </div>
            ))
          ) : (
            <div>
              <i>No schedule data found..</i>
            </div>
          )}
        </div>
      </div>
    </Main>
  )
}

export default VestingPage

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  const vesting = (await sdk.Vesting({ id: query.id })).VESTING_vesting
  const transactions = (await sdk.VestingTransactions({ id: query.id })).VESTING_transactions
  const schedule = (await sdk.VestingSchedule({ id: query.id })).VESTING_vesting.schedule
  return {
    props: {
      vesting,
      transactions,
      schedule,
    },
  }
}
