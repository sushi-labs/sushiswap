import { FC } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'
import ProgressBar, { ProgressColor } from '../../components/ProgressBar'
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

      <div className="grid grid-flow-col grid-cols-7 grid-rows-6 gap-6 md:grid-flow-row auto-rows-max md:auto-rows-min">
      <div className="flex flex-col items-center col-span-5 row-span-6 ">
      <BalanceChart stream={stream} />
      </div>
      
      <div className="col-span-2 col-start-6 row-start-2 border rounded border-dark-800 bg-dark-900">

        Streamed:
        <ProgressBar progress={0.35} color={ProgressColor.BLUE} showLabel={false}/>
      </div>
      <div className="col-span-2 col-start-6 row-start-3 border rounded border-dark-800 bg-dark-900">
        
        Withdrawn:
        <ProgressBar progress={0.35} color={ProgressColor.PINK} showLabel={false}/>
        </div>
      <div className="col-span-2 col-start-6 row-start-4 border rounded border-dark-800 bg-dark-900">

        <p>208</p>
        <p>Days</p>
        REMAINING
        </div>
      <div className="col-span-2 col-start-6 row-span-2 row-start-6 border rounded border-dark-800 bg-dark-900">
      <button type="button" className="rounded bg-gradient-to-r from-blue-400 to-pink-500">
        WITHDRAW
      </button>
        <div>TRANSFER</div>
        </div>
      
      <div className="col-span-1 col-start-2 border rounded border-dark-800 bg-dark-900">02</div>
      <div className="col-span-1 border rounded border-dark-800 bg-dark-900">02</div>
      <div className="col-span-1 border rounded border-dark-800 bg-dark-900">02</div>
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
