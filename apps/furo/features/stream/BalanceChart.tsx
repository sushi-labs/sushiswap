import { LinearGradient } from '@visx/gradient'
import { Stream } from 'features/context'
import { useStreamBalance } from 'hooks'
import { FC, useCallback } from 'react'

interface Props {
  stream?: Stream
  withdrawHovered: boolean
  setWithdrawHovered(x: boolean): void
}

const BalanceChart: FC<Props> = ({ stream, withdrawHovered, setWithdrawHovered }) => {
  const balance = useStreamBalance(stream?.id, stream?.token)

  const dashArray = useCallback(({ radius, streamedPct }: { radius: number; streamedPct: number }) => {
    return Math.round(streamedPct * 2 * radius * Math.PI * 100) / 100
  }, [])

  const width = 420
  const strokeWidth = 16
  const outerRadius = width / 2 - strokeWidth
  const innerRadius = width / 2 - 3 * strokeWidth

  return (
    <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
      <LinearGradient id="unfilled" to="#2022314D" from="#2022314D" vertical={false} />
      <LinearGradient id="gblue" to={'#1398ED'} from={'#5CB0E4'} vertical={false} />
      <LinearGradient id="gpink" to={'#FFA6E7'} from={'#f43fc5'} vertical={false} />

      <g
        stroke="currentColor"
        className="hover:drop-shadow-[0px_0px_4px_rgba(39,_176,_230,_0.2)] text-slate-700 hover:text-slate-600 cursor-pointer"
      >
        <circle cx={width / 2} cy={width / 2} r={outerRadius} stroke="url('#unfilled')" fill="none" strokeWidth={16} />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={outerRadius + strokeWidth / 2}
          stroke="currentColor"
          fill="none"
          strokeWidth={1}
        />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={outerRadius - strokeWidth / 2}
          stroke="currentColor"
          fill="none"
          strokeWidth={1}
        />
        <g
          width={width}
          height={width}
          strokeDasharray={`${dashArray({
            radius: outerRadius,
            streamedPct:
              Number(stream?.streamedAmount) / (Number(stream?.streamedAmount) + Number(stream?.unclaimableAmount)),
          })}, ${Math.PI * outerRadius * 2}`}
          fill="none"
          strokeWidth={16}
          strokeLinecap="round"
          strokeDashoffset={
            dashArray({
              radius: outerRadius,
              streamedPct:
                Number(stream?.streamedAmount) / (Number(stream?.streamedAmount) + Number(stream?.unclaimableAmount)),
            }) / 1.5
          }
          transform="translate(0 420) rotate(-90)"
          className="drop-shadow-[0px_0px_4px_rgba(39,_176,_230,_0.67)] animate-[dash_1s_ease-in-out_forwards]"
        >
          <circle cx={width / 2} cy={width / 2} r={outerRadius} stroke="url('#gblue')" />
        </g>
      </g>
      <g
        stroke="currentColor"
        className="text-slate-700 hover:text-slate-600 cursor-pointer hover:drop-shadow-[0px_0px_4px_rgba(250,_82,_160,_0.2)]"
        onMouseEnter={() => setWithdrawHovered(true)}
        onMouseLeave={() => setWithdrawHovered(false)}
      >
        <circle cx={width / 2} cy={width / 2} r={innerRadius} stroke="url('#unfilled')" fill="none" strokeWidth={16} />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={innerRadius + strokeWidth / 2}
          stroke="currentColor"
          fill="none"
          strokeWidth={1}
        />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={innerRadius - strokeWidth / 2}
          stroke="currentColor"
          fill="none"
          strokeWidth={1}
        />
        <g
          onMouseEnter={() => setWithdrawHovered(true)}
          onMouseLeave={() => setWithdrawHovered(false)}
          width={width}
          height={width}
          strokeDasharray={`${dashArray({
            radius: innerRadius,
            streamedPct: Number(stream?.withdrawnAmount.toExact()) / Number(stream?.amount.toExact()),
          })}, ${Math.PI * innerRadius * 2}`}
          strokeDashoffset={
            dashArray({
              radius: innerRadius,
              streamedPct: Number(stream?.withdrawnAmount.toExact()) / Number(stream?.amount.toExact()),
            }) / 1.5
          }
          fill="none"
          strokeWidth={16}
          strokeLinecap="round"
          transform="translate(0 420) rotate(-90)"
          className="drop-shadow-[0px_0px_8px_rgba(250,_82,_160,_0.6)] animate-[dash_1s_ease-in-out_forwards]"
        >
          <circle cx={width / 2} cy={width / 2} r={innerRadius} stroke="url('#gpink')" />
        </g>
      </g>

      {withdrawHovered ? (
        <>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontFamily="Inter"
            fontSize={12}
            x={width / 2}
            y={width / 2}
            letterSpacing="3"
            dy={-50}
            className="uppercase text-slate-300"
          >
            Withdrawn
          </text>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontWeight={700}
            fontFamily="Inter"
            fontSize={40}
            x={width / 2}
            y={width / 2}
            dy={10}
            className="text-slate-200"
          >
            {stream?.withdrawnAmount?.toSignificant(6).split('.')[0]}
            <tspan
              textAnchor="middle"
              fill="currentColor"
              fontWeight={700}
              fontSize={24}
              dx={2}
              className="text-slate-300"
            >
              .
              {stream?.withdrawnAmount.greaterThan(0)
                ? stream?.withdrawnAmount.toSignificant(6).split('.')[1]
                : '000000'}
            </tspan>
          </text>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontSize={14}
            dy={40}
            x={width / 2}
            y={width / 2}
            className="text-slate-300"
            fontWeight={700}
          >
            / {stream?.withdrawnAmount ? stream.amount.toExact() : '0'} {stream?.token.symbol} Total
          </text>
        </>
      ) : (
        <>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontFamily="Inter"
            fontSize={12}
            x={width / 2}
            y={width / 2}
            letterSpacing="3"
            dy={-50}
            className="uppercase text-slate-300"
          >
            Streamed
          </text>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontWeight={700}
            fontFamily="Inter"
            fontSize={40}
            x={width / 2}
            y={width / 2}
            dy={10}
            className="text-slate-200"
          >
            {balance?.toSignificant(6).split('.')[0]}
            <tspan
              textAnchor="middle"
              fill="currentColor"
              fontWeight={700}
              fontSize={24}
              dx={2}
              className="text-slate-300"
            >
              .{balance?.greaterThan(0) ? balance?.toSignificant(6).split('.')[1] : '000000'}
            </tspan>
          </text>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontSize={14}
            dy={40}
            x={width / 2}
            y={width / 2}
            className="text-slate-300"
            fontWeight={700}
          >
            / {balance ? stream?.amount.toExact() : '0'} {stream?.token.symbol} Total
          </text>
        </>
      )}
    </svg>
  )
}
export default BalanceChart
