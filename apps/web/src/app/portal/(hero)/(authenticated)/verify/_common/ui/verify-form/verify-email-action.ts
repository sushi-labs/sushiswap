'use server'

import { redirect } from 'next/navigation'
import { getSession } from 'src/app/portal/_common/lib/client-config'
import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'
import { verifyEmailFormSchema } from './verify-form-schema'

export type FormState =
  | {
      error: string
    }
  | {
      error: string
      field: keyof (typeof verifyEmailFormSchema)['_output']
    }
  | {
      success: true
    }

export async function verifyEmailAction(data: FormData): Promise<FormState> {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return { error: 'Not logged in' }
  }

  const formData = Object.fromEntries(data.entries())
  const result = verifyEmailFormSchema.safeParse(formData)

  if (!result.success) {
    return { error: 'Invalid form data' }
  }

  try {
    const userServiceClient = getUserServiceClient()
    await userServiceClient.verifyEmail({
      $typeName: 'zitadel.user.v2.VerifyEmailRequest',
      userId: session.user.id,
      verificationCode: result.data.code,
    })

    session.user.email.isVerified = true
    await session.save()
  } catch (e) {
    console.error(e)
    if (e instanceof Error && 'code' in e && typeof e.code === 'number') {
      switch (e.code) {
        case 3: {
          return { error: 'Invalid code', field: 'code' }
        }
      }
    }
  }

  return { success: true }
}
