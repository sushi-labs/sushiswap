import { LinearGradient } from '@visx/gradient'
import { useStreamBalance } from 'hooks'
import { Amount, Token } from '@sushiswap/currency'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Stream } from 'features/context'

interface Props {
  stream: Stream
}
const BalanceChart: FC<Props> = (props) => {
  const stream = props.stream
  const [formattedBalance, setFormattedBalance] = useState<Amount<Token>>(null)
  const [streamed, setStreamed] = useState([])
  const [withdrawn, setWithdrawn] = useState([])
  const balance = useStreamBalance(stream.id)

  const dashArray = useCallback(({ radius, streamedPct }) => {
    return streamedPct * 2 * radius * Math.PI
  }, [])

  const width = 420
  const strokeWidth = 16
  const outerRadius = width / 2 - strokeWidth
  const innerRadius = width / 2 - 3 * strokeWidth

  useEffect(() => {
    if (!balance || !stream) {
      return
    }
    setFormattedBalance(Amount.fromRawAmount(stream.token, balance.toString()))
  }, [balance, stream])

  useEffect(() => {
    if (stream) {
      setStreamed([
        {
          type: 'Streamed',
          amount: stream?.streamedAmount,
          color: '#1398ED',
        },
        {
          type: 'Not streamed',
          amount: stream?.unclaimableAmount,
          color: '#1398ED',
          opacity: '0%',
        },
      ])
      setWithdrawn([
        {
          type: 'Withdrawn',
          amount: stream.withdrawnAmount.toExact(),
          color: '#f43fc5',
          opacity: '100%',
        },
        {
          type: 'Not available',
          amount: stream.amount.subtract(stream.withdrawnAmount).toExact(),
          color: '#f43fc5',
          opacity: '0%',
        },
      ])
    }
  }, [stream])

  if (!streamed) {
    return
  }

  return (
    <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
      <circle cx={width / 2} cy={width / 2} r={outerRadius} stroke="url('#unfilled')" fill="none" strokeWidth={16} />
      <circle cx={width / 2} cy={width / 2} r={innerRadius} stroke="url('#unfilled')" fill="none" strokeWidth={16} />
      <circle
        cx={width / 2}
        cy={width / 2}
        r={innerRadius + strokeWidth / 2}
        stroke="#2E3348"
        fill="none"
        strokeWidth={1}
      />
      <circle
        cx={width / 2}
        cy={width / 2}
        r={innerRadius - strokeWidth / 2}
        stroke="#2E3348"
        fill="none"
        strokeWidth={1}
      />

      <circle
        cx={width / 2}
        cy={width / 2}
        r={outerRadius + strokeWidth / 2}
        stroke="#2E3348"
        fill="none"
        strokeWidth={1}
      />
      <circle
        cx={width / 2}
        cy={width / 2}
        r={outerRadius - strokeWidth / 2}
        stroke="#2E3348"
        fill="none"
        strokeWidth={1}
      />

      <LinearGradient id="unfilled" to="#2022314D" from="#2022314D" vertical={false} />
      <LinearGradient id="gblue" to={'#1398ED'} from={'#5CB0E4'} vertical={false} />
      <LinearGradient id="gpink" to={'#FFA6E7'} from={'#f43fc5'} vertical={false} />
      <g
        width={width}
        height={width}
        strokeDasharray={`${dashArray({
          radius: outerRadius,
          streamedPct: +stream?.streamedAmount / (+stream?.streamedAmount + +stream?.unclaimableAmount),
        })}, ${Math.PI * outerRadius}`}
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
      <g
        width={width}
        height={width}
        strokeDasharray={`${dashArray({
          radius: innerRadius,
          streamedPct: +stream.withdrawnAmount.toExact() / +stream.amount.toExact(),
        })}, ${Math.PI * innerRadius}`}
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
    </svg>
  )

  // return (
  //   <svg width={width} height={width}>
  //     <LinearGradient id="gblue" from={'#1398ED'} to={'#5CB0E4'} vertical={false} />
  //     <LinearGradient id="gpink" from={'#FFA6E7'} to={'#f43fc5'} vertical={false} />
  //     <Group top={half} left={half}>
  //       <Pie
  //         data={streamed}
  //         pieSort={null}
  //         pieValue={(data) => data.amount}
  //         startOffset={0}
  //         outerRadius={half}
  //         innerRadius={() => {
  //           const size = 10
  //           return half - size
  //         }}
  //         cornerRadius={3}
  //         padAngle={0.005}
  //       >
  //         {(pie) => {
  //           return pie.arcs.map((arc) => {
  //             return (
  //               <g key={arc.data.type} onMouseEnter={() => setActive(arc.data)} onMouseLeave={() => setActive(null)}>
  //                 <path d={pie.path(arc)} fill={color(0)} opacity={arc.data.opacity} />
  //               </g>
  //             )
  //           })
  //         }}
  //       </Pie>
  //       <Pie
  //         data={withdrawn}
  //         pieSort={null}
  //         startOffset={0}
  //         pieValue={(data) => data.amount}
  //         outerRadius={half * 0.87}
  //         innerRadius={() => {
  //           const size = 15
  //           return half - size
  //         }}
  //         cornerRadius={3}
  //         padAngle={0.05}
  //       >
  //         {(pie) => {
  //           return pie.arcs.map((arc) => {
  //             return (
  //               <g key={arc.data.type} onMouseEnter={() => setActive(arc.data)} onMouseLeave={() => setActive(null)}>
  //                 <path d={pie.path(arc)} fill={color(1)} opacity={arc.data.opacity} />
  //               </g>
  //             )
  //           })
  //         }}
  //       </Pie>
  //
  //       {active ? (
  //         <>
  //           <Text textAnchor="middle" fill="#fff" fontSize={40} dy={-20}>
  //             {active.type == 'Withdrawn'
  //               ? `${stream?.withdrawnAmount.toExact()} ${stream?.token.symbol}`
  //               : `${stream?.amount.toExact()} ${stream?.token.symbol}`}
  //           </Text>
  //           <Text textAnchor="middle" fill={active.color} fontSize={20} dy={20}>
  //             {active?.type}
  //           </Text>
  //         </>
  //       ) : (
  //         <>
  //           <Text textAnchor="middle" fill="#fff" fontSize={40} dy={-20}>
  //             {`${formattedBalance ? formattedBalance.toSignificant(6) : '0'} ${stream?.token.symbol}`}
  //           </Text>
  //           <Text textAnchor="middle" fill="#aaa" fontSize={20} dy={20}>
  //             {`/ ${formattedBalance ? stream.amount.toExact() : '0'} ${stream?.token.symbol} Total`}
  //           </Text>
  //         </>
  //       )}
  //     </Group>
  //   </svg>
  // )
}
export default BalanceChart
