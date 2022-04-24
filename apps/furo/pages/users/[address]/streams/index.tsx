import Layout from 'app/components/Layout'
import { StreamRepresentation } from 'app/features/context/representations'
import CreateStreamModal from 'app/features/stream/CreateStreamModal'
import { StreamTable, StreamTableType } from 'app/features/stream/StreamTable'
import CreateVestingModal from 'app/features/vesting/CreateVestingModal'
import { FC } from 'react'
import { Typography } from 'ui/typography'
import { getBuiltGraphSDK } from '../../../../.graphclient'

interface StreamsProps {
  incomingStreams: StreamRepresentation[]
  outgoingStreams: StreamRepresentation[]
}

const Streams: FC<StreamsProps> = ({ incomingStreams, outgoingStreams }) => {
  return (
    <Layout>
      <div className="flex flex-col h-full gap-12 pt-40">
        <Typography variant="h2" weight={700} className="text-high-emphesis">
          Dashboard
        </Typography>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              Incoming streams
            </Typography>
            <StreamTable streams={incomingStreams} type={StreamTableType.INCOMING} />
          </div>
          <CreateStreamModal />
          <CreateVestingModal />
          <div className="flex flex-col gap-5">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              Outgoing streams
            </Typography>
            <StreamTable streams={outgoingStreams} type={StreamTableType.OUTGOING} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Streams

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  const user = (await sdk.UserStreams({ id: query.address })).STREAM_user
  return {
    props: user || {},
  }
}
