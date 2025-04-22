import { useQuery } from '@tanstack/react-query'
import { useSession, useStyroClient } from '../../auth-provider/auth-provider'
import { CheckerRole, type roles } from './checker-role'

interface CheckerRoleClient {
  requiredRole: (typeof roles)[number]
  message: string
  teamId: string
  disabled?: boolean
  children(disabled: boolean): React.ReactNode
}

export function CheckerRoleClient({
  children,
  message,
  teamId,
  disabled,
  requiredRole,
}: CheckerRoleClient) {
  const session = useSession(true)
  const client = useStyroClient(true)

  const { data } = useQuery({
    queryKey: ['portal-getTeamsTeamIdMembersUserId', teamId, session.user.id],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdMembersUserId({
        teamId: teamId,
        userId: session.user.id,
      })

      return response
    },
    select: (response) => response.data,
  })

  if (!data) {
    return (
      <CheckerRole disabled={disabled} loading>
        {children}
      </CheckerRole>
    )
  }

  return (
    <CheckerRole
      message={message}
      disabled={disabled}
      requiredRole={requiredRole}
      actualRole={data?.member.role}
    >
      {children}
    </CheckerRole>
  )
}
