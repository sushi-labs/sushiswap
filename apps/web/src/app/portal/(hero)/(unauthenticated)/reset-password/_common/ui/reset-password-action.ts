'use server'

import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'
import { resetPasswordFormSchema } from './reset-password-form-schema'

export type FormState =
  | {
      error: string
    }
  | {
      error: string
      field: keyof (typeof resetPasswordFormSchema)['_output']
    }
  | {
      success: true
    }

export async function resetPasswordAction(data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data.entries())
  const result = resetPasswordFormSchema.safeParse(formData)

  if (!result.success) {
    return { error: 'Invalid form data' }
  }

  const userServiceClient = getUserServiceClient()
  try {
    await userServiceClient.setPassword({
      $typeName: 'zitadel.user.v2.SetPasswordRequest',
      userId: result.data.userId,
      verification: {
        case: 'verificationCode',
        value: result.data.code,
      },
      newPassword: {
        $typeName: 'zitadel.user.v2.Password',
        changeRequired: false,
        password: result.data.password,
      },
    })
  } catch (e) {
    console.error(e)

    if (e instanceof Error && 'code' in e && typeof e.code === 'number') {
      switch (e.code) {
        case 3: {
          return {
            error: 'Invalid code, please request a new one',
          }
        }
      }
    }

    return { error: 'Failed to reset password' }
  }

  return { success: true }
}
