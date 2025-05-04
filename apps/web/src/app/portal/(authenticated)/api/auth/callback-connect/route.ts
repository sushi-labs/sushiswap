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
  redirect: z.string().url(),
  csrf: z.string(),
})

async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const result = schema.safeParse({
    id: url.searchParams.get('id'),
    token: url.searchParams.get('token'),
    user: url.searchParams.get('user'),
    redirect: url.searchParams.get('redirect'),
    csrf: url.searchParams.get('csrf'),
  })

  if (!result.success) {
    return new Response(JSON.stringify(result.error, null, 2), { status: 400 })
  }

  const cookiez = req.cookies
  const csrfToken = cookiez.get('csrf')

  if (!csrfToken) {
    return new Response('Missing CSRF token', { status: 400 })
  }

  if (csrfToken.value !== result.data.csrf) {
    return new Response('Invalid CSRF token', { status: 400 })
  }

  const redirectUrl = new URL(result.data.redirect)
  // Ensure the host header is the same in the redirect url

  if (redirectUrl.host !== req.headers.get('host')) {
    return new Response('Invalid redirect url', { status: 400 })
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
    return new Response('User with this connection already exists', {
      status: 412,
    })
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
    await userServiceClient.addIDPLink({
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
