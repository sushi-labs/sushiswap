import { LinkIcon } from '@heroicons/react/solid'
import Layout from 'app/components/Layout'
import { StreamRepresentation, TransactionRepresentation } from 'app/features/context/representations'
import { Stream } from 'app/features/context/Stream'
import BalanceChart from 'app/features/stream/BalanceChart'
import StreamDetailsPopover from 'app/features/stream/StreamDetailsPopover'
import StreamTimer from 'app/features/stream/StreamTimer'
import TransactionHistory from 'app/features/stream/TransactionHistory'
import { FC, useMemo } from 'react'
import { HistoryIcon } from 'ui/icons'
import ProgressBar, { ProgressColor } from 'ui/progressbar/ProgressBar'
import { Typography } from 'ui/typography'
import { getBuiltGraphSDK } from '../../.graphclient'

interface Props {
  stream: StreamRepresentation
  transactions: TransactionRepresentation[]
}

const Streams: FC<Props> = (props) => {
  let { stream: rawStream, transactions } = props
  const stream = useMemo(() => new Stream({ stream: rawStream }), [rawStream])

  return (
    <Layout>
      <div className="flex gap-16">
        <div className="w-[430px]">
          <BalanceChart stream={stream} />
          <div className="flex justify-center gap-2">
            <div className="flex items-center gap-2 px-5 border shadow-md cursor-pointer shadow-dark-1000 border-dark-800 bg-dark-900 rounded-xl h-11">
              <LinkIcon width={18} height={18} />
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                Links
              </Typography>
            </div>
            <StreamDetailsPopover />
            <div className="flex items-center gap-2 px-5 border shadow-md cursor-pointer shadow-dark-1000 border-dark-800 bg-dark-900 rounded-xl h-11">
              <HistoryIcon width={18} height={18} />
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                History
              </Typography>
            </div>
          </div>
        </div>
        <div className="w-[280px] flex flex-col col-span-2 justify-between">
          <div className="flex flex-col justify-center gap-5">
            <div className="flex flex-col gap-2 p-5 border shadow-md shadow-dark-1000 bg-dark-900 border-dark-800 rounded-2xl">
              <div className="flex items-center justify-between gap-2">
                <Typography variant="sm" weight={400}>
                  Streamed:
                </Typography>
                <Typography variant="lg" weight={700}>
                  {(stream.streamedPercentage * 100).toFixed(2)}%
                </Typography>
              </div>
              <ProgressBar progress={stream.streamedPercentage} color={ProgressColor.BLUE} showLabel={false} />
            </div>
            <div className="flex flex-col gap-2 p-5 border shadow-md shadow-dark-1000 bg-dark-900 border-dark-800 rounded-2xl">
              <div className="flex items-center justify-between gap-2">
                <Typography variant="sm" weight={400}>
                  Withdrawn:
                </Typography>
                <Typography variant="lg" weight={700}>
                  {(stream.withdrawnPercentage * 100).toFixed(2)}%
                </Typography>
              </div>
              <ProgressBar progress={stream.withdrawnPercentage} color={ProgressColor.PINK} showLabel={false} />
            </div>
            <div className="mt-3">
              <StreamTimer stream={stream} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <button>Withdraw</button>
            <button>Transfer</button>
          </div>
        </div>
      </div>
      <TransactionHistory transactions={transactions} />
    </Layout>
  )
}

export default Streams

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  const stream = (await sdk.Stream({ id: query.id })).STREAM_stream
  const transactions = (await sdk.StreamTransactions({ id: query.id })).STREAM_transactions
  return {
    props: {
      stream,
      transactions,
    },
  }
}
