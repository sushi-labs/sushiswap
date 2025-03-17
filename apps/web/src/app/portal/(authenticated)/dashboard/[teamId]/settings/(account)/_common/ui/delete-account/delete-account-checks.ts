import { getSessionData } from 'src/app/portal/_common/lib/client-config'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'

export type DeleteAccountChecklist = {
  checks?: {
    teamMembership: boolean
  }
  canDelete: boolean
}

export async function getDeleteAccountChecklist(): Promise<DeleteAccountChecklist> {
  const session = await getSessionData()

  if (!session.isLoggedIn) {
    return { canDelete: false }
  }

  const client = await getUserStyroClient()
  const response = await client.getUsersMe()

  // TODO: Checks
  const checks = {
    teamMembership: response.data.user.teams.every(
      (team) => team.type === 'personal',
    ),
  }

  return {
    checks,
    canDelete: !Object.values(checks).some((check) => !check),
  }
}
