import { LinearGradient } from '@visx/gradient'
import { useStreamBalance } from 'hooks'
import { Amount, Token } from '@sushiswap/currency'
import { FC, useCallback, useEffect, useState } from 'react'
import { Stream } from 'features/context'
import { ZERO } from '@sushiswap/core-sdk'

interface Props {
  stream: Stream
  withdrawHovered: boolean
  setWithdrawHovered(x: boolean): void
}

const BalanceChart: FC<Props> = ({ stream, withdrawHovered, setWithdrawHovered }) => {
  const balance = useStreamBalance(stream.id)
  const [formattedBalance, setFormattedBalance] = useState<Amount<Token>>(null)

  const dashArray = useCallback(({ radius, streamedPct }) => {
    return streamedPct * 2 * radius * Math.PI
  }, [])

  const width = 420
  const strokeWidth = 16
  const outerRadius = width / 2 - strokeWidth
  const innerRadius = width / 2 - 3 * strokeWidth

  useEffect(() => {
    if (!balance || !stream) return

    setFormattedBalance(Amount.fromRawAmount(stream.token, balance.toString()))
  }, [balance, stream])

  return (
    <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
      <LinearGradient id="unfilled" to="#2022314D" from="#2022314D" vertical={false} />
      <LinearGradient id="gblue" to={'#1398ED'} from={'#5CB0E4'} vertical={false} />
      <LinearGradient id="gpink" to={'#FFA6E7'} from={'#f43fc5'} vertical={false} />

      <g
        stroke="currentColor"
        className="hover:drop-shadow-[0px_0px_4px_rgba(39,_176,_230,_0.2)] text-dark-700 hover:text-dark-600 cursor-pointer"
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
            streamedPct: +stream?.streamedAmount / (+stream?.streamedAmount + +stream?.unclaimableAmount),
          })}, ${Math.PI * outerRadius * 2}`}
          fill="none"
          strokeWidth={16}
          strokeLinecap="round"
          strokeDashoffset={
            dashArray({
              radius: outerRadius,
              streamedPct: +stream?.streamedAmount / (+stream?.streamedAmount + +stream?.unclaimableAmount),
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
        className="text-dark-700 hover:text-dark-600 cursor-pointer hover:drop-shadow-[0px_0px_4px_rgba(250,_82,_160,_0.2)]"
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
            streamedPct: +stream.withdrawnAmount.toExact() / +stream.amount.toExact(),
          })}, ${Math.PI * innerRadius * 2}`}
          strokeDashoffset={
            dashArray({
              radius: innerRadius,
              streamedPct: +stream.withdrawnAmount.toExact() / +stream.amount.toExact(),
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
            fontFamily="DM Sans"
            fontSize={12}
            x={width / 2}
            y={width / 2}
            letterSpacing="3"
            dy={-50}
            className="uppercase text-primary"
          >
            Withdrawn
          </text>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontWeight={700}
            fontFamily="DM Sans"
            fontSize={40}
            x={width / 2}
            y={width / 2}
            dy={10}
            className="text-high-emphesis"
          >
            {stream?.withdrawnAmount?.toSignificant(6).split('.')[0]}
            <tspan
              textAnchor="middle"
              fill="currentColor"
              fontWeight={700}
              fontSize={24}
              dx={2}
              className="text-primary"
            >
              .
              {stream?.withdrawnAmount.greaterThan(ZERO)
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
            className="text-primary"
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
            fontFamily="DM Sans"
            fontSize={12}
            x={width / 2}
            y={width / 2}
            letterSpacing="3"
            dy={-50}
            className="uppercase text-primary"
          >
            Streamed
          </text>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontWeight={700}
            fontFamily="DM Sans"
            fontSize={40}
            x={width / 2}
            y={width / 2}
            dy={10}
            className="text-high-emphesis"
          >
            {formattedBalance?.toSignificant(6).split('.')[0]}
            <tspan
              textAnchor="middle"
              fill="currentColor"
              fontWeight={700}
              fontSize={24}
              dx={2}
              className="text-primary"
            >
              .{formattedBalance?.greaterThan(ZERO) ? formattedBalance?.toSignificant(6).split('.')[1] : '000000'}
            </tspan>
          </text>
          <text
            textAnchor="middle"
            fill="currentColor"
            fontSize={14}
            dy={40}
            x={width / 2}
            y={width / 2}
            className="text-primary"
            fontWeight={700}
          >
            / {formattedBalance ? stream.amount.toExact() : '0'} {stream?.token.symbol} Total
          </text>
        </>
      )}
    </svg>
  )
}
export default BalanceChart
