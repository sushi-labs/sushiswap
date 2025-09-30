import { type NextRequest, NextResponse } from 'next/server'
import { getSessionData } from './_common/lib/client-config'

export async function portalMiddleware(request: NextRequest) {
  const session = await getSessionData()

  if (!session.isLoggedIn) {
    return NextResponse.next()
  }

  if (!session.user.email.isVerified) {
    if (request.nextUrl.pathname !== '/portal/verify') {
      return NextResponse.redirect(
        `${request.nextUrl.protocol}/${request.nextUrl.host}/portal/verify`,
      )
    }
  }

  return NextResponse.next()
}
