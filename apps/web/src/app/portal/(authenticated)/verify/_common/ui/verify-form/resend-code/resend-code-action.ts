'use server'

import { headers } from 'next/headers'
import { getSessionData } from 'src/app/portal/_common/lib/client-config'
import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'

export async function resendCodeAction() {
  const session = await getSessionData()
  if (!session.isLoggedIn) {
    return { error: 'Not logged in' }
  }

  const headers_ = await headers()
  const host = headers_.get('Host')!
  const proto = headers_.get('X-Forwarded-Proto') || 'https'

  try {
    const userServiceClient = getUserServiceClient()
    await userServiceClient.resendEmailCode({
      $typeName: 'zitadel.user.v2.ResendEmailCodeRequest',
      userId: session.user.id,
      verification: {
        case: 'sendCode',
        value: {
          $typeName: 'zitadel.user.v2.SendEmailVerificationCode',
          urlTemplate: `${proto}://${host}/portal/email/verify-email?code={{.Code}}`,
        },
      },
    })
  } catch (e) {
    console.error(e)
    return { error: 'Failed to resend code' }
  }

  return { success: true }
}
