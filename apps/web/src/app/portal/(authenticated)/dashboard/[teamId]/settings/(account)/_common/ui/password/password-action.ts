'use server'

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

  return { success: true }
}
