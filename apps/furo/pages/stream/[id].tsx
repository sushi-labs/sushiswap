import { FC } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'
import BalanceChart from '../../features/stream/BalanceChart'
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
        <h1 className="py-4 text-2xl font-bold">Stream</h1>
        <div className="grid gap-2">
          {stream ? (
            <div key={stream.id}>
              <div>Status: {stream.status}</div>
              <div>
                Total: {stream.amount} {``} {stream.token.symbol}{' '}
              </div>
              <div>
                Withdrawn amount: {stream.withdrawnAmount} {stream.token.symbol}{' '}
              </div>
              <div>
                Balance: {} {stream.token.symbol}{' '}
              </div>
              <div>
                Started: {} {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()}{' '}
              </div>
              <div>
                Expires: {} {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}{' '}
              </div>
            </div>
          ) : (
            <div>
              <i>No stream found..</i>
            </div>
          )}
        </div>
        <BalanceChart stream={stream} />

        <h2 className="py-4 text-2xl font-bold">Transactions</h2>
        <div className="grid gap-2">
          {transactions.length ? (
            Object.values(transactions).map((transaction) => (
              <div key={transaction.id}>
                {transaction.type} {``}
                {transaction.amount} {``} {transaction.token.symbol} {``}
                {transaction.to.id} {``}
                {new Date(parseInt(transaction.createdAtTimestamp) * 1000).toLocaleString()} {``}
              </div>
            ))
          ) : (
            <div>
              <i>No transactions found..</i>
            </div>
          )}
        </div>
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
