import { useRouter } from 'next/router'
import { FC } from 'react'
import { getBuiltGraphSDK } from '../../../../.graphclient'
import Main from '../../../../components/Main'
import IncomingStreamsTable from '../../../../features/stream/IncomingStreamsTable'
import OutgoingStreamsTable from '../../../../features/stream/OutgoingStreamsTable'
import { RawStream } from '../../../../features/stream/context/types'

interface StreamsProps {
  incomingStreams: RawStream[]
  outgoingStreams: RawStream[]
}

const Streams: FC<StreamsProps> = (props) => {
  const router = useRouter()
  const address = router.query.address as string
  let { incomingStreams, outgoingStreams } = props

  return (

    <Main>
      <div className="px-2 pt-16">
        <h1 className="py-4 text-2xl font-bold">Dashboard</h1>
        <h1 className="py-4 text-2xl font-bold">Incoming streams</h1>

        {incomingStreams.length > 0 ? (
          <IncomingStreamsTable incomingStreams={incomingStreams} />
        ) : (
          <div>No outgoing streams</div>
        )}

        <h1 className="py-4 text-2xl font-bold">Outgoing streams</h1>

        {/* <CreateStreamModal/> */}
        
        {outgoingStreams.length > 0 ? (
          <OutgoingStreamsTable outgoingStreams={outgoingStreams} />
        ) : (
          <div>No outgoing streams</div>
        )}
      </div>
    </Main>
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
