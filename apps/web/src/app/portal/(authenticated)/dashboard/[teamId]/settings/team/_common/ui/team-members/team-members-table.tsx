'use client'

import type { StyroClient, StyroResults } from '@sushiswap/styro-client'
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
  SkeletonBox,
} from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import {
  useSession,
  useStyroClient,
} from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { TeamMembersDemoteAction } from './actions/demote'
import { TeamMembersPromoteAction } from './actions/promote'
import { TeamMembersRemoveAction } from './actions/remove'

type TeamWithMembers = StyroResults['getTeamsTeamIdMembers']['data']['team']

export type Member = TeamWithMembers['members'][number]

type TeamWithMember = Omit<TeamWithMembers, 'members'> & {
  member: Member
}

interface TeamMembersTable {
  team: TeamWithMembers
}

const columns = [
  {
    header: 'Email',
    accessorFn: (row) => row.member.user.email,
    enableSorting: false,
  },
  {
    header: 'Role',
    accessorFn: (row) => row.member.role,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.original.member.role}</div>
    ),
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      const session = useSession(true)
      const client = useStyroClient(true)

      const { data } = useQuery({
        queryKey: ['portal-getTeamsTeamIdMembersUserId', row.original.id],
        queryFn: async () => {
          const response = await client.getTeamsTeamIdMembersUserId({
            teamId: row.original.id,
            userId: session.user.id,
          })

          return response
        },
        select: (response) => response.data.member,
      })

      const actionProps = useMemo(
        () => ({
          teamId: row.original.id,
          member: row.original.member,
          activeUser: data!,
        }),
        [row.original.id, row.original.member, data],
      )

      if (actionProps.activeUser === undefined) {
        return (
          <div className="flex justify-end">
            <SkeletonBox className="w-[106px] h-[40px]" />
          </div>
        )
      }

      const actions = [
        <TeamMembersPromoteAction key="promote" {...actionProps} />,
        <TeamMembersDemoteAction key="demote" {...actionProps} />,
        <TeamMembersRemoveAction key="remove" {...actionProps} />,
      ]

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" role="combobox">
              <span>Actions</span>
              <SelectIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="!p-1 !overflow-x-hidden !overflow-y-scroll scroll !w-min min-w-[140px]"
            align="end"
            onOpenAutoFocus={(event) => {
              event.preventDefault()
            }}
          >
            <div className="space-y-1">
              <>
                {actions}
                <div className="only:block hidden text-center text-sm">
                  No actions available
                </div>
              </>
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
] satisfies ColumnDef<TeamWithMember, unknown>[]

export function TeamMembersTable({ team: initialTeam }: TeamMembersTable) {
  const client = useStyroClient(true)

  const { data } = useQuery({
    queryKey: ['portal-getTeamsTeamIdMembers', initialTeam.id],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdMembers({
        teamId: initialTeam.id,
      })

      return response.data.team
    },
    // TODO: Use prefetch queries instead of initialData
    initialData: initialTeam,
  })

  const formatted = useMemo(() => {
    return data.members.map<TeamWithMember>((member) => ({
      id: data.id,
      member,
    }))
  }, [data])

  return <DataTable columns={columns} data={formatted} loading={false} />
}
