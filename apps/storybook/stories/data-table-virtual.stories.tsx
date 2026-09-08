import type { Meta, StoryObj } from '@storybook/react'
import { DataTableVirtual } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
const meta = {
  title: 'Primitives/DataTableVirtual',
  component: DataTableVirtual,
} satisfies Meta<typeof DataTableVirtual>

export default meta
type Story = StoryObj<typeof DataTableVirtual>

type Position = { token: string; balance: number }
const columns: ColumnDef<Position>[] = [
  { accessorKey: 'token', header: 'Token' },
  { accessorKey: 'balance', header: 'Balance' },
]
const data = Array.from({ length: 100 }, (_, i) => ({
  token: `Position ${i + 1}`,
  balance: (i + 1) * 10,
}))
export const Default = {
  render: () => (
    <div className="h-80">
      <DataTableVirtual columns={columns} data={data} loading={false} />
    </div>
  ),
} satisfies Story
export const Loading = {
  render: () => (
    <div className="h-80">
      <DataTableVirtual columns={columns} data={[]} loading />
    </div>
  ),
} satisfies Story
export const Empty = {
  render: () => (
    <div className="h-80">
      <DataTableVirtual columns={columns} data={[]} loading={false} />
    </div>
  ),
} satisfies Story
