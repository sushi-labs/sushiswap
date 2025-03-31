'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { BaseChart, type Timeframe } from './base-chart'

const timeframes = ['24h', '7d', '30d'] as const

export function UsagePerKeyChart({ teamId }: { teamId: string }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h')

  const client = useStyroClient(true)

  const { data } = useQuery({
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

  if (!data) return null

  return (
    <BaseChart
      title="Usage per key"
      meta={{
        start: data?.team.usagePerKey.meta.start,
        end: data?.team.usagePerKey.meta.end,
      }}
      timeframes={timeframes}
      selectedTimeframe={timeframe}
      setTimeframe={setTimeframe}
      data={formatted}
    />
  )
}
