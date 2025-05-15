'use server'

import { redirect } from 'next/navigation'
import { getSession } from 'src/app/portal/_common/lib/client-config'
import { getSessionServiceClient } from './zitadel-client'

export async function logoutAction() {
  const session = await getSession()

  if (!session.isLoggedIn) {
    redirect('/portal')
    return
  }

  try {
    const sessionServiceClient = getSessionServiceClient()
    await sessionServiceClient.deleteSession(
      {
        $typeName: 'zitadel.session.v2.DeleteSessionRequest',
        sessionId: session.session.id,
        sessionToken: session.session.token,
      },
      { headers: { Authorization: '' } },
    )
  } catch (e) {
    console.error(e)
  }

  session.destroy()

  redirect('/portal')
  return
}
