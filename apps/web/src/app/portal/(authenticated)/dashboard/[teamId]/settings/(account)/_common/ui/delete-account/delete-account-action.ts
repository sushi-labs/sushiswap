'use server'

import { getSessionData } from 'src/app/portal/_common/lib/client-config'
import { logoutAction } from 'src/app/portal/_common/lib/logout-action'
import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'
import { getDeleteAccountChecklist } from './delete-account-checks'

export type FormState =
  | {
      error: string
    }
  | {
      success: true
    }

export async function deleteAccountAction(): Promise<FormState> {
  const session = await getSessionData()

  if (!session.isLoggedIn) {
    return { error: 'User is not logged in' }
  }

  const checklist = await getDeleteAccountChecklist()

  if (!checklist.canDelete) {
    return { error: 'User cannot delete account' }
  }

  try {
    const userServiceClient = getUserServiceClient()
    await userServiceClient.deleteUser({
      $typeName: 'zitadel.user.v2.DeleteUserRequest',
      userId: session.user.id,
    })
  } catch (e) {
    console.error(e)
    return { error: 'Failed to delete user' }
  }

  // Handles the /portal redirect as well
  await logoutAction()

  return { success: true }
}
