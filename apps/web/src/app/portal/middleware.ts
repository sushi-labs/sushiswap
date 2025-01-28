import { type NextRequest, NextResponse } from 'next/server'
import { getSessionData } from './_common/lib/client-config'

export async function portalMiddleware(request: NextRequest) {
  const session = await getSessionData()

  if (!session.isLoggedIn) {
    return
  }

  if (!session.user.email.isVerified) {
    console.log(request.nextUrl)
    if (request.nextUrl.pathname !== '/portal/register/verify') {
      console.log('redirect')
      return NextResponse.redirect(
        `${request.nextUrl.protocol}/${request.nextUrl.host}/portal/register/verify`,
      )
    }
  }

  return
}
