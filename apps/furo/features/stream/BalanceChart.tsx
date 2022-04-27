import { Group } from '@visx/group'
import { Pie } from '@visx/shape'
import { Text } from '@visx/text'
import { Amount, Token } from 'currency'
import { Decimal, JSBI } from 'math'
import { FC, useEffect, useState } from 'react'
import { useContract, useContractRead, useSigner } from 'wagmi'
import FuroStreamABI from '../../abis/FuroStream.json'
import { Stream } from '../context/Stream'

interface Props {
  stream: Stream
}
const BalanceChart: FC<Props> = (props) => {
  const stream = props.stream
  const [balance, setBalance] = useState<Amount<Token>>(null)
  const [streamed, setStreamed] = useState([])
  const [withdrawn, setWithdrawn] = useState([])
  const [{ data: streamBalanceOf }] = useContractRead(
    {
      addressOrName: '0x2a214DF929fba60509Dc2a236376ac53453cf443',
      contractInterface: FuroStreamABI,
    },
    'streamBalanceOf',
    {
      args: [stream?.id],
      watch: true,
    },
  )

  useEffect(() => {
    if (!streamBalanceOf || !stream) {
      return
    }
    const fetchBalance = async () => {
      setBalance(Amount.fromRawAmount(stream.token, JSBI.BigInt(streamBalanceOf.recipientBalance.toString() ?? 0)))
    }
    fetchBalance()
  }, [streamBalanceOf, stream])

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

  const width = 420
  const half = width / 2
  const [active, setActive] = useState(null)

  if (!streamed) {
    return
  }

  return (
    <svg width={width} height={width}>
      <Group top={half} left={half}>
        <Pie
          data={streamed}
          pieSort={null}
          pieValue={(data) => data.amount}
          startOffset={0}
          outerRadius={half}
          innerRadius={() => {
            const size = 10
            return half - size
          }}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => {
            return pie.arcs.map((arc) => {
              return (
                <g key={arc.data.type} onMouseEnter={() => setActive(arc.data)} onMouseLeave={() => setActive(null)}>
                  <path d={pie.path(arc)} fill={arc.data.color} opacity={arc.data.opacity} />
                </g>
              )
            })
          }}
        </Pie>
        <Pie
          data={withdrawn}
          pieSort={null}
          startOffset={0}
          pieValue={(data) => data.amount}
          outerRadius={half * 0.87}
          innerRadius={() => {
            const size = 15
            return half - size
          }}
          cornerRadius={3}
          padAngle={0.05}
        >
          {(pie) => {
            return pie.arcs.map((arc) => {
              return (
                <g key={arc.data.type} onMouseEnter={() => setActive(arc.data)} onMouseLeave={() => setActive(null)}>
                  <path d={pie.path(arc)} fill={arc.data.color} opacity={arc.data.opacity} />
                </g>
              )
            })
          }}
        </Pie>

        {active ? (
          <>
            <Text textAnchor="middle" fill="#fff" fontSize={40} dy={-20}>
              {active.type == 'Withdrawn'
                ? `${stream?.withdrawnAmount.toExact()} ${stream?.token.symbol}`
                : `${stream?.amount.toExact()} ${stream?.token.symbol}`}
            </Text>
            <Text textAnchor="middle" fill={active.color} fontSize={20} dy={20}>
              {active?.type}
            </Text>
          </>
        ) : (
          <>
            <Text textAnchor="middle" fill="#fff" fontSize={40} dy={-20}>
              {`${balance ? balance.toSignificant() : '0'} ${stream?.token.symbol}`}
            </Text>
            <Text textAnchor="middle" fill="#aaa" fontSize={20} dy={20}>
              {`/ ${balance ? stream.amount.toExact() : '0'} ${stream?.token.symbol} Total`}
            </Text>
          </>
        )}
      </Group>
    </svg>
  )
}
export default BalanceChart
