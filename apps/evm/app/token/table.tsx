'use client'

import { formatUSD } from '@sushiswap/format'
import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'

export const TokenTable = ({
  tokens,
}: {
  tokens: { name: string; symbol: string; decimals: number; liquidityUsd: string; volumeUsd: string }[]
}) => (
  <Card>
    <CardHeader>
      <CardTitle>
        Tokens {tokens?.length ? <span className="text-gray-400 dark:text-slate-500">({tokens.length})</span> : null}
      </CardTitle>
    </CardHeader>
    <DataTable
      loading={!tokens}
      columns={[
        {
          id: 'index',
          header: '#',
          accessorFn: (_, i) => String(i + 1),
        },
        {
          id: 'name',
          header: 'Name',
          accessorFn: (row) => row.name,
        },
        {
          id: 'liquidityUsd',
          header: 'TVL',
          accessorFn: (row) => formatUSD(row.liquidityUsd),
        },
        {
          id: 'volumeUsd',
          header: 'Volume',
          accessorFn: (row) => formatUSD(row.volumeUsd),
        },
      ]}
      data={tokens}
    />
  </Card>
)
