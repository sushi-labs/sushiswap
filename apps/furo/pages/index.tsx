import { StreamsQueryQuery, getBuiltGraphSDK } from '../.graphclient'
import { KPI } from '../components'

export default function Furo(props: StreamsQueryQuery) {
  // const { id, status, txCount, startedAt, expiresAt, amount, recipient, createdBy, transactionCount, token } = props.streams
  // Object.values(props).map(
  //   (stream) => ({
  //     : previousValue.liquidityUSD + Number(currentValue.liquidityUSD),
  //     volumeUSD: previousValue.volumeUSD + Number(currentValue.volumeUSD),
  //     txCount: previousValue.txCount + Number(currentValue.txCount),
  //     pairCount: previousValue.pairCount + Number(currentValue.pairCount),
  //     userCount: previousValue.userCount + Number(currentValue.userCount),
  //     tokenCount: previousValue.tokenCount + Number(currentValue.tokenCount),
  //   })
  // )

  console.log({ props })

  return (
    <div className="px-2 pt-16">
      <h1 className="py-4 text-2xl font-bold">Overview</h1>
        <h2>Incoming streams</h2>
      <div className="grid grid-cols-2 gap-2">
      {Object.values(props.streams).map( (stream) => (
        <div key={stream.id}> {stream.status} {stream.recipient.id} {stream.amount} {new Date(parseInt(stream.startedAt) * 1000).toDateString()} {new Date(parseInt(stream.expiresAt) * 1000).toDateString()}</div>
      ))}

      </div>
      
      <h2>Outgoing streams</h2>
    </div>
  )
}

export async function getStaticProps() {
  const sdk = await getBuiltGraphSDK()
  return {
    props: await sdk.StreamsQuery(),
    revalidate: 60,
  }
}
