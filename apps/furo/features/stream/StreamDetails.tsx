import { FC } from 'react'
import { RawStream } from './context/types'

interface Props {
  stream: RawStream
}
const StreamDetails: FC<Props> = (props) => {
  const stream = props.stream
  return (
    <>
      <h1 className="py-4 text-2xl font-bold">Stream</h1>
      <div className="grid gap-2">
        {stream ? (
          <div key={stream.id}>
            <div>Status: {stream.status}</div>
            <div>
              Total: {stream.amount} {``} {stream.token.symbol}{' '}
            </div>
            <div>
              Withdrawn amount: {stream.withdrawnAmount} {stream.token.symbol}{' '}
            </div>
            <div>
              Balance: {} {stream.token.symbol}{' '}
            </div>
            <div>
              Started: {} {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()}{' '}
            </div>
            <div>
              Expires: {} {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}{' '}
            </div>
          </div>
        ) : (
          <div>
            <i>No stream found..</i>
          </div>
        )}
      </div>
    </>
  )
}
export default StreamDetails
