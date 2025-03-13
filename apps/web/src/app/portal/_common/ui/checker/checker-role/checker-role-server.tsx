import { Suspense } from 'react'
import { getLoggedInSessionData } from '../../../lib/client-config'
import { getStyroClient } from '../../../lib/styro/styro-client'
import { CheckerRole, type roles } from './checker-role'

interface CheckerRoleServer {
  requiredRole: (typeof roles)[number]
  message: string
  teamId: string
  disabled?: boolean
  children(disabled: boolean): React.ReactNode
}

export function CheckerRoleServer(props: CheckerRoleServer) {
  return (
    <Suspense key="portal-checker-role" fallback={props.children(true)}>
      <_CheckerRoleServer {...props} />
    </Suspense>
  )
}

async function _CheckerRoleServer({
  children,
  message,
  teamId,
  disabled,
  requiredRole,
}: CheckerRoleServer) {
  const session = await getLoggedInSessionData()

  const client = await getStyroClient()
  const response = await client.getTeamsTeamIdMembersUserId({
    teamId: teamId,
    userId: session.user.id,
  })

  return (
    <CheckerRole
      message={message}
      requiredRole={requiredRole}
      disabled={disabled}
      actualRole={response.data.member.role}
    >
      {children}
    </CheckerRole>
  )
}
