'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SelectIcon,
} from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

interface TeamMembers {
  team: {
    id: string
    members: { n: number }[]
  }
}

const columns = [
  {
    header: 'Email',
    accessorFn: () => 'lufy@sushi.com',
    enableSorting: false,
  },
  {
    header: 'Role',
    accessorFn: () => 'Member',
    enableSorting: false,
  },
  {
    header: 'Actions',
    cell: () => {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" role="combobox">
              <span>Actions</span>
              <SelectIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="!p-1 !overflow-x-hidden !overflow-y-scroll scroll w-[140px]"
            align="end"
            onOpenAutoFocus={(event) => {
              event.preventDefault()
            }}
          >
            <div className="space-y-1">
              <Button
                fullWidth
                variant="ghost"
                className="flex items-center !justify-normal text-green-500"
              >
                Promote
              </Button>
              <Button
                fullWidth
                variant="ghost"
                className="flex items-center !justify-normal text-red-500"
              >
                Remove
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )
    },
    meta: {
      header: {
        className: 'text-right',
      },
      body: {
        className: 'text-right',
      },
    },
  },
] satisfies ColumnDef<TeamMembers['team']['members'][number], unknown>[]

export function TeamMembers({ team: initialTeam }: TeamMembers) {
  const { data } = useQuery({
    queryKey: ['portal-team', initialTeam.id],
    queryFn: async () => {
      return initialTeam.members
    },
    initialData: initialTeam.members,
  })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Explore and manage members</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <DataTable columns={columns} data={data} loading={false} />
      </CardContent>
    </Card>
  )
}
