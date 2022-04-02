import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { getBuiltGraphSDK } from '../../../../.graphclient'

interface StreamsProps {
  incomingStreams: Stream[]
  outgoingStreams: Stream[]
}

interface Stream {
  id: string
  status: string
  amount: string
  withdrawnAmount: string
  expiresAt: string
  startedAt: string
  recipient: User
  createdBy: User
  token: Token
}

interface Token {
  id: string
  symbol: string
  name: string
  decimals: string
}

interface User {
  id: string
}

const Streams: FC<StreamsProps> = (props) => {
  const router = useRouter()
  const address = router.query.address as string
  let {incomingStreams, outgoingStreams} = props

  return (
    <>
      <div className="px-2 pt-16">
        <h1 className="py-4 text-2xl font-bold">Streams</h1>
        <h1 className="py-4 text-2xl font-bold">Incoming streams</h1>
        <div className="grid gap-2">
          {incomingStreams.length ? (
            Object.values(incomingStreams).map((stream) => (
              <div key={stream.id}>
                {stream.status} {``}
                {stream.createdBy.id} {``}
                {stream.amount} {``} {stream.token.symbol} {``}
                {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}
                {<Link href={'/stream/'.concat(stream.id)}> View</Link>}
              </div>
            ))
          ) : (
            <div>
              <i>No streams found..</i>
            </div>
          )}
        </div>

        <h1 className="py-4 text-2xl font-bold">Outgoing streams</h1>
        <div className="grid gap-2">
          {outgoingStreams.length ? (
            Object.values(outgoingStreams).map((stream) => (
              <div key={stream.id}>
                {stream.status} {``}
                {stream.recipient.id} {``}
                {stream.amount} {``} {stream.token.symbol} {``}
                {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}
                {<Link href={'/stream/'.concat('/').concat(stream.id)}> View</Link>}
              </div>
            ))
          ) : (
            <div>
              <i>No streams found..</i>
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
  const user = (await sdk.UserStreams({ id: query.address })).user
  return {
    props: user,
  }
}
