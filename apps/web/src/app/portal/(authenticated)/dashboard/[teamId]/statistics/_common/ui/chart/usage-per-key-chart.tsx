'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import type { Timeframe } from '../constants'
import { BaseChart, type BaseChartBase } from './base-chart'

const timeframes = ['24h', '7d', '30d'] as const

export function UsagePerKeyChart({ teamId }: { teamId: string }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h')

  const client = useStyroClient(true)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['portal-getTeamsTeamIdStatisticsUsagePerKey', teamId, timeframe],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdStatisticsUsagePerKey({
        teamId,
        type: timeframe,
      })

      return response.data
    },
  })

  const formatted = useMemo(
    () =>
      data?.team.usagePerKey.data.map((item) => ({
        name: item.key.name,
        data: item.data,
      })) || [],
    [data],
  )

  const baseProps = useMemo<BaseChartBase<typeof timeframes>>(
    () => ({
      title: 'Usage per key',
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
        start: data.team.usagePerKey.meta.start,
        end: data.team.usagePerKey.meta.end,
      }}
      total={data.team.usagePerKey.total}
      data={formatted}
    />
  )
}
