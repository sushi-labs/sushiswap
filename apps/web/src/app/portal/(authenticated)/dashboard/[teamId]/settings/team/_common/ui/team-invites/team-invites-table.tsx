'use client'

import type { StyroResults } from '@sushiswap/styro-client'
import {
  Button,
  DataTable,
  Dots,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import {
  useSession,
  useStyroClient,
} from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { CheckerRoleClient } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-client'

type TeamWithInvites = {
  id: string
  invites: StyroResults['getTeamsTeamIdInvites']['data']['invites']
}

export type Invite = TeamWithInvites['invites'][number]

type TeamWithInvite = Omit<TeamWithInvites, 'invites'> & {
  invite: Invite
}

interface TeamInvitesTable {
  team: TeamWithInvites
}

const columns = [
  {
    header: 'Email',
    accessorFn: (row) => row.invite.email,
    enableSorting: false,
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      const session = useSession(true)
      const client = useStyroClient(true)
      const queryClient = useQueryClient()

      const { data } = useQuery({
        queryKey: ['portal-getTeamsTeamIdMembersUserId', row.original.id],
        queryFn: async () => {
          const response = await client.getTeamsTeamIdMembersUserId({
            teamId: row.original.id,
            userId: session.user.id,
          })

          return response.data.member
        },
      })

      const { mutateAsync, isPending } = useMutation({
        mutationKey: [
          'portal-deleteTeamsTeamIdInvitesInviteId',
          row.original.id,
          row.original.invite.id,
        ],
        mutationFn: async () => {
          await client.deleteTeamsTeamIdInvitesInviteId({
            teamId: row.original.id,
            inviteId: row.original.invite.id,
          })
        },
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: ['portal-getTeamsTeamIdInvites', row.original.id],
          })
        },
      })

      const error =
        data?.role === 'viewer'
          ? 'You do not have permission to cancel invites'
          : null

      const canSubmit = !error && !isPending

      return (
        <CheckerRoleClient
          requiredRole="admin"
          teamId={row.original.id}
          message="Only admins and owners can cancel invites"
        >
          {(disabled) => (
            <Button
              variant="secondary"
              disabled={disabled || !canSubmit}
              onClick={() => mutateAsync()}
            >
              {!isPending ? (
                'Cancel'
              ) : (
                <span>
                  Cancelling
                  <Dots />
                </span>
              )}
            </Button>
          )}
        </CheckerRoleClient>
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
] satisfies ColumnDef<TeamWithInvite, unknown>[]

export function TeamInvitesTable({ team: initialTeam }: TeamInvitesTable) {
  const client = useStyroClient(true)

  const { data } = useQuery({
    queryKey: ['portal-getTeamsTeamIdInvites', initialTeam.id],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdInvites({
        teamId: initialTeam.id,
      })

      return { id: initialTeam.id, invites: response.data.invites }
    },
    initialData: initialTeam,
  })

  const formatted = useMemo(() => {
    return data.invites.map<TeamWithInvite>((invite) => ({
      id: data.id,
      invite,
    }))
  }, [data])

  return <DataTable columns={columns} data={formatted} loading={false} />
}
