import Layout from 'components/Layout'
import { StreamRepresentation, TransactionRepresentation } from 'features/context/representations'
import { Stream } from 'features/context/Stream'
import BalanceChart from 'features/stream/BalanceChart'
import CancelStreamModal from 'features/stream/CancelStreamModal'
import HistoryPopover from 'features/HistoryPopover'
import StreamDetailsPopover from 'features/stream/StreamDetailsPopover'
import FuroTimer from 'features/FuroTimer'
import TransferStreamModal from 'features/stream/TransferStreamModal'
import UpdateStreamModal from 'features/stream/UpdateStreamModal'
import WithdrawModal from 'features/stream/WithdrawModal'
import { FC, useMemo } from 'react'
import { Typography, ProgressBar, ProgressColor } from '@sushiswap/ui'
import LinkPopover from 'features/LinkPopover'
import { getBuiltGraphSDK } from '../../.graphclient'
import { getStream, getStreamTransactions } from 'graph/graph-client'

interface Props {
  stream: StreamRepresentation
  transactions: TransactionRepresentation[]
}

const Streams: FC<Props> = (props) => {
  let { stream: streamRepresentation, transactions } = props
  const stream = useMemo(() => new Stream({ stream: streamRepresentation }), [streamRepresentation])

  return (
    <Layout>
      <div className="flex gap-16">
        <div className="w-[430px]">
          <BalanceChart stream={stream} />
          <div className="flex justify-center gap-2">
            <LinkPopover furo={stream} />
            <StreamDetailsPopover stream={stream} />
            <HistoryPopover transactionRepresentations={transactions} />
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
              <FuroTimer furo={stream} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <WithdrawModal stream={stream} />
            <div className="flex gap-2">
              <TransferStreamModal stream={stream} />
              <UpdateStreamModal stream={stream} />
            </div>
            {/*<CancelStreamModal stream={stream} />*/}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Streams

export async function getServerSideProps({ query }) {
  return {
    props: {
      stream: await getStream(query.chainId, query.id),
      transactions: await getStreamTransactions(query.chainId, query.id),
    },
  }
}
