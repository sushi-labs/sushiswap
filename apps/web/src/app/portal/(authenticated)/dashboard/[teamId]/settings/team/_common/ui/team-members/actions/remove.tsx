import { Button, Dots } from '@sushiswap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import type { Member } from '../team-members-table'

interface TeamMembersRemoveAction {
  teamId: string
  member: Member
  activeUser: Member
}

export function TeamMembersRemoveAction({
  teamId,
  member,
  activeUser,
}: TeamMembersRemoveAction) {
  const client = useStyroClient(true)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [
      'portal-deleteTeamsTeamIdMembersUserId',
      teamId,
      member.user.id,
    ],
    mutationFn: async () => {
      await client.deleteTeamsTeamIdMembersUserId({
        teamId,
        userId: member.user.id,
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['portal-getTeamsTeamIdMembers', teamId],
      })
    },
  })

  const canRemove = useMemo(() => {
    if (activeUser.role === 'owner') {
      if (member.role === 'admin' || member.role === 'viewer') {
        return true
      }
    }

    if (activeUser.role === 'admin') {
      if (member.role === 'viewer') {
        return true
      }
    }

    return false
  }, [member, activeUser])

  return (
    <>
      {canRemove ? (
        <Button
          key={`remove`}
          fullWidth
          variant="ghost"
          className="flex items-center !justify-normal text-red-500"
          onClick={() => mutateAsync()}
          disabled={isPending}
        >
          {!isPending ? (
            'Remove'
          ) : (
            <span>
              Removing
              <Dots />
            </span>
          )}
        </Button>
      ) : null}
    </>
  )
}
