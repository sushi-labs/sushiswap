import { Button } from '@sushiswap/ui'
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

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-patchTeamsTeamIdMembersUserId', teamId, member.id],
    mutationFn: async (role: Member['role']) => {
      await client.patchTeamsTeamIdMembersUserId({
        teamId,
        userId: member.id,
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

  const canPromoteTo = useMemo(() => {
    if (activeUser.role === 'owner') {
      if (member.role === 'admin') {
        return ['viewer'] as const
      }
    }

    return [] as const
  }, [member, activeUser])

  return canPromoteTo.map((role) => (
    <Button
      key={`demote-${role}`}
      fullWidth
      variant="ghost"
      className="flex items-center !justify-normal text-green-500"
      onClick={() => mutateAsync(role)}
    >
      Demote to <span className="capitalize">{role}</span>
    </Button>
  ))
}
