import { FC } from 'react'
import { getBuiltGraphSDK } from '../../../../.graphclient'
import Main from '../../../../components/Main'
import { RawStream } from '../../../../features/stream/context/types'
import Typography from '../../../../../../packages/ui/typography/Typography'
import StreamTable from '../../../../features/stream/StreamTable'

interface StreamsProps {
  incomingStreams: RawStream[]
  outgoingStreams: RawStream[]
}

const Streams: FC<StreamsProps> = ({ incomingStreams, outgoingStreams }) => {
  return (
    <Main>
      <div className="flex flex-col gap-12">
        <Typography variant="h2" weight={700} className="text-high-emphesis">
          Dashboard
        </Typography>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              Incoming streams
            </Typography>
            <StreamTable streams={incomingStreams} />
          </div>

          <div className="flex flex-col gap-5">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              Outgoing streams
            </Typography>
            <StreamTable streams={outgoingStreams} />
          </div>
        </div>
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
