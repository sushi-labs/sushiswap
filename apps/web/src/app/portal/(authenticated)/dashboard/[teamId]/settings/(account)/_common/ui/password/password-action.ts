'use server'

import { getSessionData } from 'src/app/portal/_common/lib/client-config'
import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'
import { changeOrCreatePasswordSchema } from './password-form-schema'

export type FormState =
  | {
      error: string
    }
  | {
      error: string
      field: keyof (typeof changeOrCreatePasswordSchema)['_output']
    }
  | {
      success: true
    }

export async function changeOrCreatePasswordAction(
  data: FormData,
): Promise<FormState> {
  const formData = Object.fromEntries(data.entries())
  const result = changeOrCreatePasswordSchema.safeParse(formData)

  if (!result.success) {
    return { error: 'Invalid form data' }
  }

  const session = await getSessionData()

  if (!session.isLoggedIn) {
    return { error: 'Not logged in' }
  }

  try {
    const userServiceClient = getUserServiceClient()
    await userServiceClient.setPassword({
      $typeName: 'zitadel.user.v2.SetPasswordRequest',
      userId: session.user.id,
      verification: {
        case: undefined,
      },
      newPassword: {
        $typeName: 'zitadel.user.v2.Password',
        changeRequired: false,
        password: result.data.password,
      },
    })
  } catch (e) {
    console.error(e)
    return { error: 'Failed to change password' }
  }

  return { success: true }
}
