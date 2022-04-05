import { FC } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'
import BalanceChart from '../../features/stream/BalanceChart'
import StreamDetails from '../../features/stream/StreamDetails'
import TransactionHistory from '../../features/stream/TransactionHistory'
import { Stream, Transaction } from '../../interfaces/stream'

interface Props {
  stream: Stream
  transactions: Transaction[]
}

const Streams: FC<Props> = (props) => {
  let { stream, transactions } = props

  return (
    <>
      <div className="px-2 pt-16">
        <StreamDetails stream={stream} />
        <BalanceChart stream={stream} />
        <TransactionHistory transactions={transactions} />
      </div>
    </>
  )
}

export default Streams

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  const stream = (await sdk.Stream({ id: query.id })).stream
  const transactions = (await sdk.Transactions({ id: query.id })).transactions
  return {
    props: {
      stream,
      transactions,
    },
  }
}
