'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { EvmChain } from 'sushi/chain'
import type { Timeframe } from '../constants'
import { BaseChart, type BaseChartBase } from './base-chart'

const timeframes = ['24h', '7d', '30d'] as const

export function UsagePerChainChart({ teamId }: { teamId: string }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h')

  const client = useStyroClient(true)

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'portal-getTeamsTeamIdStatisticsUsagePerChain',
      teamId,
      timeframe,
    ],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdStatisticsUsagePerChain({
        teamId,
        type: timeframe,
      })

      return response.data
    },
  })

  const formatted = useMemo(
    () =>
      data?.team.usagePerChain.data.map((item) => ({
        name: EvmChain.from(item.chainId)?.name || String(item.chainId),
        data: item.data,
      })) || [],
    [data],
  )

  const baseProps = useMemo<BaseChartBase<typeof timeframes>>(
    () => ({
      title: 'Usage per chain',
      timeframes,
      selectedTimeframe: timeframe,
      setTimeframe: (value) => {
        setTimeframe(value)
      },
    }),
    [timeframe],
  )

  if (isLoading) {
    return <BaseChart {...baseProps} loading />
  }

  if (isError || !data) {
    return <BaseChart {...baseProps} error />
  }

  return (
    <BaseChart
      {...baseProps}
      key={timeframe}
      meta={{
        start: data.team.usagePerChain.meta.start,
        end: data.team.usagePerChain.meta.end,
      }}
      total={data.team.usagePerChain.total}
      data={formatted}
    />
  )
}
