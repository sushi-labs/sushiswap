import { FC } from 'react'
import { Stream } from 'features/context/Stream'
import { LinearGradient } from '@visx/gradient'

interface Props {
  stream: Stream
}

const WithdrawProgressSVG: FC<Props> = ({ stream }) => {
  const svgWidth = 336

  return (
    <svg width={svgWidth} height={24}>
      <LinearGradient id="gblue" from="#1398ED" to="#5CB0E4" vertical={false} />
      <LinearGradient id="gpink" from="#FFA6E7" to="#f43fc5" vertical={false} />
      <rect rx={12} x={0} width={svgWidth} y={0} height={24} fill="currentColor" className="text-dark-800" />
      <rect
        rx={12}
        x={0}
        width={(+stream?.streamedAmount / (+stream?.streamedAmount + +stream?.unclaimableAmount)) * svgWidth}
        y={0}
        height={24}
        fill="url(#gblue)"
      />
      <rect
        rx={12}
        x={0}
        width={(+stream.withdrawnAmount.toExact() / +stream.amount.toExact()) * svgWidth}
        y={0}
        height={24}
        fill="url(#gpink)"
      />
    </svg>
  )
}

export default WithdrawProgressSVG
