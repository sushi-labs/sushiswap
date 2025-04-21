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
  StyroResults['getTeamsTeamIdStatisticsUsagePerIp']['data']['team']['usagePerIp']['data'][number]

const columns = [
  {
    header: 'IP',
    accessorFn: (row) => row.ip,
    enableSorting: false,
    cell: ({ row }) => {
      const { ip } = row.original
      return <span className="whitespace-nowrap">{ip}</span>
    },
  },
  {
    header: 'Requests',
    id: 'usage',
    accessorFn: (row) => row.usage,
    enableSorting: false,
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

export function UsagePerIpTable({ teamId }: UsagePerIpTable) {
  const client = useStyroClient(true)

  const [timeframe, setTimeframe] = useState<Timeframe>('7d')

  const { data, isLoading } = useQuery({
    queryKey: ['portal-getTeamsTeamIdStatisticsUsagePerIp', teamId, timeframe],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdStatisticsUsagePerIp({
        teamId,
        type: timeframe,
      })

      return response.data.team.usagePerIp.data
    },
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex !flex-row justify-between w-full">
          <div className="space-y-1.5">
            <CardTitle>Usage per IP</CardTitle>
            <CardDescription>Request count by IP addresses</CardDescription>
          </div>
          <Select
            onValueChange={(t) => setTimeframe(t as Timeframe)}
            value={timeframe}
          >
            <SelectTrigger className="max-w-[160px]">
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
