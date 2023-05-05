import { ExternalLinkIcon } from '@heroicons/react/outline'
import { GenericTable, Link } from '@sushiswap/ui'
import { useQueries } from '@tanstack/react-query'
import { createColumnHelper, getCoreRowModel, SortDirection, useReactTable } from '@tanstack/react-table'
import { gql, request } from 'graphql-request'
import React, { useMemo, useReducer, useState } from 'react'

import { formatNumber, getSushiPriceUSD } from '../lib/api'
import { FilterButton } from './FilterButton'
import { KpiCard } from './KpiCard'

type TokenHolder = {
  id: string
  rank: number
  name: string
  quantity: number
  ownership: number
  value: number
}

interface UserGraphRes {
  balance: string
  id: string
}

interface TokenHoldersFilters {
  balanceFilter: number
  orderDirection: SortDirection
}

interface BalanceFilterAction {
  type: 'balanceFilter'
  payload: number
}

interface SortAction {
  type: 'sort'
  payload: false | SortDirection
}

const columnHelper = createColumnHelper<TokenHolder>()

const TOKEN_HOLDER_FILTERS = [1, 1_000, 10_000, 100_000]

const query = gql`
  query TokenHolders($where: User_filter, $orderDirection: OrderDirection) {
    sushi(id: "Sushi") {
      userCount
      totalSupply
    }
    users(first: 10, orderBy: "balance", where: $where, orderDirection: $orderDirection) {
      balance
      id
    }
  }
`

async function getTokenHolders({ balanceFilter, orderDirection }) {
  return request('https://api.thegraph.com/subgraphs/name/olastenberg/sushi', query, {
    orderDirection,
    where: {
      balance_gt: balanceFilter,
    },
  })
}

function reducer(state: TokenHoldersFilters, action: BalanceFilterAction | SortAction) {
  switch (action.type) {
    case 'balanceFilter':
      return {
        ...state,
        balanceFilter: action.payload,
      }
    default:
    case 'sort':
      return {
        ...state,
        orderDirection: action.payload === 'desc' ? 'asc' : ('desc' as SortDirection),
      }
  }
}

const INITIAL_STATE: TokenHoldersFilters = {
  balanceFilter: TOKEN_HOLDER_FILTERS[0],
  orderDirection: 'desc',
}

export function TokenHolders() {
  const [selectedFilter, setSelectedFilter] = useState(TOKEN_HOLDER_FILTERS[0])
  const [filters, dispatch] = useReducer(reducer, INITIAL_STATE)
  const [{ data: tokenHoldersData, isLoading }, { data: sushiPrice }] = useQueries({
    queries: [
      { queryKey: ['token-holders', filters], queryFn: () => getTokenHolders(filters) },
      { queryKey: ['sushi-price'], queryFn: getSushiPriceUSD },
    ],
  })
  const sushiData = tokenHoldersData?.sushi
  const userCount: string = sushiData?.userCount ?? '0'
  const totalSupply: number = Math.trunc(+sushiData?.totalSupply ?? 0) / 1e18

  const users = useMemo(
    () =>
      tokenHoldersData?.users.map((user: UserGraphRes, i: number) => {
        const balance = Math.trunc(+user.balance) / 1e18

        return {
          id: user.id,
          rank: i + 1,
          name: user.id,
          quantity: balance,
          ownership: balance / totalSupply,
          value: balance * sushiPrice,
        }
      }) ?? [],
    [sushiPrice, tokenHoldersData?.users, totalSupply]
  )

  const [columns] = useState([
    columnHelper.accessor('rank', {
      header: 'Rank',
      cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
      size: 50,
      enableSorting: false,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <Link.External
          href={`https://etherscan.io/address/${info.getValue()}`}
          endIcon={<ExternalLinkIcon className="h-5 w-5" />}
          className="gap-2 font-bold"
        >
          {`${info.getValue().slice(0, 4)}...${info.getValue().slice(info.getValue().length - 3)}`}
        </Link.External>
      ),
      minSize: 200,
      enableSorting: false,
    }),
    columnHelper.accessor('quantity', {
      header: (h) => <div onClick={() => dispatch({ type: 'sort', payload: h.column.getIsSorted() })}>Quantity</div>,
      cell: (info) => (
        <span className="text-slate-300">
          {info.getValue().toLocaleString('EN', {
            maximumFractionDigits: 0,
          })}
        </span>
      ),
    }),
    columnHelper.accessor('ownership', {
      header: (h) => <div onClick={() => dispatch({ type: 'sort', payload: h.column.getIsSorted() })}>Ownership</div>,
      cell: (info) => (
        <span className="text-slate-300">
          {info.getValue().toLocaleString('EN', {
            maximumFractionDigits: 2,
          })}
          %
        </span>
      ),
    }),
    columnHelper.accessor('value', {
      header: (h) => <div onClick={() => dispatch({ type: 'sort', payload: h.column.getIsSorted() })}>Value</div>,
      cell: (info) =>
        info.getValue().toLocaleString('EN', {
          maximumFractionDigits: 0,
          style: 'currency',
          currency: 'USD',
        }),
    }),
  ])

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
              placeholder=""
              pageSize={Math.max(users.length, 5)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
