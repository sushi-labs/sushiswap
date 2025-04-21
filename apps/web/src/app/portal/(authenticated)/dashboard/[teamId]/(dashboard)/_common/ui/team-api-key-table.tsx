'use client'

import { CheckIcon, XIcon } from '@heroicons/react-v1/solid'
import { useIsMounted } from '@sushiswap/hooks'
import type { StyroResults } from '@sushiswap/styro-client'
import { DataTable, SkeletonText } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns/esm'
import { useMemo } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'

type TeamWithApiKeys = StyroResults['getTeamsTeamIdApiKeys']['data']['team']

type Stats = 'loading' | 'error' | number

export type ApiKey = TeamWithApiKeys['apiKeys'][number] & {
  statistics: {
    '24h': Stats
    '7d': Stats
  }
}

type TeamWithApiKey = Omit<TeamWithApiKeys, 'apiKeys'> & {
  apiKey: ApiKey
}

const columns = [
  {
    header: 'Name',
    accessorFn: (row) => row.apiKey.name,
    enableSorting: false,
  },
  {
    header: 'Rate Limit',
    accessorFn: (row) => row.apiKey.rateLimit.perSecond,
    cell: ({ row }) =>
      row.original.apiKey.rateLimit.perSecond
        ? `${row.original.apiKey.rateLimit.perSecond.toLocaleString()} req/s`
        : 'Unset',
  },
  {
    header: '24h Requests',
    id: 'stats24h',
    accessorFn: (row) => row.apiKey.statistics['24h'],
    cell: ({ row }) => {
      const stats = row.original.apiKey.statistics['24h']

      if (stats === 'loading') {
        return <SkeletonText fontSize="default" />
      }

      if (stats === 'error') {
        return <span className="text-red-500">Error</span>
      }

      return (
        <span className="whitespace-nowrap">
          {stats.toLocaleString(undefined, {
            trailingZeroDisplay: 'stripIfInteger',
          })}
        </span>
      )
    },
  },
  {
    header: '7d Requests',
    id: 'stats7d',
    accessorFn: (row) => row.apiKey.statistics['7d'],
    cell: ({ row }) => {
      const stats = row.original.apiKey.statistics['7d']

      if (stats === 'loading') {
        return <SkeletonText fontSize="default" />
      }

      if (stats === 'error') {
        return <span className="text-red-500">Error</span>
      }

      return (
        <span className="whitespace-nowrap">
          {stats.toLocaleString(undefined, {
            trailingZeroDisplay: 'stripIfInteger',
          })}
        </span>
      )
    },
  },
  {
    header: 'Last Updated',
    accessorFn: (row) => row.apiKey.updatedAt,
    cell: ({ row }) => {
      const isMounted = useIsMounted()

      // Prevent hydration error
      if (!isMounted) {
        return <></>
      }

      return (
        <span className="whitespace-nowrap">
          {formatDistanceToNow(row.original.apiKey.updatedAt, {
            addSuffix: true,
          })}
        </span>
      )
    },
  },
  {
    header: 'Active',
    accessorFn: (row) => row.apiKey.enabled,
    enableSorting: false,
    cell: ({ row }) => {
      if (row.original.apiKey.enabled) {
        return <CheckIcon className="h-5 w-5 text-green-500" />
      }
      return <XIcon className="h-5 w-5 text-red-500" />
    },
    meta: {
      header: {
        className: 'text-right',
      },
      body: {
        className: 'flex justify-end',
      },
    },
  },
] as ColumnDef<TeamWithApiKey, unknown>[]

export function TeamApiKeyTable({ teamId }: { teamId: string }) {
  const client = useStyroClient(true)

  const { data, isLoading } = useQuery({
    queryKey: ['portal-getTeamsTeamIdApiKeys', teamId],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdApiKeys({
        teamId,
      })

      return response.data.team
    },
  })

  const { data: stats24h, isLoading: isStats24hLoading } = useQuery({
    queryKey: ['portal-getTeamsTeamIdStatisticsUsagePerKey', teamId, '24h'],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdStatisticsUsagePerKey({
        teamId,
        type: '24h',
      })

      return response.data.team.usagePerKey.data.map((entry) => ({
        id: entry.key.id,
        total: entry.data.reduce((acc, cur) => acc + cur.value, 0),
      }))
    },
  })

  const { data: stats7d, isLoading: isStats7dLoading } = useQuery({
    queryKey: ['portal-getTeamsTeamIdStatisticsUsagePerKey', teamId, '7d'],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdStatisticsUsagePerKey({
        teamId,
        type: '7d',
      })

      return response.data.team.usagePerKey.data.map((entry) => ({
        id: entry.key.id,
        total: entry.data.reduce((acc, cur) => acc + cur.value, 0),
      }))
    },
  })

  const formatted = useMemo(() => {
    if (!data) return []

    return data.apiKeys.map<TeamWithApiKey>((apiKey) => {
      const getStats = (data: typeof stats7d, isLoading: boolean): Stats => {
        if (isLoading) return 'loading'
        if (!data) return 'error'
        return data.find((key) => key.id === apiKey.id)?.total || 0
      }

      return {
        id: data.id,
        apiKey: {
          ...apiKey,
          statistics: {
            '24h': getStats(stats24h, isStats24hLoading),
            '7d': getStats(stats7d, isStats7dLoading),
          },
        },
      }
    })
  }, [data, stats24h, isStats24hLoading, stats7d, isStats7dLoading])

  return (
    <DataTable
      columns={columns}
      data={formatted}
      loading={isLoading}
      linkFormatter={(row) =>
        `/portal/dashboard/${teamId}/api-keys/${row.apiKey.id}`
      }
    />
  )
}
