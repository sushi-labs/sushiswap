import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { getBuiltGraphSDK } from '../../../.graphclient'

interface StreamsProps {
  revenueStreams: Stream[]
  createdStreams: Stream[]
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
  decimals: string
}

interface User {
  id: string
}

const Streams: FC<StreamsProps> = (props) => {
  const router = useRouter()
  const address = router.query.address as string
  let {revenueStreams, createdStreams} = props

  return (
    <>
      <div className="px-2 pt-16">
        <h1 className="py-4 text-2xl font-bold">Streams</h1>
        <h1 className="py-4 text-2xl font-bold">Incoming streams</h1>
        <div className="grid gap-2">
          {revenueStreams.length ? (
            Object.values(revenueStreams).map((stream) => (
              <div key={stream.id}>
                {stream.status} {``}
                {stream.createdBy.id} {``}
                {stream.amount} {``} {stream.token.symbol} {``}
                {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}
                {<Link href={'/streams/'.concat(stream.id)}> View</Link>}
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
          {createdStreams.length ? (
            Object.values(createdStreams).map((stream) => (
              <div key={stream.id}>
                {stream.status} {``}
                {stream.createdBy.id} {``}
                {stream.amount} {``} {stream.token.symbol} {``}
                {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}
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
  return {
    props: (await sdk.UserStreams({ id: query.address })).user,
  }
}
