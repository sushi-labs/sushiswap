'use server'

import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'
import { createSession } from 'src/app/portal/_common/lib/client-config'
import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'
import { isPromiseRejected } from 'sushi'
import { createZitadelSession } from '../../../../(unauthenticated)/_common/lib/create-zitadel-session'
import { loginFormSchema } from './login-form-schema'

export type FormState =
  | {
      error: string
    }
  | {
      error: string
      field: keyof (typeof loginFormSchema)['_output']
    }
  | {
      success: true
      redirect: '/portal/dashboard' | '/portal/verify'
    }

export async function loginAction(data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data.entries())
  const result = loginFormSchema.safeParse(formData)

  if (!result.success) {
    return { error: 'Invalid form data' }
  }

  try {
    const [session, user] = await Promise.allSettled([
      createZitadelSession({ type: 'password', ...result.data }),
      fetchZitadelUser(result.data.email),
    ])

    if (isPromiseRejected(session)) {
      const e = session.reason
      if (e instanceof Error && 'code' in e && typeof e.code === 'number') {
        switch (e.code) {
          case 3:
            return { error: 'Invalid password', field: 'password' }
          case 5:
            return { error: 'Email not found', field: 'email' }
        }
      }
      return { error: 'An unknown error occured' }
    }

    if (isPromiseRejected(user)) {
      return { error: 'Failed to fetch user' }
    }

    await createSession({
      session: {
        id: session.value.sessionId,
        token: session.value.sessionToken,
      },
      user: {
        id: user.value.userId,
        email: {
          isVerified: user.value.type.value.email.isVerified,
          email: user.value.type.value.email.email,
        },
      },
    })

    if (!user.value.type.value.email.isVerified) {
      return { success: true, redirect: '/portal/verify' }
    } else {
      return { success: true, redirect: '/portal/dashboard' }
    }
  } catch (e) {
    if (isRedirectError(e)) {
      throw e
    }

    console.error(e)
    return { error: 'An unknown error occured' }
  }
}

async function fetchZitadelUser(email: string) {
  const userServiceClient = getUserServiceClient()

  return userServiceClient
    .listUsers(
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
    .then((res) => {
      if (res.result.length > 0) {
        const user = res.result[0]
        if (user.type.case !== 'human') {
          throw new Error('Machine users are not allowed')
        }

        if (!user.type.value.email) {
          throw new Error('User has no email')
        }

        return {
          ...user,
          type: {
            ...user.type,
            value: {
              ...user.type.value,
              email: user.type.value.email,
            },
          },
        }
      }
      throw new Error('User not found')
    })
}
