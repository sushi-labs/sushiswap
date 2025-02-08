import { getSessionData } from 'src/app/portal/_common/lib/client-config'

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

  // TODO: Checks
  const checks = {
    teamMembership: true,
  }

  return {
    checks,
    canDelete: !Object.values(checks).some((check) => !check),
  }
}
