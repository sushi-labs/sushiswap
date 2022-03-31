import { useRouter } from 'next/router'
import { FC } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'


interface Props {
  stream: Stream
  transactions: Transaction[]
}

interface Stream {
  id: string
  status: string
  amount: string
  withdrawnAmount: string
  expiresAt: string
  startedAt: string
  token: Token
}

interface Transaction {
  id: string
  type: string
  amount: string
  toBentoBox: false
  withdrawnAmount: string
  createdAtBlock: string
  createdAtTimestamp: string
  token: Token
}

interface Token {
  id: string
  symbol: string
  name: string
  decimals: string
}


const Streams: FC<Props> = (props) => {
  const router = useRouter()
  const id = router.query.id as string
  let {stream, transactions} = props
  return (
    <>
      <div className="px-2 pt-16">
        <h1 className="py-4 text-2xl font-bold">Stream</h1>
        <div className="grid gap-2">
          {stream ? (
              <div key={stream.id}>
                {stream.status} {``}
                {stream.amount} {``} {stream.token.symbol} {``}
                {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}
              </div>
          ) : (
            <div><i>No stream found..</i></div>
          )}
        </div>
        <h2 className="py-4 text-2xl font-bold">Transactions</h2>
        <div className="grid gap-2">
        {transactions.length ? (
            Object.values(transactions).map((transaction) => (
              <div key={transaction.id}>
                {transaction.type} {``}
                {transaction.amount} {``} {transaction.token.symbol} {``}
                {new Date(parseInt(transaction.createdAtTimestamp) * 1000).toLocaleString()} {``}
              </div>
            ))
          ) : (
            <div><i>No transactions found..</i></div>
          )}
        </div>
      </div>
    </>
  )
}

export default Streams

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  return {
    props: {
      stream: (await sdk.Stream({ id: query.id })).stream,
      transactions: (await sdk.Transactions({id: query.id})).transactions
  },
  }
}
