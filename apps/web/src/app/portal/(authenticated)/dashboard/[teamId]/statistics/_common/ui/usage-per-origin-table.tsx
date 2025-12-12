'use client'

import type { StyroResults } from '@sushiswap/styro-client'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { useState } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import {
  type Timeframe,
  possibleTimeframes,
  timeframeStrings,
} from './constants'

interface UsagePerIpTable {
  teamId: string
}

type IpEntry =
  StyroResults['getTeamsTeamIdStatisticsUsagePerOrigin']['data']['team']['usagePerOrigin']['data'][number]

const columns = [
  {
    header: 'Origin',
    accessorFn: (row) => row.origin,
    enableSorting: false,
    cell: ({ row }) => {
      const { origin } = row.original
      return <span className="whitespace-nowrap">{origin}</span>
    },
  },
  {
    header: 'Requests',
    id: 'usage',
    accessorFn: (row) => row.usage,
    cell: ({ row }) => {
      return (
        <span className="whitespace-nowrap flex justify-end">
          {row.original.usage.toLocaleString(undefined, {
            trailingZeroDisplay: 'stripIfInteger',
          })}
        </span>
      )
    },
    meta: {
      header: {
        className: 'text-right',
      },
    },
  },
] as ColumnDef<IpEntry, unknown>[]

const sorting = [
  {
    id: 'usage',
    desc: true,
  },
] as SortingState

export function UsagePerOriginTable({ teamId }: UsagePerIpTable) {
  const client = useStyroClient(true)

  const [timeframe, setTimeframe] = useState<Timeframe>('7d')

  const { data, isLoading } = useQuery({
    queryKey: [
      'portal-getTeamsTeamIdStatisticsUsagePerOrigin',
      teamId,
      timeframe,
    ],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdStatisticsUsagePerOrigin({
        teamId,
        type: timeframe,
      })

      return response.data.team.usagePerOrigin.data
    },
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:!flex-row justify-between w-full gap-y-4">
          <div className="space-y-1.5">
            <CardTitle>Usage per Origin</CardTitle>
            <CardDescription>Request count by request origin</CardDescription>
          </div>
          <Select
            onValueChange={(t) => setTimeframe(t as Timeframe)}
            value={timeframe}
          >
            <SelectTrigger className="sm:max-w-[160px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {possibleTimeframes.map((timeframe) => (
                <SelectItem key={timeframe} value={timeframe}>
                  {timeframeStrings[timeframe]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <DataTable
        state={{ sorting }}
        data={data || []}
        loading={isLoading}
        columns={columns}
      />
    </Card>
  )
}
