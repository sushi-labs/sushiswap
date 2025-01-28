import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import {
  createSession,
  getSession,
} from 'src/app/portal/_common/lib/client-config'
import { z } from 'zod'
import { getSessionServiceClient } from '../../../_common/lib/zitadel-client'
import { getIdpIntent } from './lib/get-idp-intent'
import { getUserById } from './lib/get-user-by-id'
import { login } from './lib/login'
import { register } from './lib/register'

const schema = z.object({
  id: z.string(),
  token: z.string(),
  user: z.string().nullable(),
})

async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const result = schema.safeParse({
    id: url.searchParams.get('id'),
    token: url.searchParams.get('token'),
    user: url.searchParams.get('user'),
  })

  if (!result.success) {
    return new Response(JSON.stringify(result.error, null, 2), { status: 400 })
  }

  const data = result.data
  let email: string | undefined

  if (!data.user) {
    // Register
    const idpIntent = await getIdpIntent(data.id, data.token)
    const { userId } = await register(idpIntent)
    data.user = userId
    email = idpIntent.idpInformation.rawInformation.email
  }

  const session = await login({
    userId: data.user,
    idpIntentId: data.id,
    idpIntentToken: data.token,
  })

  if (!email) {
    const user = await getUserById(data.user)
    if (user.state !== 'USER_STATE_ACTIVE') {
      return new Response('User is not active', { status: 400 })
    }

    email = user.human.email.email
  }

  const previousSession = await getSession()
  let logoutP: Promise<any> | null = null
  if (previousSession.isLoggedIn) {
    const sessionServiceClient = getSessionServiceClient()
    logoutP = sessionServiceClient.deleteSession({
      $typeName: 'zitadel.session.v2.DeleteSessionRequest',
      sessionId: previousSession.session.id,
      sessionToken: previousSession.session.token,
    })
  }

  await createSession({
    session: {
      id: session.sessionId,
      token: session.sessionToken,
    },
    user: {
      id: data.user,
      email: {
        email,
        isVerified: true,
      },
    },
  })

  await logoutP

  return redirect('/portal')
}

export { GET }
