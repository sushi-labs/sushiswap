import { Typography } from '@sushiswap/ui'
import { Stream } from 'features/context'
import { useStreamBalance } from 'hooks'
import { FC } from 'react'

interface Props {
  stream?: Stream
}

const StreamProgress: FC<Props> = ({ stream }) => {
  const balance = useStreamBalance(stream?.id, stream?.token)

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-1 pt-3">
        <div className="flex flex-col">
          <Typography variant="sm" weight={700}>
            {stream?.withdrawnAmount.toExact()} {stream?.token.symbol}
          </Typography>
          <Typography variant="xs" weight={500} className="text-pink">
            Already withdrawn
          </Typography>
        </div>
        <div className="flex flex-col items-end">
          <Typography variant="sm" weight={700}>
            {stream && balance ? stream.amount.subtract(balance).toExact() : ''} {stream?.token.symbol}
          </Typography>
          <Typography variant="xs" weight={500} className="text-blue">
            Not yet streamed
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default StreamProgress
