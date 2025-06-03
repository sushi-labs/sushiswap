'use server'

import { headers } from 'next/headers'
import { getSessionData } from 'src/app/portal/_common/lib/client-config'
import { getBaseUrl } from 'src/app/portal/_common/lib/get-base-url'
import { getAdminStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'

export async function resendCodeAction() {
  const session = await getSessionData()
  if (!session.isLoggedIn) {
    return { error: 'Not logged in' }
  }

  try {
    const userServiceClient = getUserServiceClient()
    const response = await userServiceClient.resendEmailCode({
      $typeName: 'zitadel.user.v2.ResendEmailCodeRequest',
      userId: session.user.id,
      verification: {
        case: 'returnCode',
        value: {
          $typeName: 'zitadel.user.v2.ReturnEmailVerificationCode',
        },
      },
    })

    if (!response.verificationCode) {
      return { error: 'Failed to resend code' }
    }

    const client = getAdminStyroClient()
    await client.postAdminFrontendEmail({
      postAdminFrontendEmailRequest: {
        email: {
          type: 'verify_email',
          frontend: {
            baseUrl: await getBaseUrl(),
          },
          verification: {
            code: response.verificationCode,
            email: session.user.email.email,
          },
        },
      },
    })
  } catch (e) {
    console.error(e)
    return { error: 'Failed to resend code' }
  }

  return { success: true }
}
