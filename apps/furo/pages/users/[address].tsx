import { useRouter } from 'next/router'
import { FC } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'


interface StreamsProps {
  user: {
    revenueStreams: Stream[]
    createdStreams: Stream[]
  }
}

interface Stream {
  id: string
  status: string
  amount: string
  withdrawnAmount: string
  expiresAt: string
  startedAt: string
  createdBy: User
  token: Token
}

interface Token {
  id: string
  symbol: string
  name: string
}

interface User {
  id: string
}

const Streams: FC<StreamsProps> = (props) => {
  const router = useRouter()
  const address = router.query.address as string

  return (
    <>
      <div className="px-2 pt-16">
        <h1 className="py-4 text-2xl font-bold">Streams</h1>
        <h2>Incoming streams</h2>
        <div className="grid gap-2">
          {props.user.revenueStreams.length ? (
            Object.values(props.user.revenueStreams).map((stream) => (
              <div key={stream.id}>
                {stream.status} {``}
                {stream.createdBy.id} {``}
                {stream.amount} {``} {stream.token.symbol} {``}
                {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}
              </div>
            ))
          ) : (
            <div><i>No streams found..</i></div>
          )}
        </div>

        <h2>Outgoing streams</h2>
        <div className="grid gap-2">
          {props.user.createdStreams.length ? (
            Object.values(props.user.createdStreams).map((stream) => (
              <div key={stream.id}>
                {stream.status} {``}
                {stream.createdBy.id} {``}
                {stream.amount} {``} {stream.token.symbol} {``}
                {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}
              </div>
            ))
          ) : (
            <div><i>No streams found..</i></div>
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
    props: await sdk.UserStreams({ id: query.address }),
  }
}
