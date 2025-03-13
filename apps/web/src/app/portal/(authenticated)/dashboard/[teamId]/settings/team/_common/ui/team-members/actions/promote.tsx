import { Button, Dots } from '@sushiswap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import type { Member } from '../team-members-table'

interface TeamMembersPromoteAction {
  teamId: string
  member: Member
  activeUser: Member
}

export function TeamMembersPromoteAction({
  teamId,
  member,
  activeUser,
}: TeamMembersPromoteAction) {
  const client = useStyroClient(true)
  const queryClient = useQueryClient()

  const { mutateAsync, variables, isPending } = useMutation({
    mutationKey: [
      'portal-patchTeamsTeamIdMembersUserId',
      'promote',
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

  const canPromoteTo = useMemo(() => {
    if (activeUser.role === 'owner') {
      if (member.role === 'viewer') {
        return ['owner', 'admin'] as const
      }

      if (member.role === 'admin') {
        return ['owner'] as const
      }
    }

    return [] as const
  }, [member, activeUser])

  return canPromoteTo.map((role) => (
    <Button
      key={`promote-${role}`}
      fullWidth
      variant="ghost"
      className="flex items-center !justify-normal text-green-500 min-w-[120px]"
      onClick={() => mutateAsync(role)}
    >
      {!isPending || variables !== role ? (
        <span>
          Promote to <span className="capitalize">{role}</span>
        </span>
      ) : (
        <span>
          Promoting
          <Dots />
        </span>
      )}
    </Button>
  ))
}
