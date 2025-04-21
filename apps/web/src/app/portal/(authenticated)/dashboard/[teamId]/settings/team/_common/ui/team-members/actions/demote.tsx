import { Button, Dots } from '@sushiswap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import type { Member } from '../team-members-table'

interface TeamMembersDemoteAction {
  teamId: string
  member: Member
  activeUser: Member
}

export function TeamMembersDemoteAction({
  teamId,
  member,
  activeUser,
}: TeamMembersDemoteAction) {
  const client = useStyroClient(true)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [
      'portal-patchTeamsTeamIdMembersUserId',
      'demote',
      teamId,
      member.id,
    ],
    mutationFn: async (role: Member['role']) => {
      await client.patchTeamsTeamIdMembersUserId({
        teamId,
        userId: member.user.id,
        patchTeamsTeamIdMembersUserIdRequest: {
          role,
        },
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['portal-getTeamsTeamIdMembers', teamId],
      })
    },
  })

  const canDemoteTo = useMemo(() => {
    if (activeUser.role === 'owner') {
      if (member.role === 'admin') {
        return ['viewer'] as const
      }
    }

    return [] as const
  }, [member, activeUser])

  return canDemoteTo.map((role) => (
    <Button
      key={`demote-${role}`}
      fullWidth
      variant="ghost"
      className="flex items-center !justify-normal text-red-500"
      onClick={() => mutateAsync(role)}
    >
      {!isPending ? (
        <span>
          Demote to <span className="capitalize">{role}</span>
        </span>
      ) : (
        <span>
          Demoting
          <Dots />
        </span>
      )}
    </Button>
  ))
}
