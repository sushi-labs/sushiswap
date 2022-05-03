import { FC } from 'react'
import { LinearGradient } from '@visx/gradient'
import { Stream } from 'features/context'
import { Typography } from '@sushiswap/ui/typography/Typography'
import { useStreamBalance } from 'hooks'

interface Props {
  stream?: Stream
}

const StreamProgress: FC<Props> = ({ stream }) => {
  const balance = useStreamBalance(stream?.id, stream?.token)
  const svgWidth = 336

  return (
    <div className="space-y-4">
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
      <svg width={svgWidth} height={24}>
        <LinearGradient id="gblue" from="#1398ED" to="#5CB0E4" vertical={false} />
        <LinearGradient id="gpink" from="#FFA6E7" to="#f43fc5" vertical={false} />
        <rect rx={12} x={0} width={svgWidth} y={0} height={24} fill="currentColor" className="text-dark-800" />
        <rect
          rx={12}
          x={0}
          width={
            (Number(stream?.streamedAmount) / (Number(stream?.streamedAmount) + Number(stream?.unclaimableAmount))) *
            svgWidth
          }
          y={0}
          height={24}
          fill="url(#gblue)"
        />
        <rect
          rx={12}
          x={0}
          width={(Number(stream?.withdrawnAmount.toExact()) / Number(stream?.amount.toExact())) * svgWidth}
          y={0}
          height={24}
          fill="url(#gpink)"
        />
      </svg>
    </div>
  )
}

export default StreamProgress
