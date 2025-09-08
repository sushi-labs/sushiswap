'use server'

import { TextQueryMethod } from '@zitadel/proto/zitadel/object/v2/object_pb'
import { getBaseUrl } from 'src/app/portal/_common/lib/get-base-url'
import { getAdminStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'
import { forgotPasswordFormSchema } from './forgot-password-form-schema'

export type FormState =
  | {
      error: string
    }
  | {
      error: string
      field: keyof (typeof forgotPasswordFormSchema)['_output']
    }
  | {
      success: true
    }

export async function forgotPasswordAction(data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data.entries())
  const result = forgotPasswordFormSchema.safeParse(formData)

  if (!result.success) {
    return { error: 'Invalid form data' }
  }

  const userServiceClient = getUserServiceClient()
  let userResponse
  try {
    userResponse = await userServiceClient.listUsers({
      queries: [
        {
          $typeName: 'zitadel.user.v2.SearchQuery',
          query: {
            case: 'emailQuery',
            value: {
              $typeName: 'zitadel.user.v2.EmailQuery',
              emailAddress: result.data.email,
              method: TextQueryMethod.EQUALS_IGNORE_CASE,
            },
          },
        },
      ],
      query: {
        limit: 1,
      },
    })
  } catch (e) {
    console.error(e)
    return { error: 'Failed to reset password' }
  }

  if (userResponse.result.length === 0) {
    return {
      field: 'email',
      error:
        "We couldn't find an account with that email address. Please try again or register an account.",
    }
  }

  let resetResponse
  try {
    resetResponse = await userServiceClient.passwordReset({
      $typeName: 'zitadel.user.v2.PasswordResetRequest',
      medium: {
        case: 'returnCode',
        value: {
          $typeName: 'zitadel.user.v2.ReturnPasswordResetCode',
        },
      },
      userId: userResponse.result[0].userId,
    })
  } catch (e) {
    console.error(e)
    return { error: 'Failed to reset password' }
  }

  if (!resetResponse.verificationCode) {
    return { error: 'Failed to reset password' }
  }

  const client = getAdminStyroClient()
  try {
    await client.postAdminFrontendEmail({
      postAdminFrontendEmailRequest: {
        email: {
          type: 'reset_password',
          frontend: {
            baseUrl: await getBaseUrl(),
          },
          reset: {
            email: result.data.email,
            userId: userResponse.result[0].userId,
            code: resetResponse.verificationCode,
          },
        },
      },
    })
  } catch (e) {
    console.error(e)
    return { error: 'Failed to send email' }
  }

  return { success: true }
}
