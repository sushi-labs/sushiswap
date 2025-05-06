// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from '@sushiswap/ui'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { useState } from 'react'

type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
]

const payments: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
]

const meta = {
  title: 'Primitives/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof DataTable>

export const Default = {
  render: () => {
    const [paginationState, setPaginationState] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

    return (
      <DataTable
        loading={false}
        columns={columns}
        data={payments}
        pagination={true}
        externalLink={true}
        onPaginationChange={setPaginationState}
        state={{
          pagination: paginationState,
        }}
      />
    )
  },
} satisfies Story
