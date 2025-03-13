'use client'

import { CheckIcon, XIcon } from '@heroicons/react-v1/solid'
import type { StyroClient, StyroResults } from '@sushiswap/styro-client'
import { DataTable, Explainer } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns/esm'
import { useMemo } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'

type TeamWithApiKeys = StyroResults['getTeamsTeamIdApiKeys']['data']['team']

export type ApiKey = TeamWithApiKeys['apiKeys'][number]

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
    enableSorting: false,
    cell: ({ row }) =>
      row.original.apiKey.rateLimit.perSecond
        ? `${row.original.apiKey.rateLimit.perSecond} req/s`
        : 'Unset',
  },
  {
    header: 'IP',
    id: 'ipConfig',
    accessorFn: (row) => row.apiKey.ipConfig,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="space-x-1 flex flex-row items-center">
        <div>
          {row.original.apiKey.ipConfig.whitelist.enabled ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XIcon className="h-5 w-5 text-red-500" />
          )}
        </div>
        <span>/</span>
        <div>
          {row.original.apiKey.ipConfig.blacklist.enabled ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XIcon className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>
    ),
    size: 66,
    meta: {
      header: {
        description: 'Whether the IP-based whitelist / blacklist is enabled.',
      },
    },
  },
  {
    header: 'Origin',
    id: 'originConfig',
    accessorFn: (row) => row.apiKey.originConfig,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="space-x-1 flex flex-row items-center">
        <div>
          {row.original.apiKey.originConfig.whitelist.enabled ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XIcon className="h-5 w-5 text-red-500" />
          )}
        </div>
        <span>/</span>
        <div>
          {row.original.apiKey.originConfig.blacklist.enabled ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XIcon className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>
    ),
    size: 66,
    meta: {
      header: {
        description:
          'Whether the origin-based whitelist / blacklist is enabled.',
      },
    },
  },
  {
    header: 'Last Updated',
    accessorFn: (row) => row.apiKey.updatedAt,
    enableSorting: false,
    cell: ({ row }) =>
      formatDistanceToNow(row.original.apiKey.updatedAt, { addSuffix: true }),
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

  const formatted = useMemo(() => {
    if (!data) return []

    return data.apiKeys.map<TeamWithApiKey>((apiKey) => ({
      id: data.id,
      apiKey,
    }))
  }, [data])

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
