'use server'

import { getSessionData } from "src/app/portal/_common/lib/client-config"
import { getUserServiceClient } from "src/app/portal/_common/lib/zitadel-client"

export async function resendCodeAction() {
  const session = await getSessionData()
  if (!session.isLoggedIn) {
    return { error: 'Not logged in' }
  }

  try {
    const userServiceClient = getUserServiceClient()
    await userServiceClient.resendEmailCode({
      $typeName: 'zitadel.user.v2.ResendEmailCodeRequest',
      userId: session.user.id,
      verification: {
        case: 'sendCode',
        value: {
          $typeName: 'zitadel.user.v2.SendEmailVerificationCode',
          urlTemplate: undefined, // TODO: Email template
        },
      },
    })
  } catch (e) {
    console.error(e)
    return { error: 'Failed to resend code' }
  }

  return { success: true }
}
