import { FC } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'
import Container from '../../components/Container'
import Main from '../../components/Main'
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
    <Main>
      <Container maxWidth={'6xl'}>
      {/* <div className="px-2 pt-16">
        <StreamDetails stream={stream} />
        <TransactionHistory transactions={transactions} />
      </div> */}

      <div className="grid grid-flow-col grid-cols-7 grid-rows-6 gap-6 bg-slate-900 md:grid-flow-row">
      <div className="flex flex-col items-center col-span-5 row-span-6 bg-slate-600 ">01  

      <BalanceChart stream={stream} />
      </div>
      <div className="col-span-2 col-start-6 row-start-2 bg-slate-500">Streamed</div>
      <div className="col-span-2 col-start-6 row-start-3 bg-slate-500">Withdraw</div>
      <div className="col-span-2 col-start-6 row-start-4 bg-slate-500">Time remaining</div>
      <div className="col-span-2 col-start-6 row-span-2 row-start-6 bg-slate-500">
        <div>Withdraw</div>
        <div>Transfer</div>
        </div>
      
      <div className="col-span-1 col-start-2 bg-slate-400">02</div>
      <div className="col-span-1 bg-slate-400">02</div>
      <div className="col-span-1 bg-slate-400">02</div>
    </div>
    </Container>
    </Main>
    
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
