'use server'

import { CreateSessionResponse } from '@zitadel/proto/zitadel/session/v2/session_service_pb'
import { AddHumanUserResponse } from '@zitadel/proto/zitadel/user/v2/user_service_pb'
import { redirect } from 'next/navigation'
import { createZitadelSession } from 'src/app/portal/(unauthenticated)/_common/lib/create-zitadel-session'
import { getUserServiceClient } from 'src/app/portal/(unauthenticated)/_common/lib/zitadel-client'
import { createSession } from 'src/app/portal/_common/lib/client-config'
import { z } from 'zod'
import { registerFormSchema } from './register-form-schema'

export type FormState =
  | {
      error: string
    }
  | {
      error: string
      field: keyof (typeof registerFormSchema)['_output']
    }
  | {
      success: true
    }

export async function registerAction(data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data.entries())
  const result = registerFormSchema.safeParse(formData)

  if (!result.success) {
    return { error: 'Invalid form data' }
  }

  // Check for existing users (with the same email)
  try {
    const existingUsers = await fetchZitadelUsers(result.data.email)
    if (existingUsers.result.length > 0) {
      return {
        error: 'An user with this e-mail already exists',
        field: 'email',
      }
    }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to check for existing users' }
  }

  // Create a new user
  let user: AddHumanUserResponse
  try {
    user = await createZitadelUser(result.data)
  } catch (e) {
    console.error(e)
    return { error: 'Failed to create user' }
  }

  // Create a session for the user
  let session: CreateSessionResponse
  try {
    session = await createZitadelSession({
      email: result.data.email,
      password: result.data.password,
    })
  } catch (e) {
    console.error(e)
    return { error: 'Failed to create session' }
  }

  // Create a session in the app (sets cookies)
  await createSession({
    session: {
      id: session.sessionId,
      token: session.sessionToken,
    },
    user: {
      id: user.userId,
      email: {
        email: result.data.email,
        isVerified: false,
      },
    },
  })

  redirect('/portal/register/verify')

  return { success: true }
}

async function fetchZitadelUsers(email: string) {
  const userServiceClient = getUserServiceClient()
  const existingUsers = await userServiceClient.listUsers(
    {
      queries: [
        {
          $typeName: 'zitadel.user.v2.SearchQuery',
          query: {
            case: 'emailQuery',
            value: {
              $typeName: 'zitadel.user.v2.EmailQuery',
              method: 0, // Equals
              emailAddress: email,
            },
          },
        },
      ],
    },
    {},
  )

  return existingUsers
}

async function createZitadelUser(data: z.infer<typeof registerFormSchema>) {
  const userServiceClient = getUserServiceClient()
  const user = await userServiceClient.addHumanUser({
    email: {
      email: data.email,
      verification: {
        case: 'sendCode',
        value: {},
        // TODO: Template
      },
    },
    profile: {
      givenName: '-',
      familyName: '-',
    },
    passwordType: {
      case: 'password',
      value: {
        password: data.password,
      },
    },
  })

  return user
}
