import { GenericTable, Link } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { gql, request } from 'graphql-request'
import React, { useMemo, useState } from 'react'

import { FilterButton } from './FilterButton'
import { KpiCard } from './KpiCard'
import { ExternalLinkIcon } from '@heroicons/react/outline'

type TokenHolder = {
  id: string
  rank: number
  name: string
  quantity: number
  ownership: number
  value: number
}

const columnHelper = createColumnHelper<TokenHolder>()

const columns = [
  columnHelper.accessor('rank', {
    id: 'rank',
    header: 'Rank',
    cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
    size: 50,
  }),
  columnHelper.accessor('name', {
    id: 'name',
    header: () => <span>Name</span>,
    cell: (info) => (
      <Link.External
        href={`https://etherscan.io/address/${info.getValue()}`}
        endIcon={<ExternalLinkIcon className="h-5 w-5" strokeWidth={3} />}
        className="gap-2 font-bold"
      >
        {info.getValue()}
      </Link.External>
    ),
    minSize: 200,
  }),
  columnHelper.accessor('quantity', {
    header: () => 'Quantity',
    cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
  }),
  columnHelper.accessor('ownership', {
    header: () => <span>Ownership</span>,
    cell: (info) => <span className="text-slate-300">{info.getValue()}%</span>,
  }),
  columnHelper.accessor('value', {
    header: 'Value',
  }),
]

const TOKEN_HOLDER_FILTERS = [1, 1_000, 10_000, 100_000]

const query = gql`
  query ($orderBy: User_orderBy, $where: User_filter, $orderDirection: OrderDirection) {
    sushi(id: "Sushi") {
      userCount
      totalSupply
    }
    users(first: 10, orderBy: $orderBy, where: $where, orderDirection: $orderDirection) {
      balance
      id
    }
  }
`

async function getTokenHolders(balanceFilter: number) {
  return request('https://api.thegraph.com/subgraphs/name/olastenberg/sushi', query, {
    orderBy: 'balance',
    orderDirection: 'desc',
    where: {
      balance_gt: balanceFilter,
    },
  })
}

function formatNumber(num: number) {
  if (Math.abs(num) < 1_000) {
    return num // Return the number itself if it's less than 1,000
  }

  const units = ['k', 'M', 'G', 'T', 'P']
  const exponent = Math.floor(Math.log10(Math.abs(num)) / 3)
  const unit = units[exponent - 1]
  const value = num / 1000 ** exponent

  return `${parseFloat(value.toFixed(1))}${unit}`
}

export function TokenHolders() {
  const [selectedFilter, setSelectedFilter] = useState(TOKEN_HOLDER_FILTERS[0])
  const { data: tokenHoldersData, isLoading } = useQuery(['token-holders', selectedFilter], () =>
    getTokenHolders(selectedFilter)
  )
  const sushiPrice = 1.2
  const sushiData = tokenHoldersData?.sushi
  const userCount: string = sushiData?.userCount ?? '0'
  const totalSupply: number = Math.trunc(+sushiData?.totalSupply ?? 0) / 1e18

  const users = useMemo(
    () =>
      tokenHoldersData?.users.map((user, i) => {
        const balance = Math.trunc(+user.balance) / 1e18

        return {
          id: user.id,
          rank: i + 1,
          name: `${user.id.slice(0, 4)}...${user.id.slice(user.id.length - 3)}`,
          quantity: balance.toLocaleString('EN', {
            maximumFractionDigits: 0,
          }),
          ownership: (balance / totalSupply).toLocaleString('EN', {
            maximumFractionDigits: 2,
          }),
          value: (balance * sushiPrice).toLocaleString('EN', {
            maximumFractionDigits: 0,
            style: 'currency',
            currency: 'USD',
          }),
        }
      }) ?? [],
    [tokenHoldersData?.users, totalSupply]
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const holderSnapshot = [
    {
      title: 'Community Participants',
      value: '20.12k',
      additional: (
        // TODO: dynamic
        <dd className="text-sm text-green-400">+33.42% from last quarter</dd>
      ),
    },
    {
      title: 'Token Concentration',
      value: '20.12%',
      additional: <dd className="text-sm text-green-400">+33.42% from last quarter</dd>,
    },
    {
      title: 'Token Holders',
      value: formatNumber(+userCount),
      additional: (
        // TODO: dynamic
        <dd className="text-sm text-red-400">-3.42% from last quarter</dd>
      ),
    },
  ]

  return (
    <section className="space-y-14">
      <div className="space-y-8">
        <h2 className="pl-1 text-2xl font-bold text-slate-200">Holder Snapshot</h2>
        <div className="grid grid-cols-3 gap-4">{holderSnapshot.map(KpiCard)}</div>
      </div>

      <div className="space-y-8">
        <h2 className="pl-1 text-2xl font-bold text-slate-200">All Holders</h2>
        <div className="space-y-6">
          <div className="flex gap-2">
            {TOKEN_HOLDER_FILTERS.map((filter, index) => (
              <FilterButton
                onClick={() => setSelectedFilter(filter)}
                isActive={selectedFilter === filter}
                key={filter}
              >{`>=${index ? filter / 1000 + 'K' : filter} $SUSHI`}</FilterButton>
            ))}
          </div>
          <div>
            <GenericTable<TokenHolder>
              loading={isLoading}
              table={table}
              placeholder={'hey'}
              pageSize={Math.max(users.length, 5)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
