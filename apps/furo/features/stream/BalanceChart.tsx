import { ZERO } from '@sushiswap/math'
import { classNames } from '@sushiswap/ui'
import { LinearGradient } from '@visx/gradient'
import { Stream } from 'features/context'
import { FC, useCallback } from 'react'

import { BalanceChartHoverEnum } from '../../pages/stream/[id]'

interface Props {
  stream?: Stream
  hover?: BalanceChartHoverEnum
  setHover?(x: BalanceChartHoverEnum): void
}

const BalanceChart: FC<Props> = ({ stream, hover = BalanceChartHoverEnum.NONE, setHover }) => {
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
        className={classNames(
          hover === BalanceChartHoverEnum.STREAMED
            ? 'text-slate-600 drop-shadow-[0px_0px_2px_rgba(39,_176,_230,_0.6)]'
            : '',
          'text-slate-700 cursor-pointer'
        )}
        onMouseEnter={() => setHover && setHover(BalanceChartHoverEnum.STREAMED)}
        onMouseLeave={() => setHover && setHover(BalanceChartHoverEnum.NONE)}
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
            streamedPct: Number(stream?.streamedPercentage?.divide(100).toSignificant(4)),
          })}, ${Math.PI * outerRadius * 2}`}
          fill="none"
          strokeWidth={16}
          strokeLinecap="round"
          strokeDashoffset={
            dashArray({
              radius: outerRadius,
              streamedPct: Number(stream?.streamedPercentage?.divide(100).toSignificant(4)),
            }) / 1.5
          }
          transform="translate(0 420) rotate(-90)"
          className="drop-shadow-[0px_0px_6px_rgba(39,_176,_230,_0.37)] animate-[dash_1s_ease-in-out_forwards]"
        >
          <circle cx={width / 2} cy={width / 2} r={outerRadius} stroke="url('#gblue')" />
        </g>
      </g>
      <g
        stroke="currentColor"
        className={classNames(
          hover === BalanceChartHoverEnum.WITHDRAW
            ? 'text-slate-600 drop-shadow-[0px_0px_2px_rgba(250,_82,_160,_0.6)]'
            : '',
          'text-slate-700 cursor-pointer'
        )}
        onMouseEnter={() => setHover && setHover(BalanceChartHoverEnum.WITHDRAW)}
        onMouseLeave={() => setHover && setHover(BalanceChartHoverEnum.NONE)}
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
          onMouseEnter={() => setHover && setHover(BalanceChartHoverEnum.WITHDRAW)}
          onMouseLeave={() => setHover && setHover(BalanceChartHoverEnum.NONE)}
          width={width}
          height={width}
          strokeDasharray={`${dashArray({
            radius: innerRadius,
            streamedPct: Number(stream?.withdrawnPercentage.divide(100).toSignificant(4)),
          })}, ${Math.PI * innerRadius * 2}`}
          strokeDashoffset={
            dashArray({
              radius: innerRadius,
              streamedPct: Number(stream?.withdrawnPercentage.divide(100).toSignificant(4)),
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

      {hover === BalanceChartHoverEnum.NONE && (
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
            className="uppercase text-slate-200"
          >
            Available
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
            className="text-slate-50"
          >
            {stream?.balance?.toSignificant(6).split('.')[0]}
            <tspan
              textAnchor="middle"
              fill="currentColor"
              fontWeight={700}
              fontSize={24}
              dx={2}
              className="text-slate-300"
            >
              .{stream?.balance?.greaterThan(ZERO) ? stream?.balance.toSignificant(6).split('.')[1] : '000000'}
            </tspan>
          </text>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontSize={14}
            dy={40}
            x={width / 2}
            y={width / 2}
            className="text-slate-500"
            fontWeight={700}
          >
            / {stream?.withdrawnAmount ? stream.amount.toExact() : '0.000'} {stream?.token.symbol} Total
          </text>
        </>
      )}

      {hover === BalanceChartHoverEnum.WITHDRAW && (
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
            className="text-slate-50"
          >
            {stream?.withdrawnAmount?.toFixed(6).split('.')[0]}
            <tspan
              textAnchor="middle"
              fill="currentColor"
              fontWeight={700}
              fontSize={24}
              dx={2}
              className="text-slate-300"
            >
              .{stream?.withdrawnAmount.greaterThan(0) ? stream?.withdrawnAmount.toFixed(6).split('.')[1] : '000000'}
            </tspan>
          </text>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontSize={14}
            dy={40}
            x={width / 2}
            y={width / 2}
            className="text-slate-500"
            fontWeight={700}
          >
            / {stream?.withdrawnAmount ? stream.amount.toExact() : '0'} {stream?.token.symbol} Total
          </text>
        </>
      )}
      {hover === BalanceChartHoverEnum.STREAMED && (
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
            className="text-slate-50"
          >
            {stream?.streamedAmount?.toFixed(6).split('.')[0]}
            <tspan
              textAnchor="middle"
              fill="currentColor"
              fontWeight={700}
              fontSize={24}
              dx={2}
              className="text-slate-300"
            >
              .{stream?.streamedAmount?.greaterThan(0) ? stream?.streamedAmount.toFixed(6).split('.')[1] : '000000'}
            </tspan>
          </text>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontSize={14}
            dy={40}
            x={width / 2}
            y={width / 2}
            className="text-slate-500"
            fontWeight={700}
          >
            / {stream?.balance ? stream?.amount.toExact() : '0'} {stream?.token.symbol} Total
          </text>
        </>
      )}
    </svg>
  )
}
export default BalanceChart
