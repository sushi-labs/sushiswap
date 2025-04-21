import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getSessionData } from 'src/app/portal/_common/lib/client-config'
import { getIdpIntent } from 'src/app/portal/_common/lib/get-idp-intent'
import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'
import { z } from 'zod'

const schema = z.object({
  id: z.string(),
  token: z.string(),
  user: z.string().nullable(),
  redirect: z.string(),
})

async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const result = schema.safeParse({
    id: url.searchParams.get('id'),
    token: url.searchParams.get('token'),
    user: url.searchParams.get('user'),
    redirect: url.searchParams.get('redirect'),
  })

  if (!result.success) {
    return new Response(JSON.stringify(result.error, null, 2), { status: 400 })
  }

  let intent: Awaited<ReturnType<typeof getIdpIntent>>
  try {
    intent = await getIdpIntent(result.data.id, result.data.token)
  } catch (e) {
    console.error(e)
    return new Response('Failed to get IDP intent', { status: 500 })
  }

  const session = await getSessionData()

  if (!session.isLoggedIn) {
    return new Response('Not logged in', { status: 412 })
  }

  if (result.data.user !== null) {
    return new Response('User already exists', { status: 412 })
  }

  const userServiceClient = getUserServiceClient()

  const user = await userServiceClient.getUserByID({
    $typeName: 'zitadel.user.v2.GetUserByIDRequest',
    userId: session.user.id,
  })

  if (user.user?.type.case !== 'human') {
    return new Response('Not a human user', { status: 412 })
  }

  try {
    userServiceClient.addIDPLink({
      $typeName: 'zitadel.user.v2.AddIDPLinkRequest',
      userId: session.user.id,
      idpLink: {
        $typeName: 'zitadel.user.v2.IDPLink',
        idpId: intent.idpInformation.idpId,
        userId: intent.idpInformation.userId,
        userName: user.user.username,
      },
    })
  } catch (e) {
    console.error(e)
    return new Response('Failed to add IDP link', { status: 500 })
  }

  return redirect(result.data.redirect)
}

export { GET }
